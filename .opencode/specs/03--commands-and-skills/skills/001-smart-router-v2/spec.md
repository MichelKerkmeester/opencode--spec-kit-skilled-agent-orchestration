---
title: "Feature Specification: Smart Router V2 Rollout [001-smart-router-v2/spec]"
description: "Level 3 (+Arch) is appropriate when"
trigger_phrases:
  - "feature"
  - "specification"
  - "smart"
  - "router"
  - "rollout"
  - "spec"
  - "034"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Smart Router V2 Rollout

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

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Smart Router V2 upgrades intent classification across 10 OpenCode skill documents (8 Public, 2 Barter repositories), replacing simple first-hit keyword matching with weighted classification, adding recursive reference/asset discovery, and enabling stack/language detection for prioritized routing within skill scopes.

**Key Decisions**: Weighted keyword scoring over simple matching, skill-scoped routing (no cross-skill), recursive subdirectory discovery for references/assets.

**Critical Dependencies**: System-spec-kit templates must remain compatible, existing skill invocation patterns preserved for backward compatibility.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-17 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Current OpenCode skills use simple first-hit keyword matching for intent classification, causing premature routing decisions and inability to prioritize context-relevant resources. Skills lack recursive discovery for nested references/assets, and code workflow skills cannot detect stack/language context for optimized routing. This leads to suboptimal resource surfacing and missed relevant documentation.

### Purpose
Implement weighted keyword intent classification with recursive discovery and stack detection across 10 SKILL.md files, improving routing accuracy by 40%+ while maintaining backward compatibility with existing skill invocation patterns.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Weighted keyword classification system (replaces first-hit matching) in 10 SKILL.md files
- Recursive discovery for `references/` and `assets/` subdirectories where applicable
- Stack/language detection logic for code workflow skills (workflows-code--*)
- Preservation of existing skill purpose, constraints, and invocation patterns
- Backward compatibility with current skill routing in AGENTS.md and orchestration layer
- Documentation updates in all affected SKILL.md files

### Out of Scope
- Cross-skill routing (each skill remains self-contained)
- Changes to skill invocation APIs or MCP tool definitions
- New skill creation or archival of existing skills
- Modifications to system-spec-kit templates or validation scripts
- Agent-level routing logic changes in AGENTS.md

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Modify | Add weighted keyword classification, recursive discovery |
| `.opencode/skill/mcp-figma/SKILL.md` | Modify | Add weighted keyword classification, recursive discovery |
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | Modify | Add weighted keyword classification, CLI vs MCP routing weights |
| `.opencode/skill/sk-code--full-stack/SKILL.md` | Modify | Add weighted classification + stack detection (Go/Node/React/RN/Swift) |
| `.opencode/skill/sk-code--opencode/SKILL.md` | Modify | Add weighted classification + language detection (JS/TS/Python/Shell) |
| `.opencode/skill/workflows-code--web-dev/SKILL.md` | Modify | Add weighted classification + stack detection (Webflow/vanilla JS) |
| `.opencode/skill/sk-doc/SKILL.md` | Modify | Add weighted classification, recursive discovery for templates |
| `.opencode/skill/sk-git/SKILL.md` | Modify | Add weighted classification, read-only enforcement weights |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/sk-git/SKILL.md` | Modify | Add weighted classification (Barter-specific) |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/workflows-code/SKILL.md` | Modify | Add weighted classification + stack detection (Barter-specific) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Weighted keyword classification replaces first-hit matching in all 10 files | Each SKILL.md contains weighted keyword table with scores 0.1-1.0 |
| REQ-002 | Recursive discovery for references/ and assets/ subdirectories | Skills document recursive file discovery logic where applicable |
| REQ-003 | Stack/language detection in code workflow skills | workflows-code--* skills contain stack detection logic with marker file detection |
| REQ-004 | Backward compatibility with existing invocation patterns | No breaking changes to skill invocation APIs or routing entry points |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Documentation of weighted scoring methodology | Each skill documents how keyword weights influence routing decisions |
| REQ-006 | Consistent weighted scoring ranges across skills | All skills use 0.1-1.0 scale with documented thresholds (e.g., >0.7 = high priority) |
| REQ-007 | Testing strategy for routing accuracy improvements | Each skill documents verification approach for routing improvements |
| REQ-008 | Public-to-Barter rollout parity documentation | Barter updates explicitly map to Public baseline behavior and note intentional deviations |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 10 SKILL.md files contain weighted keyword classification tables with concrete scores
- **SC-002**: Code workflow skills (workflows-code--*) successfully detect stack/language via marker files
- **SC-003**: Recursive discovery logic documented for skills with references/ and assets/ subdirectories
- **SC-004**: No breaking changes to existing skill invocation patterns (verified via agent routing tests)
- **SC-005**: Routing accuracy improvement measurable via intent classification hit rate (target: 40%+ improvement)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 13. ACCEPTANCE SCENARIOS

### AS-001: Weighted Priority Wins
**Given** a user request with mixed intent terms ("debug React component performance"),
**When** weighted keyword classification runs,
**Then** the highest aggregate weighted intent route is selected (sk-code--full-stack with React stack detection).

### AS-002: Low Confidence Fallback
**Given** all candidate intent scores are below threshold (all < 0.5),
**When** classification completes,
**Then** routing falls back to legacy-safe generic behavior without blocking.

### AS-003: Recursive Discovery Enabled
**Given** nested references/assets directories (e.g., `references/backend/go/patterns/`),
**When** recursive discovery runs,
**Then** all relevant files within depth limit (3 levels) are discoverable.

### AS-004: Recursive Discovery Safe Skip
**Given** missing references/ or assets/ directories,
**When** routing behavior executes,
**Then** skill operates normally without errors (graceful degradation).

### AS-005: Stack Marker Resolution
**Given** multiple stack markers present (go.mod + package.json),
**When** stack detection runs,
**Then** documented priority order determines selected stack path (no ambiguity).

### AS-006: Cross-Repo Parity
**Given** equivalent prompts executed in Public and Barter repositories,
**When** routing decisions are made,
**Then** behavior is parity-consistent unless explicitly documented as intentional deviation.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | System-spec-kit template compatibility | Medium | Verify ANCHOR format compatibility before rollout |
| Risk | Breaking changes to skill invocation patterns | High | Comprehensive backward compatibility testing in Phase 3 |
| Risk | Multi-repository coordination (Public + Barter) | Medium | Sequential rollout: Public first, then Barter |
| Risk | Inconsistent weighted scoring across skills | Medium | Establish scoring guidelines in decision-record.md |
| Dependency | Existing skill documentation quality | Low | Review all 10 SKILL.md files for baseline structure |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Weighted keyword classification adds <5ms overhead per routing decision
- **NFR-P02**: Recursive discovery completes in <100ms for typical skill folder structures

### Security
- **NFR-S01**: No exposure of internal routing logic to external APIs or user-facing interfaces

### Reliability
- **NFR-R01**: Fallback to simple matching if weighted classification fails (graceful degradation)
- **NFR-R02**: Stack detection failures default to generic routing (no blocking errors)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty keyword input: Fallback to generic skill routing without classification
- Missing references/ or assets/ directories: Skip recursive discovery gracefully
- Unknown stack/language markers: Default to generic code routing without stack-specific optimizations

### Error Scenarios
- Malformed weighted keyword tables: Validation at skill load time with clear error messages
- Circular reference discovery: Max depth limit (3 levels) to prevent infinite loops
- Stack detection ambiguity (multiple marker files): Priority order documented per skill
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 10, LOC: ~800 (80/file avg), Systems: 2 repos |
| Risk | 18/25 | Auth: N, API: N, Breaking: Possible (backward compat critical) |
| Research | 12/20 | Stack detection patterns, weighted scoring methodology |
| Multi-Agent | 8/15 | Workstreams: 2 (Public + Barter), sequential not parallel |
| Coordination | 10/15 | Dependencies: Template compatibility, agent routing layer |
| **Total** | **70/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Breaking skill invocation patterns | H | M | Comprehensive backward compatibility testing, fallback mechanisms |
| R-002 | Inconsistent weighted scoring methodology | M | M | Establish scoring guidelines early, peer review all weights |
| R-003 | Barter repository coordination failure | M | L | Sequential rollout (Public first), independent verification |
| R-004 | Stack detection false positives | L | M | Clear priority order, validation in code workflow skills |
| R-005 | Recursive discovery performance impact | L | L | Max depth limits, early termination on large directories |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Weighted Keyword Classification (Priority: P0)

**As a** skill consumer (agent or user), **I want** intent classification to use weighted keyword scoring, **so that** routing decisions prioritize high-relevance keywords over incidental matches.

**Acceptance Criteria**:
1. Given a user request "debug React component", When the sk-code--full-stack skill classifies intent, Then keywords "debug" (0.9) and "React" (0.8) score higher than "component" (0.3)
2. Given multiple keyword matches, When classification aggregates scores, Then the highest-scoring intent wins (not first-hit)
3. Given no high-confidence matches (all <0.5), When classification completes, Then fallback to generic routing without errors

---

### US-002: Recursive Reference Discovery (Priority: P0)

**As a** skill author, **I want** recursive discovery for references/ and assets/ subdirectories, **so that** deeply nested documentation surfaces automatically without manual indexing.

**Acceptance Criteria**:
1. Given a skill with `references/backend/go/patterns/`, When recursive discovery runs, Then all markdown files in nested paths are discoverable
2. Given max depth limit (3 levels), When discovery encounters deeper nesting, Then discovery stops gracefully at depth 3
3. Given missing references/ directory, When discovery runs, Then skill operates normally without errors

---

### US-003: Stack Detection in Code Workflows (Priority: P0)

**As a** code workflow skill, **I want** automatic stack/language detection via marker files, **so that** routing prioritizes stack-specific patterns and verification commands.

**Acceptance Criteria**:
1. Given a project with `go.mod`, When sk-code--full-stack detects stack, Then Go-specific patterns load from `references/backend/go/`
2. Given multiple marker files (go.mod + package.json), When detection runs, Then priority order (documented per skill) determines primary stack
3. Given no recognized markers, When detection completes, Then generic code routing applies without blocking

---

### US-004: Backward Compatibility Preservation (Priority: P0)

**As a** system operator, **I want** Smart Router V2 to maintain existing skill invocation patterns, **so that** agent routing and user commands continue working without migration.

**Acceptance Criteria**:
1. Given existing skill invocation via AGENTS.md, When Smart Router V2 deploys, Then all agent routing continues working without changes
2. Given user commands (e.g., `/spec_kit:plan`), When commands execute, Then skill routing behavior matches pre-upgrade expectations
3. Given skill-specific constraints (e.g., sk-git read-only), When new routing applies, Then existing constraints remain enforced

---

### US-005: Consistent Scoring Guidelines (Priority: P1)

**As a** skill author, **I want** documented weighted scoring guidelines (0.1-1.0 scale), **so that** keyword weights are consistent and predictable across all skills.

**Acceptance Criteria**:
1. Given scoring guidelines in decision-record.md, When authors assign weights, Then guidelines provide clear thresholds (0.8-1.0 = primary, 0.5-0.7 = secondary, 0.1-0.4 = tertiary)
2. Given peer review process, When weights are assigned, Then reviewers validate consistency with guidelines
3. Given unclear classification, When authors document weights, Then rationale explains scoring choices

---

### US-006: Routing Accuracy Verification (Priority: P1)

**As a** QA tester, **I want** routing accuracy improvement measurable via intent classification hit rate, **so that** Smart Router V2 demonstrates quantifiable improvement over first-hit matching.

**Acceptance Criteria**:
1. Given baseline hit rate (pre-upgrade), When Smart Router V2 deploys, Then post-upgrade hit rate improves by 40%+ on test cases
2. Given test corpus of user requests, When classification runs, Then accuracy metrics are logged for analysis
3. Given false positives/negatives, When testing completes, Then findings inform weighted scoring adjustments
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should weighted scoring methodology be documented in each SKILL.md or centralized in system-spec-kit?
- What is the optimal max depth for recursive discovery (current proposal: 3 levels)?
- Should stack detection priority order be skill-specific or standardized across code workflows?
- How to handle version migration if future Smart Router V3 introduces breaking changes?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
