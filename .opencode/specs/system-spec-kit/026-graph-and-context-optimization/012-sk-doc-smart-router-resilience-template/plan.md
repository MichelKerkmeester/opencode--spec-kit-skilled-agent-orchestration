---
title: "Implementation Plan: Smart-Router Resilience Pattern + Repo-Wide Adoption"
description: "Two-phase implementation: (1) sk-doc template + asset with the canonical pattern, (2) propagate to 19 existing skills."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
spec_id: "026/012"
level: 2
spec_kind: implementation
status: in-progress
importance_tier: important
---

# Implementation Plan: Smart-Router Resilience Pattern

<!-- ANCHOR:metadata -->
## METADATA

- **Spec ID:** 026/012
- **Executor:** cli-opencode + github-copilot/gpt-5.5 provider (different quota pool than direct cli-copilot)
- **Time budget:** ~60-90 min wall-clock

<!-- ANCHOR:context -->
## 1. CONTEXT

Barter coder repo's `sk-code` skill (834-line SKILL.md) implements a smart-router that survives reference/asset changes via 4 patterns:

1. **Runtime discovery** — `discover_markdown_resources()` uses `rglob("*.md")` to build inventory at every routing call. No hardcoded file lists.
2. **Existence-check before load** — `load_if_available()` checks `if guarded in inventory and guarded not in seen` before `load()`. Missing files just don't load; no crash.
3. **Routing key from extensible identifier** — for sk-code that's `get_project_remote()` (git remote URL). Generalizes to: any runtime-derived key (intent, stack marker, env var, etc.) that selects a `<key>/` subdir under `references/`/`assets/`.
4. **Multi-tier graceful fallback** — Tier 1 UNKNOWN_FALLBACK with disambiguation checklist when intent scores < 0.5; Tier 2 helpful "no knowledge base for X" notice when project-specific resources missing; Tier 3 happy path.

Plus structural safeguards: `_guard_in_skill()` sandboxes paths to skill root + rejects non-`.md`; `RESOURCE_BASES` filtered by `if base.exists()`; `_filter_paths()` returns input on empty keywords.

<!-- ANCHOR:phases -->
## 2. PHASES

### Phase 1: sk-doc template + asset (foundation)

**Goal:** establish canonical pattern in sk-doc so future skills inherit it.

Steps:

1. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/barter/coder/.opencode/skill/sk-code/SKILL.md` §2 SMART ROUTING (lines 75-457) to confirm exact pseudocode.

2. Create new asset: `.opencode/skill/sk-doc/assets/skill_template/smart-router-resilience.md` (or wherever sk-doc's skill template assets live — investigate). Contents:
   - **Section A: Why this pattern** (1 paragraph explaining failure modes prevented)
   - **Section B: 4 patterns** (with pseudocode for each)
   - **Section C: Generalization guide** — how to adapt the routing key (sk-code uses git remote; other skills might use intent label, stack, env var, etc.)
   - **Section D: Structural safeguards** (`_guard_in_skill`, base existence check, etc.)
   - **Section E: Anti-patterns** (hardcoded file lists, raw `load()` without check, etc.)

3. Update sk-doc's SKILL.md skill-creation template (the one referenced when generating new skills via `/create:sk-skill`):
   - Add a "Smart Router (Resilience Pattern)" subsection
   - Include a pseudocode skeleton with placeholders the new skill fills in (intent model, resource map, routing key)
   - Cross-link to the new asset for full pattern reference

4. Verify sk-doc's SKILL.md still validates per existing sk-doc rules.

### Phase 2: Repo-wide propagation (19 skills)

**Goal:** every existing smart router in this repo uses the resilience pattern.

Skills (19 total):
- `cli-claude-code`, `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-opencode`
- `mcp-chrome-devtools`, `mcp-coco-index`, `mcp-code-mode`, `mcp-figma`
- `sk-code-opencode`, `sk-code-review`, `sk-code`, `sk-deep-research`, `sk-deep-review`, `sk-doc`, `sk-git`, `sk-improve-agent`, `sk-improve-prompt`
- `system-spec-kit`

For EACH skill (single batched session):

1. Read its current SKILL.md → identify the smart-router section (look for "smart routing", "routing", "router pseudocode", "load_if_available", or domain-specific equivalents)
2. Determine which of the 4 patterns are missing or weak
3. Update the section with the resilience pattern, **preserving domain-specific intent scoring + load levels** (only swap discovery + load + fallback mechanics)
4. Cross-link to the new sk-doc asset

5. After all 19: run `rg -l "load_if_available\|discover_markdown_resources\|UNKNOWN_FALLBACK" .opencode/skill/*/SKILL.md` and confirm at least 19 hits.

<!-- ANCHOR:critical-path -->
## 3. CRITICAL PATH

Phase 1 must complete before Phase 2 (Phase 2 cross-links to Phase 1's asset). Within Phase 2, the 19 skill updates are independent — agent can batch them.

<!-- ANCHOR:risks-mitigations -->
## 4. RISKS & MITIGATIONS

- **Naive replacement breaks domain logic** → preserve INTENT_MODEL + RESOURCE_MAP; only swap mechanics.
- **Agent runs out of context across 19 skills** → cli-opencode session has full plugin/skill/MCP context; should be enough.
- **Markdown lint regression** → agent verifies each modified SKILL.md still parses.

<!-- ANCHOR:cost-estimates -->
## 5. COST ESTIMATES

| Phase | Files | Hours wall-clock |
|---|---|---|
| Phase 1 | 2-3 (sk-doc template + new asset + cross-links) | ~15-20 min |
| Phase 2 | 19 SKILL.md edits | ~40-60 min |
| **Total** | **~22 files** | **~60-80 min** |
