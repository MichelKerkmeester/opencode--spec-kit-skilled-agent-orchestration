---
title: "Implementation Plan: Reverse-Engineer Doc Visual Skill [037-reverse-engineer-doc-visual/plan]"
description: "This plan covers the reverse-engineering of nicobailon/doc-visual (v0.1.1) into a fully integrated OpenCode skill. The approach decomposes a single 700+ line prompt file i..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "reverse"
  - "engineer"
  - "visual"
  - "037"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Reverse-Engineer Doc Visual Skill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skill definitions), HTML/CSS/JS (templates), Bash (scripts), Python (routing) |
| **Framework** | OpenCode Skill Framework (Skill Graph architecture) |
| **Storage** | File-based (no database) |
| **Testing** | package_skill.py validation, validate-html-output.sh, manual skill_advisor.py routing tests |

### Overview
This plan covers the reverse-engineering of `nicobailon/doc-visual` (v0.1.1) into a fully integrated OpenCode skill. The approach decomposes a single 700+ line prompt file into a Skill Graph with 10 nodes, adds 5 slash commands, ports 3 HTML templates as-is, creates 5 reference files with progressive loading, and integrates with skill_advisor.py for auto-discovery. The implementation is additive-only (no existing files modified except skill_advisor.py).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (6 criteria defined)
- [x] Dependencies identified (source repo, skill_advisor.py, package_skill.py)

### Definition of Done
- [x] All acceptance criteria met (27 files created, 1 modified)
- [x] Tests passing (package_skill.py PASS, validate-html-output.sh PASS, routing 0.95)
- [x] Docs updated (spec/plan/tasks — retroactive)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Skill Graph (progressive disclosure hierarchy): SKILL.md (router) -> index.md (MOC) -> nodes/*.md (detail) -> references/*.md (on-demand)

### Key Components
- **SKILL.md (Router)**: Lean entrypoint (~1,683 words) with Smart Router pseudocode, 7 sections with ANCHOR tags. Routes to appropriate nodes based on user intent.
- **index.md (MOC)**: Map of Content organizing 10 nodes into 4 groups (Foundation, Workflow, Design System, Reference) via wikilinks.
- **nodes/ (10 files)**: Self-contained knowledge nodes covering commands, rules, aesthetics, diagram types, workflow phases, smart routing, integration points, and success criteria.
- **references/ (5 files)**: Progressive-loaded reference material. quick_reference.md (ALWAYS), css_patterns.md and navigation_patterns.md (CONDITIONAL), library_guide.md and quality_checklist.md (ON_DEMAND).
- **assets/templates/ (3 files)**: Production-quality HTML exemplars ported from original repo.
- **scripts/ (2 files)**: Validation and maintenance shell scripts.
- **commands/ (5 files)**: Slash command definitions in `.opencode/command/doc-visual/`.

### Data Flow
User query -> skill_advisor.py (INTENT_BOOSTERS + MULTI_SKILL_BOOSTERS) -> SKILL.md Smart Router -> classifies intent -> loads relevant nodes from index.md -> references loaded progressively based on task needs -> HTML output generated to `.opencode/output/visual/` -> validated via validate-html-output.sh.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research & Analysis
- [x] Clone and analyze nicobailon/doc-visual v0.1.1
- [x] Map original content structure (single file, 700+ lines)
- [x] Identify decomposition points for Skill Graph nodes
- [x] Plan file naming (snake_case for references, kebab-case for nodes)
- [x] Identify conflicting keywords for MULTI_SKILL_BOOSTERS

### Phase 2: Skill Graph Core
- [x] Create SKILL.md lean router with Smart Router pseudocode
- [x] Create index.md MOC with 4 groups and 10 wikilinks
- [x] Create nodes/when-to-use.md (command overview, decision matrix)
- [x] Create nodes/rules.md (9 ALWAYS, 7 NEVER, 4 ESCALATE IF)
- [x] Create nodes/success-criteria.md (9 quality checks)
- [x] Create nodes/how-it-works.md (4-phase workflow)
- [x] Create nodes/smart-routing.md (Python pseudocode)
- [x] Create nodes/commands.md (5 command contracts)
- [x] Create nodes/diagram-types.md (11 types + decision tree)
- [x] Create nodes/aesthetics.md (9 profiles + 11x9 matrix)
- [x] Create nodes/integration-points.md (CDN, cross-skill)
- [x] Create nodes/related-resources.md (master index)

### Phase 3: References & Assets
- [x] Create references/quick_reference.md (ALWAYS tier)
- [x] Create references/css_patterns.md (CONDITIONAL tier, ~15KB)
- [x] Create references/library_guide.md (ON_DEMAND tier, ~16KB)
- [x] Create references/navigation_patterns.md (CONDITIONAL tier)
- [x] Create references/quality_checklist.md (ON_DEMAND tier)
- [x] Port assets/templates/architecture.html (~17KB)
- [x] Port assets/templates/mermaid-flowchart.html (~13KB)
- [x] Port assets/templates/data-table.html (~16KB)

### Phase 4: Commands & Integration
- [x] Create command/doc-visual/generate.md
- [x] Create command/doc-visual/diff-review.md
- [x] Create command/doc-visual/plan-review.md
- [x] Create command/doc-visual/recap.md
- [x] Create command/doc-visual/fact-check.md
- [x] Add 11 INTENT_BOOSTERS to skill_advisor.py
- [x] Add 5 MULTI_SKILL_BOOSTERS to skill_advisor.py
- [x] Create scripts/validate-html-output.sh
- [x] Create scripts/cleanup-output.sh

### Phase 5: Verification
- [x] Run package_skill.py validation (PASS, 1 non-blocking warning)
- [x] Test skill_advisor.py routing (0.95 confidence)
- [x] Verify SKILL.md word count (1,683 < 5,000)
- [x] Verify all 10 wikilinks resolve
- [x] Validate HTML templates via script
- [x] Run validate-html-output.sh
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Skill structure, filenames, ANCHOR tags | package_skill.py |
| Routing | Intent matching, confidence scores | skill_advisor.py (manual test) |
| Static Analysis | HTML template structure | validate-html-output.sh (10 checks) |
| Manual | Wikilink resolution, word count | grep, wc |
| Manual | Template rendering | Browser (visual inspection) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| nicobailon/doc-visual v0.1.1 | External | Green | Cannot extract content; would need to write from scratch |
| skill_advisor.py | Internal | Green | Cannot integrate routing; skill works but not discoverable |
| package_skill.py | Internal | Green | Cannot validate; must manually verify structure |
| OpenCode command framework | Internal | Green | Commands not registered; skill still works via direct invocation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Skill routing conflicts break existing skills, or package validation fails with blocking errors
- **Procedure**: Remove all 27 new files; revert skill_advisor.py changes (11 INTENT_BOOSTERS + 5 MULTI_SKILL_BOOSTERS). All changes are additive, so rollback is deletion-only with one file revert.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Research) ──► Phase 2 (Skill Graph Core) ──► Phase 3 (References & Assets)
                                                           │
                                                           ▼
                                                    Phase 4 (Commands & Integration) ──► Phase 5 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research | None | Skill Graph Core |
| Skill Graph Core | Research | References & Assets |
| References & Assets | Skill Graph Core | Commands & Integration |
| Commands & Integration | References & Assets | Verification |
| Verification | Commands & Integration | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Research & Analysis | Medium | 1-2 hours |
| Skill Graph Core (12 files) | High | 4-6 hours |
| References & Assets (8 files) | Medium | 2-3 hours |
| Commands & Integration (7 files + 1 modify) | Medium | 2-3 hours |
| Verification | Low | 0.5-1 hour |
| **Total** | | **9.5-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (git commit before changes)
- [x] Feature flag configured (N/A - additive skill, no feature flag needed)
- [x] Monitoring alerts set (N/A - no runtime monitoring for skills)

### Rollback Procedure
1. Remove `.opencode/skill/sk-doc-visual/` directory (22 files)
2. Remove `.opencode/command/doc-visual/` directory (5 files)
3. Revert skill_advisor.py to pre-change state (remove INTENT_BOOSTERS and MULTI_SKILL_BOOSTERS entries)
4. Verify skill_advisor.py still routes existing skills correctly

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - file-based, no data migrations
<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Phase 1    │────►│     Phase 2      │────►│     Phase 3      │
│   Research   │     │  Skill Graph     │     │ References/Assets│
└──────────────┘     │  Core (12 files) │     │    (8 files)     │
                     └──────────────────┘     └────────┬─────────┘
                                                       │
                                              ┌────────▼─────────┐     ┌──────────────┐
                                              │     Phase 4      │────►│   Phase 5    │
                                              │ Commands & Integ │     │ Verification │
                                              │  (7+1 files)     │     └──────────────┘
                                              └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Research | Source repo | Content map, decomposition plan | All other phases |
| SKILL.md | Research | Router entrypoint | index.md, all nodes |
| index.md | SKILL.md | MOC with wikilinks | Node files |
| nodes/ (10 files) | index.md | Knowledge nodes | References |
| references/ (5 files) | nodes/ | Progressive-load content | Commands |
| templates/ (3 files) | Research | HTML exemplars | Verification |
| commands/ (5 files) | Nodes, references | Slash command definitions | Verification |
| skill_advisor.py mods | Commands | Routing integration | Verification |
| scripts/ (2 files) | Templates | Validation tools | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Research & Analysis** - 1-2 hours - CRITICAL
2. **SKILL.md + index.md creation** - 2 hours - CRITICAL
3. **10 node files** - 3-4 hours - CRITICAL
4. **5 command files + skill_advisor.py integration** - 2 hours - CRITICAL
5. **Verification (all 6 checks)** - 0.5-1 hour - CRITICAL

**Total Critical Path**: ~8.5-11 hours

**Parallel Opportunities**:
- References and templates can be created in parallel with command files
- validate-html-output.sh can be written while templates are being ported
- cleanup-output.sh is independent of all other files
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Research Complete | Source repo analyzed, decomposition plan ready | Phase 1 |
| M2 | Skill Graph Core Done | SKILL.md + index.md + 10 nodes created | Phase 2 |
| M3 | Full Content Ported | All references, templates, and scripts created | Phase 3 |
| M4 | Integration Complete | Commands registered, skill_advisor.py updated | Phase 4 |
| M5 | Verification Passed | All 6 success criteria verified | Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full set of 8 Architecture Decision Records covering:
- ADR-001: Skill Graph architecture over monolithic SKILL.md
- ADR-002: `workflows-` prefix naming convention
- ADR-003: Progressive disclosure via 3-tier loading
- ADR-004: MULTI_SKILL_BOOSTERS for conflicting keywords
- ADR-005: 9 quality checks (expanded from 7)
- ADR-006: snake_case filenames for references
- ADR-007: HTML templates ported as-is
- ADR-008: Output to project-local directory

---

<!--
LEVEL 3 PLAN - Retroactive documentation
5 phases, 28 files total, ~9.5-15 hours estimated effort
All phases complete, all milestones achieved
-->
