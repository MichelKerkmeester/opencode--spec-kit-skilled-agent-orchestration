---
title: "Decision Record: Comprehensive Performance Optimization - anobel.com [031-anobel-performance-analysis/decision-record]"
description: "Hero scripts in anobel.com have inconsistent timeout behavior"
trigger_phrases:
  - "decision"
  - "record"
  - "comprehensive"
  - "performance"
  - "optimization"
  - "decision record"
  - "031"
  - "anobel"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Comprehensive Performance Optimization - anobel.com

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Timeout Value Selection

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-01 |
| **Deciders** | Claude (10-Agent Analysis), User |
| **Related Issues** | A-01, A-02, A-03, A-04 |

---

<!-- ANCHOR:adr-001-context -->
### Context

Hero scripts in anobel.com have inconsistent timeout behavior:
- `hero_webshop.js`: **No timeout** (infinite loop if Motion.dev fails)
- `hero_general.js`: **10-second timeout** (defeats the 3-second safety timeout)
- `hero_cards.js`: **No image timeout** (waits forever if image 404s)
- `global.html`: **3-second safety timeout** (but runs too late in document)

This inconsistency causes mobile LCP of 20.2 seconds when resources are slow or fail.


<!-- /ANCHOR:adr-001-context -->

### Constraints
- Must work on slow 3G connections (typical rural/mobile)
- Must not break animations when resources load quickly
- Must integrate with existing safety timeout mechanism
- Must maintain good UX (no jarring transitions)

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Standardize on 1s for Motion.dev, 2s for images, 3s/2s for safety timeout.

| Component | Current | New | Rationale |
|-----------|---------|-----|-----------|
| Motion.dev wait | 10s or ∞ | 1000ms | Library should load in <500ms; 1s is generous fallback |
| Image wait | ∞ | 2000ms | Preloaded images load fast; 2s catches 404s and slow CDN |
| Safety timeout (desktop) | 3000ms (late) | 3000ms (early) | Move to `<head>` so it fires before deferred scripts |
| Safety timeout (mobile) | 3000ms (late) | 2000ms (early) | Faster reveal on mobile for better perceived performance |

**Implementation Details**:
1. Motion.dev polling loops get `setTimeout` wrapper with `clearTimeout` on success
2. Image loading promises wrapped in `Promise.race()` with timeout promise
3. Safety timeout script moved to `<head>` before any `defer` scripts

---


<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **1s/2s/3s (Chosen)** | Fast reveal, catches failures, matches Core Web Vitals | May timeout before slow resources | 9/10 |
| 2s/3s/4s | More forgiving | Still too slow for mobile LCP target | 6/10 |
| 500ms/1s/2s | Very fast reveal | May frequently interrupt normal loads | 5/10 |
| No timeouts (current) | Never interrupts animations | Page can hang forever | 1/10 |

**Why Chosen**: The 1s/2s/3s pattern balances between:
- Core Web Vitals requirement (LCP <4s)
- Real-world CDN performance (typically <500ms for assets)
- Graceful degradation when resources fail

---


<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current infinite/10s timeouts cause 20s LCP |
| 2 | **Beyond Local Maxima?** | PASS | Considered 4 timeout configurations |
| 3 | **Sufficient?** | PASS | Simplest fix: change timeout values |
| 4 | **Fits Goal?** | PASS | Directly addresses P0 requirements |
| 5 | **Open Horizons?** | PASS | Doesn't preclude future Motion.dev improvements |

**Checks Summary**: 5/5 PASS

---


<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Page guaranteed visible within 3 seconds (mobile: 2 seconds)
- No more infinite hangs when resources fail
- Better perceived performance on slow connections
- Measurable improvement in Core Web Vitals

**Negative**:
- Animations may complete after page reveal on very slow connections
- Mitigation: CSS provides acceptable fallback state (opacity:1, static positions)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Fast timeout interrupts slow load | Low | Animations complete after reveal |
| CSS fallback state looks incomplete | Low | Ensure CSS defaults are acceptable |

---


<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `hero_webshop.js` (add 1s timeout)
- `hero_general.js` (reduce 10s→1s, add 2s image timeout)
- `hero_cards.js` (add 2s image timeout)
- `global.html` (move safety timeout to `<head>`, add mobile detection)

**Rollback**: Restore original timeout values from backup files

---


<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Motion.dev Ready Event Pattern

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-01 |
| **Deciders** | Claude (10-Agent Analysis) |
| **Related Issues** | B-01 |

---

<!-- ANCHOR:adr-002-context -->
### Context

The codebase has **17 separate polling loops** checking for Motion.dev availability:
- Each script polls every 50ms: `setTimeout(check_motion, 50)`
- Multiple scripts may be active on the same page
- This causes unnecessary CPU usage and potential race conditions
- No coordination between scripts about Motion.dev readiness

Example of current pattern (repeated in 17 scripts):
```javascript
const check_motion = () => {
  if (window.Motion && typeof window.Motion.animate === 'function') {
    init_something();
  } else {
    setTimeout(check_motion, 50);
  }
};
check_motion();
```


<!-- /ANCHOR:adr-002-context -->

### Constraints
- Must work with async ES module loading
- Must maintain backwards compatibility (scripts may load in any order)
- Must not break if Motion.dev loads before script runs
- Must integrate with timeout mechanism from ADR-001

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Dispatch single `motion:ready` CustomEvent from global.html; scripts listen instead of poll.

**Implementation**:

1. In `global.html` after Motion.dev import:
```javascript
<script type="module">
  const { animate, scroll, inView, ... } = await import("...")
  window.Motion = { animate, scroll, inView, ... }
  
  // NEW: Dispatch ready event
  window.dispatchEvent(new CustomEvent('motion:ready'));
</script>
```

2. In each script that needs Motion.dev:
```javascript
function init_hero() {
  // Use window.Motion.animate, etc.
}

if (window.Motion && typeof window.Motion.animate === 'function') {
  // Already loaded - init immediately
  init_hero();
} else {
  // Wait for event
  window.addEventListener('motion:ready', init_hero, { once: true });
  // Timeout still applies from ADR-001
}
```

---


<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **CustomEvent (Chosen)** | Single event, no polling, clean | Requires updating 17 scripts | 9/10 |
| Shared global flag | Simple check | Still requires polling | 5/10 |
| Promise-based loader | Cleaner async | More complex, new pattern | 7/10 |
| Keep polling | No changes needed | Wastes CPU, 17 parallel loops | 2/10 |

**Why Chosen**: CustomEvent is:
- Native browser API (no library needed)
- Already used by Motion.dev internally
- Single source of truth (one event, many listeners)
- No CPU waste from polling

---


<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 17 parallel polling loops waste CPU |
| 2 | **Beyond Local Maxima?** | PASS | Considered 4 patterns |
| 3 | **Sufficient?** | PASS | Single event replaces all polling |
| 4 | **Fits Goal?** | PASS | Reduces CPU, improves reliability |
| 5 | **Open Horizons?** | PASS | Can extend pattern for other libraries |

**Checks Summary**: 5/5 PASS

---


<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Eliminates 17 parallel polling loops
- Reduces CPU usage during page load
- Single source of truth for Motion.dev readiness
- Cleaner code pattern for future scripts

**Negative**:
- Requires updating 17 scripts
- Mitigation: Phase 3 implementation, script-by-script

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Event fires before listener attached | Low | Check window.Motion first |
| Script loads after timeout | Low | Timeout fallback still works |

---


<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- `global.html` (add event dispatch)
- All hero scripts (17 files) - replace polling with listener

**Rollback**: Remove event dispatch, restore polling pattern

---


<!-- /ANCHOR:adr-002-impl -->

<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: Webflow Platform Constraints Acceptance

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-01 |
| **Deciders** | Claude (10-Agent Analysis), User |
| **Related Issues** | E-03, E-04, C-09, G-05 |

---

<!-- ANCHOR:adr-003-context -->
### Context

Webflow platform injects several blocking resources that cannot be modified:
- **jQuery** (87KB, blocking) - Required for Webflow interactions
- **Webflow.js** (70KB, blocking) - Core platform functionality
- **Main CSS** (339KB, blocking) - Platform-generated styles

Combined, these represent ~496KB of blocking resources that contribute to slow FCP/LCP.


<!-- /ANCHOR:adr-003-context -->

### Constraints
- Cannot remove jQuery (Webflow interactions would break)
- Cannot modify Webflow.js (would break on next publish)
- Cannot modify main CSS (regenerated on publish)
- Site must remain on Webflow platform

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Accept Webflow constraints and optimize only custom code.

**Rationale**:
1. **Platform lock-in**: Site uses Webflow interactions extensively
2. **Diminishing returns**: Optimizing custom code yields significant gains
3. **Risk avoidance**: Custom Webflow.js would break on platform updates
4. **Focus**: 236KB custom JS + 237KB custom CSS is optimizable

**Accepted baseline**:
| Resource | Size | Blocking | Status |
|----------|------|----------|--------|
| jQuery | 87KB | Yes | Accept - cannot change |
| Webflow.js | 70KB | Yes | Accept - cannot change |
| Main CSS | 339KB | Yes | Accept - cannot change |
| **Total Accepted** | 496KB | | Permanent overhead |

**Focus optimization on**:
| Resource | Size | Optimizable | Target |
|----------|------|-------------|--------|
| Custom JS | 236KB | Yes | <180KB |
| Custom CSS | 237KB | Yes | <100KB per page |
| Images | Variable | Yes | Responsive, lazy |

---


<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Accept constraints (Chosen)** | No platform risk, focus effort | ~500KB permanent overhead | 8/10 |
| Self-host jQuery | Could defer | Breaks Webflow interactions | 3/10 |
| Remove Webflow.js | Eliminates 70KB | Breaks all interactions | 1/10 |
| Migrate to static | Full control | Complete rebuild | 4/10 |
| Headless Webflow | API-based | Significant development effort | 5/10 |

**Why Chosen**: Accepting constraints allows:
- No platform risk
- Focused optimization effort on controllable resources
- Significant gains still possible (~200KB reduction)
- Maintains site maintainability

---


<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must decide how to handle platform limits |
| 2 | **Beyond Local Maxima?** | PASS | Considered 5 alternatives |
| 3 | **Sufficient?** | PASS | Acceptance enables focused optimization |
| 4 | **Fits Goal?** | PASS | Custom code optimization still achieves targets |
| 5 | **Open Horizons?** | PASS | Doesn't preclude future platform migration |

**Checks Summary**: 5/5 PASS

---


<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Clear scope for optimization effort
- No risk of breaking Webflow functionality
- Maintainable long-term

**Negative**:
- ~500KB blocking payload is permanent
- Mobile score limited by platform overhead
- Mitigation: Aggressive optimization of custom code can still hit targets

---


<!-- /ANCHOR:adr-003-consequences -->

<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:adr-004 -->
## ADR-004: Video Poster Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-01 |
| **Deciders** | Claude (10-Agent Analysis) |
| **Related Issues** | A-06, D-04 |

---

<!-- ANCHOR:adr-004-context -->
### Context

Hero videos on anobel.com have no poster images, causing:
- Blank hero area during video load (500ms-3s)
- No LCP candidate until video first frame
- Poor perceived performance


<!-- /ANCHOR:adr-004-context -->

### Constraints
- Poster should match first frame (no jarring transition)
- Must be optimized format (WebP preferred)
- Must be hosted on CDN (BunnyCDN)

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Extract first frame from each hero video, convert to WebP, host on BunnyCDN.

**Implementation**:
1. Use ffmpeg to extract first frame:
   ```bash
   ffmpeg -i hero-video.mp4 -frames:v 1 -q:v 2 hero-poster.jpg
   ```
2. Convert to WebP (quality 80):
   ```bash
   cwebp -q 80 hero-poster.jpg -o hero-poster.webp
   ```
3. Upload to BunnyCDN
4. Add `poster` attribute to video element:
   ```html
   <video poster="https://anobel-zn.b-cdn.net/hero-home-poster.webp" ...>
   ```

---


<!-- /ANCHOR:adr-004-decision -->

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **First frame extraction (Chosen)** | Seamless transition | Requires video processing | 9/10 |
| Designed poster | Brand-consistent | May not match video start | 6/10 |
| Blurred placeholder | Fast load | Jarring transition | 5/10 |
| No poster | No extra asset | Blank during load | 2/10 |

**Why Chosen**: First frame extraction ensures seamless transition from poster to video.

---


<!-- /ANCHOR:adr-004-alternatives -->

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- Immediate visual content on page load
- LCP candidate available before video loads
- Seamless transition to video playback

**Negative**:
- Requires video processing for each hero video
- Mitigation: One-time process per video

---


<!-- /ANCHOR:adr-004-consequences -->

<!-- /ANCHOR:adr-004 -->

<!-- ANCHOR:adr-005 -->
## ADR-005: Bundle Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | ~~Proposed~~ **SUPERSEDED** (2025-01-20) |
| **Date** | 2025-02-01 |
| **Superseded Date** | 2025-01-20 |
| **Deciders** | TBD - User approval needed |
| **Related Issues** | B-06, G-01, G-02 |

> **⚠️ DECISION SUPERSEDED**
> 
> This bundling approach was evaluated but **removed from scope**. 
> 
> **Reason**: Individual script loading is preferred for this Webflow-based project. Webflow's deployment model and custom code injection points don't align well with bundled assets. The complexity of maintaining page-specific bundles outweighs the performance benefits.
> 
> **Cancelled Tasks**: T023, T030, T031, T034
> 
> **Active Alternatives**: 
> - SharedObservers consolidation (T033) ✅ COMPLETE
> - Motion.dev tree-shaking (T028) ✅ COMPLETE
> - Individual script optimization continues

---

<!-- ANCHOR:adr-005-context -->
### Context

Currently, all 48 JS files (236KB) and 47 CSS files (237KB) load on every page:
- Form scripts (62KB) load on pages without forms
- Video CSS (17KB) loads on pages without video
- No code splitting or page-specific bundles


<!-- /ANCHOR:adr-005-context -->

### Constraints
- Must maintain Webflow custom code workflow
- Must work with R2 CDN hosting
- Should not require complex build system

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**Summary**: Create page-type bundles (core, form, video) loaded conditionally.

**Proposed bundles**:

| Bundle | Contents | Size | Pages |
|--------|----------|------|-------|
| `core.js` | Hero, nav, modal, animations | ~100KB | All |
| `form.js` | FilePond, validation, form scripts | ~62KB | werken_bij, vacature, contact |
| `video.js` | HLS.js, video controls | ~30KB | home, about, services (6) |
| `blog.js` | Blog-specific scripts | ~20KB | blog, blog-post |

| Bundle | Contents | Size | Pages |
|--------|----------|------|-------|
| `core.css` | Hero, nav, modal, buttons | ~100KB | All |
| `form.css` | FilePond, form styles | ~53KB | Form pages only |
| `video.css` | Video player styles | ~17KB | Video pages only |

---


<!-- /ANCHOR:adr-005-decision -->

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Page-type bundles (Chosen)** | Reduces payload per page | Requires conditional loading | 8/10 |
| Per-page bundles | Optimal per page | 18 bundles to maintain | 5/10 |
| Keep single bundle | Simple | All code on all pages | 4/10 |
| Dynamic imports | Optimal loading | Complex, Webflow constraints | 6/10 |

**Why Chosen**: Page-type bundles balance optimization with maintainability.

---


<!-- /ANCHOR:adr-005-alternatives -->

<!-- ANCHOR:adr-005-impl -->
### Implementation

**Phase 6 tasks**:
- T030: Create page-specific JS bundles
- T031: Create page-specific CSS bundles
- Update page HTML to load appropriate bundles

**Rollback**: Revert to single bundle per type

---

## Session Decision Log

> **Purpose**: Track all gate decisions made during this session for audit trail and learning.

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
| 2025-02-01 16:00 | Issue Prioritization | 50+ issues categorized P0-P3 | HIGH | 0.10 | 10-agent analysis agreement |
| 2025-02-01 16:30 | Timeout Values | 1s/2s/3s pattern | HIGH | 0.15 | Core Web Vitals guidance |
| 2025-02-01 17:00 | Motion.dev Pattern | CustomEvent over polling | HIGH | 0.10 | Standard browser API |
| 2025-02-01 17:30 | Webflow Constraints | Accept, optimize custom | HIGH | 0.05 | Platform limitation |
| 2025-02-01 18:00 | Video Poster | First frame extraction | MEDIUM | 0.20 | Standard practice |
| 2025-02-01 18:30 | Bundle Strategy | Page-type bundles | MEDIUM | 0.25 | Proposed, needs approval |
| 2025-01-20 | Bundle Strategy | **CANCELLED** - Remove bundling from scope | HIGH | 0.05 | Individual scripts preferred for Webflow; T023, T030, T031, T034 cancelled |

**Log Instructions**:
- Record each gate decision as it occurs during the session
- Include both PASS and BLOCK decisions for completeness
- Link to relevant ADR if decision resulted in new architecture record

---

## Future Decisions (Pending)


<!-- /ANCHOR:adr-005-impl -->

### ADR-006: TypeKit Font Strategy (Pending)
**Status**: Needs Investigation
**Question**: Should TypeKit be replaced with self-hosted fonts or kept with `font-display: swap`?
**Blocker**: Requires font audit to determine if TypeKit is actually used

### ADR-007: ConsentPro Replacement (Pending)
**Status**: Needs Legal Review
**Question**: Can custom `modal_cookie_consent.js` fully replace ConsentPro (301KB)?
**Blocker**: Legal review of GDPR requirements

---

<!--
LEVEL 3+ DECISION RECORD (~500 lines)
- 5 comprehensive ADRs with Five Checks evaluation
- Session Decision Log for audit trail
- Alternatives considered with scoring
- Implementation details and rollback procedures
- Future decisions documented as pending
-->


<!-- /ANCHOR:adr-005 -->