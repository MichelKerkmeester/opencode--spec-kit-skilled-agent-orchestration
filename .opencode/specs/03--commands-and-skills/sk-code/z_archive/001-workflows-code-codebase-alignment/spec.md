---
title: "Feature Specification: Workflows-Code Skill Alignment - Codebase Analysis [001-workflows-code-codebase-alignment/spec]"
description: "Complete analysis of alignment between workflows-code skill documentation and actual anobel.com codebase patterns."
trigger_phrases:
  - "feature"
  - "specification"
  - "workflows"
  - "code"
  - "skill"
  - "spec"
  - "020"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Workflows-Code Skill Alignment - Codebase Analysis & Updates

Complete analysis of alignment between workflows-code skill documentation and actual anobel.com codebase patterns.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Tags**: workflows-code, skill-alignment, documentation
- **Priority**: P1
- **Feature Branch**: `002-workflows-code-alignment`
- **Created**: 2024-12-22
- **Status**: In Progress
- **Input**: Sequential Thinking analysis of src/ codebase vs .opencode/skills/workflows-code/

### Stakeholders
- AI Agent (primary consumer of skill documentation)
- Developer (maintainer of codebase patterns)

### Purpose
Align the workflows-code skill documentation with actual production code patterns to ensure AI agents receive accurate, up-to-date guidance when implementing new features.

### Assumptions
- Codebase patterns in `src/2_javascript/` represent the authoritative source of truth
- Skill documentation should reflect patterns actually used, not theoretical ideals
- Observer-based patterns are preferred over polling for performance

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:scope -->
## 2. SCOPE

### In Scope
- **P1 Critical**: Rewrite `wait_patterns.js` to use Observer-based patterns (matches actual code)
- **P1 Critical**: Update `validation_patterns.js` to include Webflow/Botpoison integration
- **P2 Important**: Create `observer_patterns.md` reference file
- **P2 Important**: Create `lenis_patterns.js` asset file
- **P2 Important**: Update `animation_workflows.md` with Motion.dev timeline examples
- **P2 Important**: Add CSS section to `code_quality_standards.md`
- **P3 Nice-to-Have**: Create `hls_patterns.js` for video streaming
- **P3 Nice-to-Have**: Create `third_party_integrations.md` reference
- **P3 Nice-to-Have**: Update `quick_reference.md` with common one-liners

### Out of Scope
- Changes to actual source code in `src/`
- New feature implementation
- Performance testing of patterns

<!-- /ANCHOR:scope -->

---

## 3. ANALYSIS FINDINGS

### Patterns That ALIGN (No Changes Needed)

| Pattern | Skill Location | Codebase Usage |
|---------|----------------|----------------|
| CDN-safe IIFE initialization | `code_quality_standards.md` | All JS files use `INIT_FLAG`, `INIT_DELAY_MS` |
| Naming conventions | `code_quality_standards.md` | Consistent `snake_case` functions, `UPPER_SNAKE_CASE` constants |
| Section headers | `code_quality_standards.md` | All files use `/* 1. CONFIGURATION */` format |
| Webflow.push() integration | `webflow_patterns.md` | Used in all files for CDN timing |
| Motion.dev strategy | `animation_workflows.md` | Motion.dev for complex, CSS for simple |

### Patterns That MISALIGN (Updates Required)

#### GAP 1: Polling vs Observer Patterns (CRITICAL)

**Current Skill (`wait_patterns.js`):**
```javascript
// Polling-based (NOT used in production)
async function waitForElement(selector, timeout = 5000) {
  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
```

**Actual Codebase (`nav_notifications.js:150-160`):**
```javascript
// MutationObserver-based (production pattern)
function observeCMSChanges(container, callback) {
  const observer = new MutationObserver((mutations) => {
    callback(mutations);
  });
  observer.observe(container, { childList: true, subtree: true });
  return () => observer.disconnect();
}
```

**Required Action**: Rewrite `wait_patterns.js` with Observer patterns

---

#### GAP 2: IntersectionObserver Patterns (MISSING)

**Actual Codebase (`table_of_content.js:287-300`):**
```javascript
function handle_intersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      visible_sections[entry.target.id] = true;
    } else {
      delete visible_sections[entry.target.id];
    }
  });
  // Batch DOM updates with RAF for 60fps
}

const observer = new IntersectionObserver(handle_intersection, {
  rootMargin: `${config.root_margin_top} 0px ${config.root_margin_bottom} 0px`,
  threshold: [0, 0.1, 0.5, 1]
});
```

**Required Action**: Create `observer_patterns.md` with IntersectionObserver examples

---

#### GAP 3: Lenis Smooth Scroll Integration (MISSING)

**Actual Codebase (`table_of_content.js`, `hero_general.js`):**
```javascript
// Global lenis reference pattern
if (window.lenis) {
  window.lenis.scrollTo(targetElement, {
    offset: -100,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });
}
```

**Required Action**: Create `lenis_patterns.js` with scroll integration patterns

---

#### GAP 4: Form Validation with Botpoison (PARTIAL)

**Current Skill (`validation_patterns.js`):**
- Generic form validation class
- No Webflow integration
- No spam protection

**Actual Codebase (`form_submission.js:1-50`):**
- Botpoison challenge generation
- Webflow form state management
- Custom error display with Webflow compatibility

**Required Action**: Update `validation_patterns.js` with Webflow/Botpoison patterns

---

#### GAP 5: CSS Documentation (MISSING)

**Actual Codebase (`fluid_responsive.css`):**
```css
:root {
  --fluid-min-width: 320;
  --fluid-max-width: 1200;
  /* clamp() formula for fluid typography */
}
```

**Required Action**: Add CSS section to `code_quality_standards.md`

---

<!-- ANCHOR:success-criteria -->
## 4. SUCCESS CRITERIA

### Measurable Outcomes
- **SC-001**: All asset files (`wait_patterns.js`, `validation_patterns.js`) match production patterns
- **SC-002**: New reference files created for undocumented patterns (Observer, Lenis, HLS)
- **SC-003**: CSS conventions documented in `code_quality_standards.md`
- **SC-004**: All P1 and P2 items complete; P3 items documented for future

### Verification Method
- Manual code review comparing skill files vs source files
- Checklist verification per `checklist.md`

<!-- /ANCHOR:success-criteria -->

---

## 5. FILES TO MODIFY

### Priority 1 (Critical)
| File | Action | Lines Est. |
|------|--------|------------|
| `.opencode/skills/workflows-code/assets/wait_patterns.js` | REWRITE | ~200 |
| `.opencode/skills/workflows-code/assets/validation_patterns.js` | UPDATE | ~100 |

### Priority 2 (Important)
| File | Action | Lines Est. |
|------|--------|------------|
| `.opencode/skills/workflows-code/references/observer_patterns.md` | CREATE | ~150 |
| `.opencode/skills/workflows-code/assets/lenis_patterns.js` | CREATE | ~80 |
| `.opencode/skills/workflows-code/references/animation_workflows.md` | UPDATE | ~50 |
| `.opencode/skills/workflows-code/references/code_quality_standards.md` | UPDATE | ~50 |

### Priority 3 (Nice-to-Have)
| File | Action | Lines Est. |
|------|--------|------------|
| `.opencode/skills/workflows-code/assets/hls_patterns.js` | CREATE | ~100 |
| `.opencode/skills/workflows-code/references/third_party_integrations.md` | CREATE | ~150 |
| `.opencode/skills/workflows-code/references/quick_reference.md` | UPDATE | ~30 |

---

<!-- ANCHOR:changelog -->
## 6. CHANGELOG

### v1.0 (2024-12-22)
**Initial specification**
- Completed Sequential Thinking analysis (6 thoughts)
- Identified 5 major alignment gaps
- Documented 9 files requiring updates
- Prioritized as P1 (2 files), P2 (4 files), P3 (3 files)

<!-- /ANCHOR:changelog -->
