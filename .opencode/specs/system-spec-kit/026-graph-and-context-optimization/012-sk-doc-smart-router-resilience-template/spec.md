---
title: "Feature Specification: Smart-Router Resilience Pattern in sk-doc Template + Repo-Wide Adoption"
description: "Promote the Barter coder repo's resilient smart-router pattern (runtime discovery + existence-check load + git-remote project key + 3-tier fallback) into sk-doc as the default skill SKILL.md template. Add a dedicated assets/ file for the router. Then update all 19 existing skills in this repo that have a smart-router with the new pattern."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "smart router resilience"
  - "skill router pattern"
  - "runtime discovery router"
  - "sk-doc router template"
  - "smart routing fallback"
  - "barter router pattern"
spec_id: "026/012"
level: 2
spec_kind: implementation
status: in-progress
importance_tier: important
_memory:
  spec_id: 026/012
  level: 2
  spec_kind: implementation
  status: in-progress
  topic: "sk-doc smart-router resilience template + repo-wide adoption"
  importance_tier: important
  continuity:
    last_updated_at: "2026-05-02T20:35:00Z"
    completion_pct: 5
    recent_action: "Spec scaffolded for cli-opencode + github-copilot/gpt-5.5 implementation"
    next_safe_action: "Dispatch cli-opencode agent (uses different quota pool than direct cli-copilot)"
---

# Feature Specification: Smart-Router Resilience Pattern in sk-doc Template

<!-- ANCHOR:metadata -->
## METADATA

- **Spec ID:** 026/012
- **Level:** 2 (template + asset addition + repo-wide propagation; small surface but many touch points)
- **Status:** in-progress
- **Created:** 2026-05-02
- **Source pattern:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/barter/coder/.opencode/skill/sk-code/SKILL.md` §2 SMART ROUTING

<!-- ANCHOR:problem -->
## 1. PROBLEM

Skills in this repo with smart routers have hardcoded paths or static resource lists. When references/assets change (rename, move, delete, new project added), the router breaks or silently degrades. The Barter coder repo's `sk-code` skill solved this with a 4-pattern resilience design that has been battle-tested across 8 projects and 84 markdown files.

This pattern needs to:
1. Become the **default** in sk-doc's skill template (so any new skill scaffolded via sk-doc inherits it)
2. Live as a **separate asset** in sk-doc (so it can evolve independently and be referenced by multiple templates)
3. Be **propagated to all 19 existing smart routers** in this repo

<!-- ANCHOR:scope -->
## 2. SCOPE (FROZEN)

### IN scope

**A. sk-doc template + asset**
- Update sk-doc's SKILL.md template (the one used when generating new skills) to include the smart-router pattern by default
- Create new asset: `.opencode/skill/sk-doc/assets/skill_template/smart-router.md` (or similar — codex picks the right path) containing the canonical router pseudocode + design rationale
- Cross-link from SKILL.md template to the asset

**B. Repo-wide propagation (19 skills)**
- `cli-claude-code`, `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-opencode`
- `mcp-chrome-devtools`, `mcp-coco-index`, `mcp-code-mode`, `mcp-figma`
- `sk-code-opencode`, `sk-code-review`, `sk-code`, `sk-deep-research`, `sk-deep-review`, `sk-doc`, `sk-git`, `sk-improve-agent`, `sk-improve-prompt`
- `system-spec-kit`

For each: update its existing smart-router section with the resilience pattern OR add one if absent. Don't break existing routing logic — preserve domain-specific intent scoring + load levels; only swap the **discovery + load** mechanics.

### OUT of scope

- Changing the underlying intent classification logic of any skill
- Adding NEW skills (only updating existing ones)
- Changing the Barter pattern itself (it's the source of truth)

<!-- ANCHOR:requirements -->
## 3. REQUIREMENTS

### Functional Requirements

**F1.** Reproduce the 4 Barter resilience patterns in sk-doc's asset:
1. Runtime discovery via `rglob("*.md")` (no hardcoded file lists)
2. Existence-check before load (`if guarded in inventory`)
3. Routing key from extensible identifier (e.g., git remote, intent label, stack marker)
4. Multi-tier graceful fallback (UNKNOWN → notice → happy path)

**F2.** sk-doc's skill template embeds the pattern by default in newly-scaffolded skills (not a separate add-on).

**F3.** All 19 existing smart routers updated to use the pattern. For each: discovery + load + fallback semantics adopt the new pattern; per-skill intent scoring preserved.

**F4.** Cross-links: the new asset is referenced from sk-doc/SKILL.md AND from each of the 19 skills' SKILL.md (so future maintainers see the canonical source).

### Quality Requirements

- All 19 skills' SKILL.md still parses cleanly (no broken markdown)
- workflow-invariance vitest still passes
- Each skill's SKILL.md remains self-contained enough to be useful (the asset is reference; SKILL.md doesn't depend on dynamic loading at advisor time)

<!-- ANCHOR:success-criteria -->
## 4. SUCCESS CRITERIA

- **SC-001:** sk-doc/assets/ contains the new smart-router asset; sk-doc/SKILL.md template references it
- **SC-002:** All 19 listed skills have smart-router sections updated with the 4-pattern design
- **SC-003:** workflow-invariance vitest passes
- **SC-004:** Spot-check: pick 3 random skills, confirm their router section includes the discovery + existence-check + fallback patterns

<!-- ANCHOR:risks -->
## 5. RISKS

- **R1 [P1]** — 19 skills × manual edit = high token cost. Mitigation: cli-opencode agent batches the work in one session.
- **R2 [P1]** — Per-skill intent scoring is bespoke. Naive swap could break domain-specific routing. Mitigation: preserve existing INTENT_MODEL/RESOURCE_MAP per skill; only swap discovery+load+fallback mechanics.
- **R3 [P2]** — Markdown rendering: large pseudocode blocks may break some skills' table-of-contents. Mitigation: agent verifies SKILL.md still parses (basic markdown lint).

<!-- ANCHOR:related-documents -->
## 6. RELATED DOCUMENTS

- Source pattern: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/barter/coder/.opencode/skill/sk-code/SKILL.md` §2 SMART ROUTING (lines 75-457)
- sk-doc skill: `.opencode/skill/sk-doc/`
- All 19 skills: `.opencode/skill/<name>/SKILL.md`
