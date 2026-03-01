# Planning Summary: Notification System

**Spec Folder**: `.opencode/specs/01--anobel.com/z_archive/007-notification-system/`
**Created**: 2025-12-20
**Status**: Planning Complete - Ready for Implementation

---

<!-- ANCHOR:executive-summary -->
## Executive Summary

A CMS-driven notification system for the A. Nobel & Zn. website that displays:
- **Navbar banners** for site-wide announcements (maintenance, outages)
- **Hero toasts** for contextual notifications (office hours changes, holidays)

Key features:
- 100% CMS-controlled content via Webflow
- Smart dismiss tracking (session, daily, or until expiration)
- Office hours integration for automatic holiday notifications
- Single notification display (highest priority wins)
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:documents-created -->
## Documents Created

| Document | Purpose | Status |
|----------|---------|--------|
| [spec.md](./spec.md) | Requirements, user stories, CMS structure | Complete |
| [plan.md](./plan.md) | Technical approach, code patterns, phases | Complete |
| [checklist.md](./checklist.md) | 50-item validation checklist | Complete |
<!-- /ANCHOR:documents-created -->

---

<!-- ANCHOR:implementation-phases -->
## Implementation Phases

| Phase | Description | Estimated Time |
|-------|-------------|----------------|
| **1. CMS Setup** | Create collection, components in Webflow | 1-2 hours |
| **2. Core JavaScript** | Parsing, filtering, display logic | 2-3 hours |
| **3. Dismiss Persistence** | localStorage with reset behaviors | 1 hour |
| **4. Office Hours Integration** | MutationObserver, conditional display | 1-2 hours |
| **5. Testing** | Cross-browser, all scenarios | 1 hour |

**Total Estimated**: 6-9 hours
<!-- /ANCHOR:implementation-phases -->

---

<!-- ANCHOR:key-decisions-made -->
## Key Decisions Made

1. **Single notification only** - Highest priority wins when multiple are active
2. **No animations** - Static appear/disappear per user preference
3. **Webflow handles positioning** - JavaScript only controls visibility
4. **CMS text via embed** - Content managers write all notification text
5. **Office hours integration** - Auto-show on holidays, CMS can override
<!-- /ANCHOR:key-decisions-made -->

---

<!-- ANCHOR:cms-collection-notifications -->
## CMS Collection: "Notifications"

**Required Fields**:
- `name` (Plain Text) - Internal identifier
- `notification-type` (Option) - banner / toast / both
- `title` (Plain Text) - Main message
- `priority` (Number) - Higher = more important
- `is-closable` (Switch) - Show X button
- `dismiss-behavior` (Option) - session / day / until-end-date
- `is-active` (Switch) - Manual override

**Optional Fields**:
- `description` (Plain Text) - Secondary text
- `icon` (Option) - bell / warning / info / maintenance
- `link-url` (URL) - CTA destination
- `link-text` (Plain Text) - CTA button text
- `start-date` (DateTime) - When to start showing
- `end-date` (DateTime) - When to stop showing
- `link-to-office-hours` (Switch) - Enable integration
- `show-when` (Option) - always / when-open / when-closed
<!-- /ANCHOR:cms-collection-notifications -->

---

<!-- ANCHOR:files-to-create -->
## Files to Create

```
src/2_javascript/notification_system.js   # Main script (~300-400 lines)
```

**Note**: CSS handled in Webflow Designer, not separate file.
<!-- /ANCHOR:files-to-create -->

---

<!-- ANCHOR:next-steps -->
## Next Steps

To implement this feature, run:

```
/spec_kit:implement
```

Or manually:
1. Create CMS collection in Webflow
2. Add hidden collection list to global embed
3. Create banner and toast components
4. Write `notification_system.js`
5. Test all scenarios per checklist.md
<!-- /ANCHOR:next-steps -->

---

<!-- ANCHOR:risk-summary -->
## Risk Summary

| Risk | Mitigation |
|------|------------|
| CMS structure changes | Defensive parsing with fallbacks |
| Office hours not loaded | Check for element before observing |
| localStorage unavailable | Graceful degradation |
<!-- /ANCHOR:risk-summary -->

---

<!-- ANCHOR:questions-resolved -->
## Questions Resolved

- Display location: Webflow handles positioning
- Multiple notifications: Show only highest priority
- Animation: Static (no animation)
- Holiday content: CMS-driven text via embed
- Banner closable: Both options supported via CMS field
<!-- /ANCHOR:questions-resolved -->
