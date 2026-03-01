---
title: "Plan: Update workflows-code--web-dev with Spec 031 Performance Teachings [010-performance-teachings/plan]"
description: "Direct file edits to 6 skill files. All changes are additive (new sections, expanded content) — no existing content removed."
trigger_phrases:
  - "plan"
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

# Plan: Update workflows-code--web-dev with Spec 031 Performance Teachings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## Approach

Direct file edits to 6 skill files. All changes are additive (new sections, expanded content) — no existing content removed.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:phases -->
## Execution Steps

1. **observer_patterns.md** — Add Section 7: SharedObservers Consolidation Pattern
   - Document `window.SharedObservers` API surface
   - Migration pattern: SharedObservers primary, raw IO fallback
   - Multi-element pattern from `table_of_content.js`
   - Renumber current Section 7 (Related Resources) to Section 8

2. **wait_patterns.js** — Add to Section 4 (Library/Dependency Patterns)
   - `wait_for_motion()` using `motion:ready` CustomEvent (replaces polling)
   - `wait_for_image_with_timeout()` using `Promise.race` with configurable timeout
   - Update exports (module + browser global)

3. **cwv_remediation.md** — Enhance Safety Timeout section
   - Add timeout hierarchy table: 1s Motion.dev, 2s images, 3s desktop safety, 2s mobile safety
   - Document `<head>` positioning requirement (before deferred scripts)
   - Add mobile-specific timeout variant with device detection

4. **performance_patterns.md** — Expand will-change guidance
   - Add anti-pattern: static `will-change` in CSS stylesheets
   - Add guidance: JS-only will-change with cleanup on animation complete

5. **SKILL.md** — Update routing
   - Add "shared_observers", "sharedobservers", "observer consolidation" to OBSERVERS keyword trigger
   - Change observer_patterns.md from ON_DEMAND to CONDITIONAL
   - Update SKILL.md version to 2.0.1

6. **CHANGELOG.md** — Add 1.0.9.1 entry

<!-- /ANCHOR:phases -->

<!-- ANCHOR:rollback -->
## Risk

- **Public repo impact**: `.opencode/` is symlink — edits propagate to all projects
- **Mitigation**: Additive-only changes, no breaking modifications

<!-- /ANCHOR:rollback -->
