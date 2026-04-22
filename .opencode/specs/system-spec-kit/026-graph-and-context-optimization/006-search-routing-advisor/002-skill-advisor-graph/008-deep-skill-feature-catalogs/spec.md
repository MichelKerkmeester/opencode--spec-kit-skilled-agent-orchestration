---
title: "Feature Specification: Deep Skill Feature Catalogs"
description: "Create feature catalogs for sk-deep-research, sk-deep-review, and sk-improve-agent following the skill-advisor and system-spec-kit catalog patterns."
trigger_phrases:
  - "008-deep-skill-feature-catalogs"
  - "deep skill feature catalog"
  - "feature catalog deep research"
  - "feature catalog deep review"
  - "feature catalog improve agent"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/008-deep-skill-feature-catalogs"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created phase spec"
    next_safe_action: "Implement feature catalogs"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
---
# Feature Specification: Deep Skill Feature Catalogs

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-04-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `007-skill-graph-auto-setup` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM STATEMENT

Three high-complexity skills lack feature catalogs:

| Skill | Features | Complexity | Has Catalog |
|-------|----------|-----------|-------------|
| **sk-deep-research** | Research loop, convergence, graph events, JSONL state, synthesis | High | No |
| **sk-deep-review** | Review loop, P0/P1/P2 severity, quality gates, verdicts, claim adjudication | High | No |
| **sk-improve-agent** | Evaluator-first loop, 5-dim scoring, integration scanning, promotion gates | High | No |
| skill-advisor | Routing, graph, semantic search, testing | High | Yes (20 features) |
| system-spec-kit | Retrieval, mutation, discovery, analysis, etc. | Very High | Yes (291 features) |

These three skills are among the most complex in the system but have no discoverable feature inventory. Operators, reviewers, and agents cannot quickly map capabilities to implementation without reading the full SKILL.md.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:solution -->
## 3. SOLUTION DESIGN

Create a `feature_catalog/` directory in each skill folder with:
1. A root `feature_catalog.md` using the sk-doc subsection template format
2. Numbered category directories with per-feature files
3. Each feature documents: Description, Current Reality, Source Files

### sk-deep-research Feature Categories

| Category | Features |
|----------|----------|
| 01--loop-lifecycle | Init, iteration dispatch, convergence, synthesis, save |
| 02--state-management | JSONL state, strategy.md, config, findings registry |
| 03--convergence | 3-signal model, stuck detection, quality guards, graph convergence |
| 04--research-output | Progressive synthesis, negative knowledge, research.md |

### sk-deep-review Feature Categories

| Category | Features |
|----------|----------|
| 01--loop-lifecycle | Init, iteration dispatch, convergence, synthesis, save |
| 02--state-management | JSONL state, strategy.md, config, findings registry, dashboard |
| 03--review-dimensions | Correctness, security, traceability, maintainability |
| 04--severity-system | P0/P1/P2 classification, adversarial self-check, claim adjudication, verdicts |

### sk-improve-agent Feature Categories

| Category | Features |
|----------|----------|
| 01--evaluation-loop | Init, candidate generation, scoring, promotion gates, rollback |
| 02--integration-scanning | Surface discovery, runtime mirrors, command dispatch, YAML workflows |
| 03--scoring-system | 5-dimension rubric, dynamic profiling, plateau detection, deterministic scoring |
<!-- /ANCHOR:solution -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- `sk-deep-research/feature_catalog/` -- root catalog + 14 feature entries across 4 categories
- `sk-deep-review/feature_catalog/` -- root catalog + 19 feature entries across 4 categories
- `sk-improve-agent/feature_catalog/` -- root catalog + 13 feature entries across 3 categories

### Out of Scope
- Modifying SKILL.md files or runtime code
- Creating catalogs for other skills (cli-*, mcp-*, etc.)
- Manual testing playbooks (separate effort)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success -->
## 5. SUCCESS CRITERIA

- [ ] All 3 skills have `feature_catalog/feature_catalog.md` using subsection format
- [ ] Root catalogs include Overview table, TOC, and per-feature subsections
- [ ] Per-feature files follow the sk-doc template (Overview, Current Reality, Source Files, Source Metadata)
- [ ] Feature descriptions accurately match current code behavior
- [ ] Root catalog feature count matches per-feature file count
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:files -->
## 6. KEY FILES

| File | Action |
|------|--------|
| `.opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md` | Create |
| `.opencode/skill/sk-deep-research/feature_catalog/01--loop-lifecycle/*.md` | Create |
| `.opencode/skill/sk-deep-research/feature_catalog/02--state-management/*.md` | Create |
| `.opencode/skill/sk-deep-research/feature_catalog/03--convergence/*.md` | Create |
| `.opencode/skill/sk-deep-research/feature_catalog/04--research-output/*.md` | Create |
| `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md` | Create |
| `.opencode/skill/sk-deep-review/feature_catalog/01--loop-lifecycle/*.md` | Create |
| `.opencode/skill/sk-deep-review/feature_catalog/02--state-management/*.md` | Create |
| `.opencode/skill/sk-deep-review/feature_catalog/03--review-dimensions/*.md` | Create |
| `.opencode/skill/sk-deep-review/feature_catalog/04--severity-system/*.md` | Create |
| `.opencode/skill/sk-improve-agent/feature_catalog/feature_catalog.md` | Create |
| `.opencode/skill/sk-improve-agent/feature_catalog/01--evaluation-loop/*.md` | Create |
| `.opencode/skill/sk-improve-agent/feature_catalog/02--integration-scanning/*.md` | Create |
| `.opencode/skill/sk-improve-agent/feature_catalog/03--scoring-system/*.md` | Create |
<!-- /ANCHOR:files -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Feature descriptions drift from code | Medium | Stale catalog | Reference SKILL.md and code with file:line citations |
| Category boundaries wrong | Low | Reorganization needed | Based on existing SKILL.md section structure |
| Too many features per category | Low | Navigation overhead | Cap at 6-8 per category |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:decisions -->
## 8. KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Subsection format (not tables) | Matches sk-doc template and system-spec-kit/skill-advisor catalogs |
| 3-4 categories per skill | Matches complexity without over-fragmenting |
| Source Files section links to per-feature files | Same pattern as skill-advisor catalog |
<!-- /ANCHOR:decisions -->
