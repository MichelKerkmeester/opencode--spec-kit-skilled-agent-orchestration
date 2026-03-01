---
title: "Spec: Update workflows-code--web-dev with Spec 031 Performance Teachings [010-performance-teachings/spec]"
description: "Incorporate performance optimization teachings from spec 005-anobel.com/031-anobel-performance-analysis into the workflows-code--web-dev skill reference files. This ensures lear..."
trigger_phrases:
  - "spec"
  - "update"
  - "workflows"
  - "code"
  - "web"
  - "029"
  - "performance"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Spec: Update workflows-code--web-dev with Spec 031 Performance Teachings

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_SCOPE: FROZEN -->

---

<!-- ANCHOR:metadata -->
## Objective

Incorporate performance optimization teachings from spec `005-anobel.com/031-anobel-performance-analysis` into the `workflows-code--web-dev` skill reference files. This ensures learnings are preserved as reusable patterns for future development.

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:scope -->
## Scope

### In Scope

Update the following skill files with teachings from spec 031:

1. **`observer_patterns.md`** - Add SharedObservers consolidation pattern (API, migration, multi-element)
2. **`wait_patterns.js`** - Add `motion:ready` CustomEvent pattern + `Promise.race` image timeout
3. **`cwv_remediation.md`** - Add timeout hierarchy (1s/2s/3s), mobile-specific safety timeout, `<head>` positioning
4. **`performance_patterns.md`** - Expand will-change cleanup guidance (premature declarations anti-pattern)
5. **`SKILL.md`** - Update keyword triggers + routing for SharedObservers
6. **`CHANGELOG.md`** - Version bump entry

### Out of Scope

- Bundle strategy (ADR-005 was superseded/cancelled)
- Service worker patterns (separate concern)
- Page-specific CSS/JS loading (already covered in `resource_loading.md`)
- TypeKit/ConsentPro decisions (pending in spec 031)

<!-- /ANCHOR:scope -->

## Source Material

- Research: `.opencode/specs/01--anobel.com/029-anobel-performance-analysis/research.md`
- Decisions: `.opencode/specs/01--anobel.com/029-anobel-performance-analysis/decision-record.md` (ADR-001, ADR-002)
- Implementation: SharedObservers migration in `video_player_hls_scroll.js`, `video_background_hls_hover.js`, `table_of_content.js`

## Impact

- Skill files are in `.opencode/` (symlink to Public repo) - edits affect ALL projects
- No runtime code changes - documentation/reference updates only
