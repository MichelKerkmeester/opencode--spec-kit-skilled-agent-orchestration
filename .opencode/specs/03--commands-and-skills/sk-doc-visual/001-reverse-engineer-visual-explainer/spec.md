---
title: "Feature Specification: Reverse-Engineer Doc Visual Skill [037-reverse-engineer-doc-visual/spec]"
description: "Reverse-engineer the open-source nicobailon/doc-visual GitHub repo (v0.1.1, MIT license) into a full OpenCode skill called sk-doc-visual. The skill transforms comple..."
trigger_phrases:
  - "feature"
  - "specification"
  - "reverse"
  - "engineer"
  - "visual"
  - "spec"
  - "037"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Reverse-Engineer Doc Visual Skill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Reverse-engineer the open-source `nicobailon/doc-visual` GitHub repo (v0.1.1, MIT license) into a full OpenCode skill called `sk-doc-visual`. The skill transforms complex technical concepts into production-quality HTML doc visuals with diagrams, data tables, and styled layouts using a Skill Graph architecture (10 nodes, 5 commands, 3 HTML templates).

**Key Decisions**: Skill Graph architecture over monolithic SKILL.md; `workflows-` prefix following process-oriented skill conventions; progressive disclosure via 3-tier loading (ALWAYS/CONDITIONAL/ON_DEMAND)

**Critical Dependencies**: Source repo (nicobailon/doc-visual v0.1.1) for content extraction; existing skill_advisor.py for routing integration; package_skill.py for validation
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2025-02-21 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `nicobailon/doc-visual` repo contains a powerful visual explanation system for AI coding agents, but it exists as a standalone single-file prompt (700+ lines) with no integration into the OpenCode skill framework. Users cannot discover or invoke it through the standard skill routing system, and the monolithic format prevents progressive loading and efficient context usage.

### Purpose
Transform the external doc-visual repo into a fully integrated OpenCode skill with auto-discovery via `skill_advisor.py`, progressive content loading via Skill Graph architecture, 5 slash commands for different workflows, and production-quality HTML template exemplars.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Full Skill Graph with SKILL.md router, index.md MOC, and 10 node files
- 5 slash commands: `/generate`, `/diff-review`, `/plan-review`, `/recap`, `/fact-check`
- 3 HTML template exemplars (architecture, mermaid-flowchart, data-table)
- 5 reference files with 3-tier loading strategy
- 2 shell scripts (validate-html-output.sh, cleanup-output.sh)
- skill_advisor.py integration (11 INTENT_BOOSTERS + 5 MULTI_SKILL_BOOSTERS)
- 9 quality checks (7 original + 2 new: accessibility, reduced-motion)

### Out of Scope
- Runtime execution engine for doc visual commands - the skill provides instructions, not automation
- Chrome DevTools MCP integration testing - referenced but not implemented as part of this spec
- Webflow or CMS publishing pipeline - output is local HTML only
- Modifications to the original doc-visual repo - we reverse-engineer, not fork

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-doc-visual/SKILL.md` | Create | Lean router entrypoint (~1,683 words) |
| `.opencode/skill/sk-doc-visual/index.md` | Create | Skill Graph MOC with 4 groups, 10 wikilinks |
| `.opencode/skill/sk-doc-visual/nodes/when-to-use.md` | Create | 5 command overview, decision matrix |
| `.opencode/skill/sk-doc-visual/nodes/rules.md` | Create | 9 ALWAYS, 7 NEVER, 4 ESCALATE IF rules |
| `.opencode/skill/sk-doc-visual/nodes/success-criteria.md` | Create | 9 quality checks |
| `.opencode/skill/sk-doc-visual/nodes/how-it-works.md` | Create | 4-phase workflow (Think > Structure > Style > Deliver) |
| `.opencode/skill/sk-doc-visual/nodes/smart-routing.md` | Create | Python pseudocode for intent classification |
| `.opencode/skill/sk-doc-visual/nodes/commands.md` | Create | Full contracts for 5 commands |
| `.opencode/skill/sk-doc-visual/nodes/diagram-types.md` | Create | 11 types with decision tree |
| `.opencode/skill/sk-doc-visual/nodes/aesthetics.md` | Create | 9 profiles, CSS variables, 11x9 compatibility matrix |
| `.opencode/skill/sk-doc-visual/nodes/integration-points.md` | Create | CDN libraries, cross-skill integration |
| `.opencode/skill/sk-doc-visual/nodes/related-resources.md` | Create | Master index |
| `.opencode/skill/sk-doc-visual/references/quick_reference.md` | Create | ALWAYS-loaded cheat sheet |
| `.opencode/skill/sk-doc-visual/references/css_patterns.md` | Create | CONDITIONAL CSS pattern library (~15KB) |
| `.opencode/skill/sk-doc-visual/references/library_guide.md` | Create | ON_DEMAND library guide (~16KB) |
| `.opencode/skill/sk-doc-visual/references/navigation_patterns.md` | Create | CONDITIONAL nav patterns |
| `.opencode/skill/sk-doc-visual/references/quality_checklist.md` | Create | ON_DEMAND verification checklist |
| `.opencode/skill/sk-doc-visual/assets/templates/architecture.html` | Create | Terracotta/sage template (~17KB) |
| `.opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html` | Create | Teal/cyan Mermaid template (~13KB) |
| `.opencode/skill/sk-doc-visual/assets/templates/data-table.html` | Create | Rose/cranberry data table template (~16KB) |
| `.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh` | Create | 10-check static HTML validator |
| `.opencode/skill/sk-doc-visual/scripts/cleanup-output.sh` | Create | Output directory maintenance |
| `.opencode/command/doc-visual/generate.md` | Create | Generate command definition |
| `.opencode/command/doc-visual/diff-review.md` | Create | Diff review command definition |
| `.opencode/command/doc-visual/plan-review.md` | Create | Plan review command definition |
| `.opencode/command/doc-visual/recap.md` | Create | Recap command definition |
| `.opencode/command/doc-visual/fact-check.md` | Create | Fact check command definition |
| `.opencode/skill/scripts/skill_advisor.py` | Modify | Add 11 INTENT_BOOSTERS + 5 MULTI_SKILL_BOOSTERS |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md lean router under 5,000-word limit | Word count verified < 5,000 (actual: 1,683) |
| REQ-002 | Skill Graph with index.md MOC and 10 node files | All 10 wikilinks in index.md resolve to existing files |
| REQ-003 | skill_advisor.py routes to sk-doc-visual at >= 0.90 confidence | Tested: 0.95 confidence for "create doc visual" |
| REQ-004 | package_skill.py validation passes | PASS with at most non-blocking warnings |
| REQ-005 | 5 slash commands registered in `.opencode/command/doc-visual/` | All 5 command .md files exist and follow command template |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | 3 HTML template exemplars ported from original repo | Templates render correctly in browser, validate via script |
| REQ-007 | Progressive disclosure via 3-tier loading | ALWAYS/CONDITIONAL/ON_DEMAND levels documented in SKILL.md |
| REQ-008 | 9 quality checks (original 7 + accessibility + reduced-motion) | success-criteria.md contains all 9 checks |
| REQ-009 | validate-html-output.sh runs 10 checks | Script executes without errors on template files |
| REQ-010 | MULTI_SKILL_BOOSTERS used for conflicting keywords | diagram, flowchart, review keywords do not overwrite existing INTENT_BOOSTERS |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: skill_advisor.py returns >= 0.90 confidence for doc visual queries (verified: 0.95)
- **SC-002**: package_skill.py validates skill folder with PASS (verified: 1 non-blocking emoji warning only)
- **SC-003**: SKILL.md word count stays under 5,000-word limit (verified: 1,683 words)
- **SC-004**: All 10 wikilinks in index.md resolve to actual files (verified: 10/10)
- **SC-005**: HTML templates validate via validate-html-output.sh (verified: all 3 pass)
- **SC-006**: Total file count matches plan (verified: 27 new + 1 modified = 28 total)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | nicobailon/doc-visual v0.1.1 source | Cannot extract content without access | Clone repo locally before starting; content is MIT licensed |
| Dependency | skill_advisor.py existing INTENT_BOOSTERS | Conflicting keywords could break other skill routing | Use MULTI_SKILL_BOOSTERS for shared keywords (diagram, flowchart, review) |
| Dependency | package_skill.py validation rules | Must pass validation for skill to be valid | snake_case filenames, ANCHOR tags, word count limits |
| Risk | Skill Graph complexity (10 nodes) | Higher maintenance burden | Clear MOC in index.md; each node is self-contained |
| Risk | HTML templates may contain external dependencies | Templates fail offline | All CDN resources documented; local fallback noted |
| Risk | Original repo single-file format loses structure cues | May miss intent during decomposition | Cross-reference original line-by-line during extraction |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: SKILL.md must load within standard skill loading time (< 2s for 1,683 words)
- **NFR-P02**: Progressive loading reduces initial context usage by deferring ~31KB of reference content

### Portability
- **NFR-S01**: MIT license permits unrestricted use; attribution preserved in references
- **NFR-S02**: No authentication or API keys required for any skill functionality

### Reliability
- **NFR-R01**: validate-html-output.sh provides automated verification for generated HTML
- **NFR-R02**: cleanup-output.sh prevents output directory bloat
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty input: Smart router in SKILL.md requires at least a topic description; prompts user if missing
- Maximum length: No hard limit on generated HTML, but quality checks enforce structure (sections, headings, responsive design)

### Error Scenarios
- CDN library unavailable: Templates reference CDN-hosted libraries (Mermaid, Chart.js, anime.js); documented fallback to local copies
- Missing Mermaid/Chart.js: Diagram types degrade gracefully; static alternatives documented in diagram-types.md
- skill_advisor.py conflict: MULTI_SKILL_BOOSTERS handle shared keywords without overwriting; tested with existing entries
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 28 (27 new + 1 modified), LOC: ~2,500+, Systems: skill framework + command framework + routing |
| Risk | 12/25 | Auth: N, API: N, Breaking: N (additive only), but routing conflicts possible |
| Research | 15/20 | Full repo analysis required; content decomposition into Skill Graph nodes |
| Multi-Agent | 5/15 | Single agent execution; no parallel workstreams |
| Coordination | 8/15 | Dependencies: 3 (skill_advisor.py, package_skill.py, source repo) |
| **Total** | **62/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | INTENT_BOOSTERS conflict with existing skill routing | H | M | Use MULTI_SKILL_BOOSTERS for shared keywords |
| R-002 | SKILL.md exceeds 5,000-word limit during content extraction | H | L | Lean router pattern; detail pushed to nodes |
| R-003 | package_skill.py rejects kebab-case reference filenames | M | H | Renamed to snake_case before validation |
| R-004 | HTML templates break when ported from original repo | M | L | Templates ported as-is; validated with script |
| R-005 | Wikilinks in index.md point to non-existent files | M | L | Cross-verified all 10 links after creation |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Discover Doc Visual via Skill Routing (Priority: P0)

**As a** user asking an AI agent to create a diagram or visual explanation, **I want** the skill_advisor.py to automatically route to sk-doc-visual, **so that** I get the specialized visual explanation workflow without knowing the skill name.

**Acceptance Criteria**:
1. Given a query "create a doc visual for my API architecture", When skill_advisor.py processes it, Then it returns sk-doc-visual with >= 0.90 confidence

---

### US-002: Generate Doc Visual from Topic (Priority: P0)

**As a** developer, **I want** to use `/generate` to create a complete HTML doc visual from a topic description, **so that** I get a production-quality single-file HTML with diagrams, styling, and responsive layout.

**Acceptance Criteria**:
1. Given a topic description, When `/generate` is invoked, Then the 4-phase workflow (Think > Structure > Style > Deliver) is followed
2. Given a generated HTML file, When validated, Then all 9 quality checks pass

---

### US-003: Review Code Diffs Visually (Priority: P1)

**As a** developer reviewing a PR, **I want** to use `/diff-review` to create a visual explanation of code changes, **so that** complex diffs become easier to understand.

**Acceptance Criteria**:
1. Given a git diff or PR URL, When `/diff-review` is invoked, Then a visual breakdown of changes is generated

---

### US-004: Browse Diagram Types and Aesthetics (Priority: P1)

**As a** developer, **I want** to browse available diagram types (11) and aesthetic profiles (9) with a compatibility matrix, **so that** I can choose the best combination for my use case.

**Acceptance Criteria**:
1. Given the nodes/diagram-types.md, When read, Then a decision tree helps select the right diagram type
2. Given the nodes/aesthetics.md, When read, Then an 11x9 compatibility matrix shows which aesthetics work with which diagram types

---

### US-005: Validate Generated Output (Priority: P1)

**As a** developer, **I want** to validate my generated HTML output using `validate-html-output.sh`, **so that** I can confirm it meets the 9 quality checks before publishing.

**Acceptance Criteria**:
1. Given a generated HTML file, When `validate-html-output.sh` is run against it, Then 10 static checks are performed and results are reported

---

### US-006: Use Progressive Loading (Priority: P1)

**As an** AI agent loading the skill, **I want** only the essential content loaded initially (SKILL.md + quick_reference.md), **so that** context window usage is minimized while still having full capability available on demand.

**Acceptance Criteria**:
1. Given skill invocation, When SKILL.md is loaded, Then only ALWAYS-level references are loaded automatically
2. Given a CSS-heavy task, When CONDITIONAL references are needed, Then css_patterns.md is loaded on demand
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None remaining. All questions were resolved during implementation.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC - Retroactive documentation
Reverse-engineered sk-doc-visual skill
27 files created + 1 modified, ~2,500+ LOC
-->
