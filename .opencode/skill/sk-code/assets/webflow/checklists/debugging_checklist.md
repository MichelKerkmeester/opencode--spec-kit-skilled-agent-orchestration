---
title: Systematic Debugging Checklist
description: Step-by-step checklist for investigating frontend technical issues
---

# Systematic Debugging Checklist

Step-by-step checklist for investigating frontend technical issues systematically.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Ensures thorough investigation before attempting fixes. Follow phases in order: Investigation → Pattern Analysis → Hypothesis Testing → Implementation.

### Usage

Use this checklist for ANY frontend technical issue. Complete all applicable phases sequentially before moving to implementation.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:before-attempting-any-fix -->
## 2. BEFORE ATTEMPTING ANY FIX

□ Opened browser DevTools (F12 / Cmd+Option+I)
□ Read complete error message without skipping
□ Noted file name, line number, error code
□ Read full stack trace
□ Checked Network tab for failed requests

---

<!-- /ANCHOR:before-attempting-any-fix -->
<!-- ANCHOR:phase-1-root-cause-investigation -->
## 3. PHASE 1: ROOT CAUSE INVESTIGATION

### Error Analysis
□ Read error message carefully
□ Checked Console tab for JavaScript errors
□ Checked Network tab for resource failures
□ Inspected Elements tab for CSS/DOM issues
□ Noted all warning messages

### Reproduction
□ Can trigger reliably
□ Happens on every page load OR specific actions
□ Tested in current browser
□ Tested in different browsers (Chrome, Firefox, Safari)
□ Tested at different viewport sizes (375px, 768px, 1920px)
□ Documented exact steps to reproduce

### Recent Changes
□ Checked `git log -5` for recent commits
□ Checked `git diff` for current changes
□ Reviewed new dependencies
□ Checked CDN version changes
□ Verified Webflow republish status

### Evidence Gathering
□ Added console.log at component boundaries
□ Logged function entry/exit points
□ Logged state changes
□ Captured browser DevTools screenshots
□ Documented what works vs. what's broken

### Data Flow Tracing
□ Used browser debugger (breakpoints)
□ Stepped through code execution
□ Inspected variable values at each step
□ Reviewed call stack panel
□ Traced backward from error to source

---

<!-- /ANCHOR:phase-1-root-cause-investigation -->
<!-- ANCHOR:phase-2-pattern-analysis -->
## 4. PHASE 2: PATTERN ANALYSIS

### Working Examples
□ Found similar working code in codebase
□ Checked other pages that work correctly
□ Reviewed past implementations in git history
□ Documented what works correctly

### Reference Comparison
□ Read reference implementation completely
□ Checked MDN Web Docs for API documentation
□ Reviewed library documentation
□ Understood the pattern fully

### Difference Identification
□ Listed all differences between working and broken
□ Checked HTML structure
□ Compared CSS classes and specificity
□ Verified JavaScript execution order
□ Checked event listeners attached correctly
□ Verified dependencies loaded in same order

### Dependency Understanding
□ Identified required components
□ Checked settings and configuration
□ Verified assumptions are valid
□ Confirmed browser API availability

---

<!-- /ANCHOR:phase-2-pattern-analysis -->
<!-- ANCHOR:phase-3-hypothesis-and-testing -->
## 5. PHASE 3: HYPOTHESIS AND TESTING

### Hypothesis Formation
□ Stated hypothesis clearly: "I think X causes Y because Z"
□ Wrote hypothesis in comment or console
□ Made hypothesis specific, not vague
□ Based hypothesis on evidence, not guessing

### Minimal Testing
□ Made SMALLEST possible change
□ Changed ONE variable at a time
□ Used browser DevTools for live testing
□ Avoided fixing multiple things at once

### Verification
□ Issue resolved in current browser?
□ Issue resolved across all browsers?
□ Issue resolved on mobile viewports?
□ No new console errors introduced?
□ Animation timing still correct?
□ Performance not degraded?

### When Uncertain
□ Admitted "I don't understand X"
□ Researched more (MDN, Stack Overflow)
□ Checked browser compatibility tables
□ Asked for help if needed

---

<!-- /ANCHOR:phase-3-hypothesis-and-testing -->
<!-- ANCHOR:phase-4-implementation -->
## 6. PHASE 4: IMPLEMENTATION

### Documentation
□ Added code comments explaining WHY
□ Noted browser compatibility considerations
□ Documented any workarounds needed
□ Referenced related issues in comments

### Single Fix
□ Addressed root cause (not symptom)
□ Made ONE change at a time
□ No "while I'm here" improvements
□ No bundled refactoring

### Verification
□ Tested in all target browsers
□ Tested on all viewport sizes (375px, 768px, 1920px)
□ Checked console for errors
□ Verified animations smooth
□ Tested user interactions
□ Confirmed performance acceptable

### Fix Effectiveness
□ If fix worked → Done
□ If fix didn't work AND < 3 attempts → Return to Phase 1
□ If ≥ 3 fixes failed → STOP and question architecture

---

<!-- /ANCHOR:phase-4-implementation -->
<!-- ANCHOR:root-cause-tracing-checklist -->
## 7. ROOT CAUSE TRACING CHECKLIST

Use when errors occur deep in call stack:

□ Observed symptom (error message, behavior)
□ Found immediate cause (where error appears)
□ Traced one level up (what called this function)
□ Kept tracing up (full execution path)
□ Identified original trigger
□ Fixed at source, not symptom
□ Documented root cause in comments
□ Removed debug console.log statements

### Tracing Techniques Used
□ Browser DevTools debugger
□ console.trace() for call stack
□ Console logging at boundaries
□ getEventListeners() for event inspection
□ MutationObserver for DOM changes

---

<!-- /ANCHOR:root-cause-tracing-checklist -->
<!-- ANCHOR:final-verification -->
## 8. FINAL VERIFICATION

□ Root cause identified and documented
□ Fix addresses cause, not symptom
□ Tested across all target browsers
□ Tested on mobile and desktop viewports
□ No console errors introduced
□ Performance not degraded
□ Code comments explain WHY fix needed
□ Browser-specific workarounds documented
□ Single fix resolved issue (not multiple attempts)

---

<!-- /ANCHOR:final-verification -->
<!-- ANCHOR:if-still-stuck -->
## 9. IF STILL STUCK

**After 3 failed fixes:**
□ Questioned if approach is fundamentally sound
□ Considered if fighting browser defaults
□ Evaluated whether refactoring needed
□ Discussed with project lead

**Common blockers:**
□ Bug only in production
□ Webflow-generated code issue
□ Cross-browser compatibility impossible
□ Performance requires architecture changes
□ Third-party library problem

---

**Remember:** Find root cause BEFORE fixing. Symptom fixes are failure.

---

<!-- /ANCHOR:if-still-stuck -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

- [debugging_workflows.md](../../references/debugging/debugging_workflows.md) - Full debugging guide
- See `mcp-chrome-devtools` skill for DevTools reference
<!-- /ANCHOR:related-resources -->
