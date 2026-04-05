# sk-code-web Changelog

All notable changes to the `sk-code-web` skill are documented here.

---

## 1.1.0.0 - 2026-03-07

**Expanded deferred-loading guidance and added canonical performance assets.**

### Changed
- Expanded PERFORMANCE router vocabulary in `SKILL.md` for `interaction`, `first interaction`, `defer`, `deferred loading`, `PageSpeed`, `Lighthouse`, `TBT`, `INP`, `main thread`, and `long tasks` prompts.
- Expanded `RESOURCE_MAP["PERFORMANCE"]` to surface existing performance references plus the new deferred-loading reference and checklist.
- Updated `README.md` structure inventory to expose the new performance resources and this changelog path.
- Aligned the new checklist and pattern assets with the `sk-doc` asset-template conventions.

### Added
- `references/performance/interaction_gated_loading.md` - practical gate-selection and non-deferrable exclusion guidance.
- `assets/patterns/interaction_gate_patterns.js` - reusable load-once, first-interaction, viewport, idle-fallback, and idempotent-init helpers.
- `assets/checklists/performance_loading_checklist.md` - measurable Lighthouse/TBT/INP verification checklist for deferred-loading work.

### Verification
- PERFORMANCE router prompt set: `10/10` routed to PERFORMANCE.
- Asset/reference inventory updated in `README.md`.

---

## 1.0.9.0 - 2026-03-07

**Added the initial interaction-gated loading performance guidance.**

### Changed
- Expanded PERFORMANCE routing vocabulary for interaction-gated loading, Lighthouse/PageSpeed, TBT, INP, and main-thread prompts.
- Updated the structure inventory so the new performance router resources are easy to discover.

### Added
- `interaction_gated_loading.md`
- `interaction_gate_patterns.js`
- `performance_loading_checklist.md`

---

## 1.0.6.0 - 2026-02-14

**Updated FilePond upload documentation to match production behavior.**

### Changed
- Documented `data-label-error-upload` and clarified localized upload-failure messaging.
- Clarified MIME-first validation with extension alias fallbacks and native `accept` synchronization.
- Added guidance for `processfile` error-path handling (ERROR state instead of forced COMPLETE).
- Added upload URL submission-guard notes to prevent non-idle upload states from submitting with empty hidden URL values.
- Updated uploaded-file R2 domain references to `pub-383189394a924ad3b619aa4522f32d27.r2.dev` and aligned cross-references.
