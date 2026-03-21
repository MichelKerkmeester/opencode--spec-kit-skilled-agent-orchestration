---
title: "Feature Specification: sk-prompt-improver OpenCode Skill [template:level_3/spec.md]"
description: "Convert the standalone Prompt Improver AI system into an OpenCode-native skill with integrated prompt engineering frameworks, DEPTH thinking methodology, and triple scoring systems."
trigger_phrases:
  - "sk-prompt-improver"
  - "prompt engineering skill"
  - "prompt improvement"
  - "RCAF COSTAR frameworks"
  - "prompt frameworks"
importance_tier: "important"
contextType: "implementation"
---

# Feature Specification: sk-prompt-improver

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

<!-- WHEN TO USE THIS TEMPLATE:
Level 3 (+Arch) is appropriate when:
- Changes affect 500+ lines of code
- Architecture decisions need formal documentation (ADRs)
- Executive summary needed for stakeholders
- Risk matrix required
- 4-8 user stories
- Multiple teams or cross-functional work

DO NOT use Level 3 if:
- Simple feature (use Level 1)
- Only verification needed (use Level 2)
- Governance approval workflow required (use Level 3+)
- Compliance checkpoints needed (use Level 3+)
- Multi-agent parallel execution coordination (use Level 3+)
-->

---

## EXECUTIVE SUMMARY

Convert the standalone Prompt Improver AI system (v0.200) into an OpenCode-native skill (`sk-prompt-improver`) that provides integrated prompt engineering capabilities directly within the coding environment. The skill packages 10 proven prompt frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT, VIBE, FRAME, MOTION), the DEPTH thinking methodology, and triple scoring systems (CLEAR/EVOKE/VISUAL) into the OpenCode skill architecture for seamless on-demand invocation.

**Key Decisions**: Integrate all 10 frameworks via references/ knowledge base; implement signal-based routing for 10 operating modes (Interactive, Text, Short, Improve, Refine, JSON, YAML, Visual, Image, Video); use skill_advisor.py for intelligent mode detection.

**Critical Dependencies**: Source system documentation at `/Users/michelkerkmeester/MEGA/Development/AI Systems/Barter/1. Prompt Improver/`; skill_advisor.py intent booster registration.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-01 |

<!-- ANCHOR:metadata -->
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->

## 2. PROBLEM & PURPOSE

### Problem Statement

The Prompt Improver is a comprehensive, standalone Claude Project that provides advanced prompt engineering capabilities (10 frameworks, DEPTH methodology, triple scoring). However, it requires manual setup and cannot be invoked from within OpenCode workflows. Developers currently must switch tools to access prompt engineering assistance, breaking their development flow and preventing integration with the orchestration system.

### Purpose

Create a fully functional `sk-prompt-improver` OpenCode skill that enables developers to invoke prompt engineering directly from their coding environment via skill_advisor.py routing, transforming vague inputs into structured, scored AI prompts using proven frameworks integrated into the development workflow.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->

## 3. SCOPE

### In Scope

- SKILL.md with all required sections (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES) following sk-doc standards
- references/ directory containing adapted knowledge base documents for all 10 prompt frameworks
- DEPTH thinking framework documentation and integration guidance
- Triple scoring systems documentation (CLEAR precision, EVOKE UI concepting, VISUAL image/video)
- Signal-based routing logic for 10 operating modes (Interactive, Text, Short, Improve, Refine, JSON, YAML, Visual, Image, Video)
- Skill advisor registration and intent booster configuration
- Level 3 spec folder documentation (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)

### Out of Scope

- Modifying the original Prompt Improver source system (preserve as reference)
- Automated testing framework for prompt output validation
- Export/output file management (handled by host OpenCode environment)
- MCP server integration or CLI tool creation
- Custom training or fine-tuning of scoring models
- Multi-language support beyond English

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-prompt-improver/SKILL.md` | Create | Main skill definition with WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES sections |
| `.opencode/skill/sk-prompt-improver/references/frameworks.md` | Create | All 10 prompt frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT, VIBE, FRAME, MOTION) |
| `.opencode/skill/sk-prompt-improver/references/depth_framework.md` | Create | DEPTH thinking methodology (10-round approach) |
| `.opencode/skill/sk-prompt-improver/references/scoring_systems.md` | Create | Triple scoring documentation (CLEAR, EVOKE, VISUAL) |
| `.opencode/skill/sk-prompt-improver/references/operating_modes.md` | Create | Signal-based routing and 10 operating modes |
| `.opencode/skill/sk-prompt-improver/references/knowledge_base.md` | Create | System prompts, templates, and visual/image/video reference materials |
| `.opencode/skill/scripts/skill_advisor.py` | Modify | Add sk-prompt-improver intent boosters and confidence thresholds |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md follows sk-doc template structure | SKILL.md passes `package_skill.py` validation; contains all required sections (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES); < 5000 words |
| REQ-002 | All 10 prompt frameworks accessible and documented | Each framework (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT, VIBE, FRAME, MOTION) documented in references/frameworks.md with structure and example usage |
| REQ-003 | DEPTH thinking framework integrated | references/depth_framework.md exists and documents the 10-round methodology; referenced in SKILL.md HOW IT WORKS section |
| REQ-004 | Skill advisor routes "prompt improve" queries correctly | `skill_advisor.py "improve my prompt"` returns sk-prompt-improver with confidence >= 0.8; intent boosters registered |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Triple scoring systems documented | CLEAR (precision), EVOKE (UI concepting), VISUAL (image/video) systems fully described in references/scoring_systems.md with scoring rubrics |
| REQ-006 | Signal-based routing for mode detection | Operating modes (Interactive, Text, Short, Improve, Refine, JSON, YAML, Visual, Image, Video) documented with signal detection logic in references/operating_modes.md or SKILL.md SMART ROUTING section |
| REQ-007 | Knowledge base materials included | System prompts, templates, and visual/image/video reference materials packaged in references/knowledge_base.md for skill user access |
| REQ-008 | Spec folder documentation complete | plan.md, tasks.md, checklist.md, decision-record.md created and validated; all P0 requirements mapped to tasks |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->

## 5. SUCCESS CRITERIA

- **SC-001**: `python skill_advisor.py "improve my prompt"` returns sk-prompt-improver with confidence >= 0.8 (or user-verified mode detection)
- **SC-002**: SKILL.md exists, < 5000 words, passes `package_skill.py` validation, contains all 5 required sections (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES)
- **SC-003**: All 10 operating modes (Interactive, Text, Short, Improve, Refine, JSON, YAML, Visual, Image, Video) documented and routable via signal-based detection
- **SC-004**: User can read SKILL.md and references/*.md to successfully invoke sk-prompt-improver for prompt engineering tasks in their development workflow

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Source Prompt Improver system documentation | Completeness of frameworks/scoring systems | Maintain reference copy at `.opencode/skill/sk-prompt-improver/references/` and index in decision-record.md |
| Dependency | skill_advisor.py infrastructure | If skill routing doesn't work, skill becomes inaccessible | Work with @general to register intent boosters; test with multiple prompt engineering query variants |
| Risk | Framework completeness vs. OpenCode environment constraints | Frameworks may require adaptation for non-interactive environment | Document constraints in SKILL.md RULES section; provide workarounds for text-only modes |
| Risk | Signal-based routing accuracy | Misdetection of operating mode (e.g., confusing "Improve" with "Refine") | Build validation checks into skill; include user clarification prompts in Smart Routing section |
| Risk | Knowledge base size and maintainability | Refs/ directory could become unwieldy (frameworks + templates + examples) | Organize by concern: frameworks.md, depth_framework.md, scoring_systems.md, operating_modes.md, knowledge_base.md (5 files, clear boundaries) |
| Dependency | OpenCode skill system version | Incompatibility with older skill registration patterns | Verify skill_advisor.py version and test registration; document in decision-record.md any API assumptions |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Skill routing (skill_advisor.py) completes in < 500ms for intent classification
- **NFR-P02**: SKILL.md loads and renders in < 1s in all supported OpenCode interfaces
- **NFR-P03**: Prompt framework retrieval from references/ < 200ms (in-memory or fast disk access)

### Security

- **NFR-S01**: No API keys or credentials embedded in references/ or SKILL.md
- **NFR-S01**: All example prompts use sanitized, non-sensitive data

### Reliability

- **NFR-R01**: skill_advisor.py returns sk-prompt-improver routing 95% of the time for clear prompt engineering queries
- **NFR-R02**: All references/ files validate with zero markdown syntax errors

### Usability

- **NFR-U01**: SKILL.md written at 6th-grade reading level for clarity
- **NFR-U02**: Framework documentation includes at least one worked example per framework

<!-- /ANCHOR:nfr -->

---

## 8. EDGE CASES

### Data Boundaries

- **Empty input**: If user provides no prompt text, skill offers guided template selection via SMART ROUTING
- **Very long input**: Prompts >2000 tokens summarized before framework application (length threshold documented in RULES)
- **Vague input**: Signal-based routing detects ambiguity and offers mode clarification checklist

### Error Scenarios

- **Framework mismatch**: User selects framework that doesn't fit use case → SMART ROUTING provides alternative suggestions
- **Scoring system unavailability**: If CLEAR/EVOKE/VISUAL scoring cannot run, skill degrades gracefully and offers text-only feedback
- **Malformed framework query**: User query doesn't match any operating mode → Default to Interactive mode with manual mode selection

### Boundary Conditions

- **Minimum viable prompt**: Framework accepts 10+ character input minimum; shorter inputs prompted for expansion
- **Multi-language input**: Non-English prompts detected and routed to language-aware handling (or noted as limitation in RULES)

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 7 create + 1 modify; LOC: ~2500 (SKILL.md + references); Systems: 1 (OpenCode skill system) |
| Risk | 5/25 | Auth: N; API: Y (skill_advisor.py); Breaking: N; Versioning: skill_advisor.py compatibility |
| Research | 10/20 | Framework adaptation (Prompt Improver → OpenCode idioms); Signal-based routing logic design; Scoring systems mapping |
| Multi-Agent | 5/15 | Workstreams: 1 (@speckit for documentation); Coordination minimal |
| Coordination | 5/15 | Dependencies: skill_advisor.py registration; Source system reference; No cross-team coordination needed |
| **Total** | **40/100** | **Level 3 Appropriate**: Architecture decisions (routing logic, framework adaptation), risk matrix, stakeholder communication needed |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | skill_advisor.py routing confidence < 0.8 for prompt queries | High | Medium | Test with 10+ prompt engineering query variants; tune intent boosters iteratively |
| R-002 | Framework adaptation loses fidelity vs. original system | Medium | Medium | Preserve original Prompt Improver reference; document deviations in decision-record.md; include examples |
| R-003 | SKILL.md grows beyond 5000 words (complexity creep) | Medium | Medium | Front-load word budget planning; use references/ for detailed content; SKILL.md stays <80 lines overview |
| R-004 | Operating mode signal detection conflicts (e.g., "Improve" vs. "Refine") | Medium | Low | Build disambiguation logic into SMART ROUTING; provide decision tree in operating_modes.md |
| R-005 | Knowledge base size explosion (10 frameworks + 10 modes + scoring) | Low | High | Pre-plan file organization (5 reference files); document each file's scope; index in references/README.md |

---

## 11. USER STORIES

### US-001: Seamless Prompt Engineering in Development Workflow (Priority: P0)

**As a** developer, **I want** to invoke prompt engineering assistance from within my coding session, **so that** I can create effective AI prompts without switching tools or breaking context.

**Acceptance Criteria**:
1. Given I am in an OpenCode session and request "improve my prompt", When skill_advisor.py routes to sk-prompt-improver, Then the skill SKILL.md loads with clear instructions
2. Given I provide a vague prompt, When I invoke sk-prompt-improver, Then the skill applies at least one of the 10 frameworks to structure my request
3. Given I complete a prompt improvement session, When I exit the skill, Then my enhanced prompt is documented and retrievable in the session context

---

### US-002: Automatic Mode Detection and Framework Selection (Priority: P1)

**As a** developer with varying prompt engineering needs, **I want** automatic signal-based detection of my use case (e.g., "improve visual prompt" → VIBE/FRAME), **so that** the right framework is selected without manual configuration.

**Acceptance Criteria**:
1. Given I request "create a prompt for image generation", When signal-based routing analyzes my input, Then VIBE or FRAME framework is automatically suggested
2. Given I request "refine my JSON schema prompt", When operating mode detection runs, Then JSON mode is activated with COSTAR framework
3. Given I provide ambiguous input, When mode detection is uncertain, Then skill offers clarification checklist (Interactive vs. Text vs. Visual, etc.)

---

### US-003: Measure Prompt Quality via Triple Scoring (Priority: P1)

**As a** developer optimizing AI prompts, **I want** CLEAR/EVOKE/VISUAL scoring on my enhanced prompts, **so that** I can measure prompt quality across precision, UX concepting, and visual guidance dimensions.

**Acceptance Criteria**:
1. Given a prompt has been improved via a framework, When CLEAR scoring is applied, Then I receive a 0-100 precision score with actionable feedback
2. Given a visual or image-related prompt, When EVOKE or VISUAL scoring is applied, Then UI/visual quality feedback is provided
3. Given I review the triple score, Then I can identify lowest-scoring dimension and drill into references/scoring_systems.md for improvement guidance

---

### US-004: Access Integrated Knowledge Base from Skill (Priority: P1)

**As a** developer using sk-prompt-improver, **I want** to reference system prompts, templates, and visual/image/video examples without leaving the skill, **so that** I can learn by example and accelerate prompt engineering.

**Acceptance Criteria**:
1. Given I am in sk-prompt-improver SKILL.md, When I navigate to REFERENCES section, Then I can access all 5 knowledge base files (frameworks, depth, scoring, modes, knowledge_base)
2. Given I read references/frameworks.md, When I lookup RCAF framework, Then I see definition + structure + worked example
3. Given I reference references/knowledge_base.md, When I search for "image generation prompts", Then I find templates and system prompts relevant to image work

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- **Q-001**: How will interactive prompts (e.g., "let's iterate on this together") be handled in non-interactive OpenCode environment? Should Interactive mode default to guided checklist approach?
- **Q-002**: Should sk-prompt-improver store improved prompts persistently in a skill-specific memory/ folder, or rely on session context?
- **Q-003**: Are there OpenCode-specific constraints on framework application (e.g., response length limits, token budgets) that should be documented in RULES?
- **Q-004**: Should skill_advisor.py boosters include both direct phrases ("improve prompt") and indirect signals (mentions of "clarity", "structure", "framework")?
- **Q-005**: How should Visual/Image/Video modes work when invoked from CLI or text-only context? Should they offer ASCII/text alternatives?

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Source Reference**: `/Users/michelkerkmeester/MEGA/Development/AI Systems/Barter/1. Prompt Improver/`

---

<!--
LEVEL 3 SPEC (~310 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment with detailed scoring
- 12 sections covering all architectural concerns
- Ready for conversion to plan.md and task breakdown
-->
