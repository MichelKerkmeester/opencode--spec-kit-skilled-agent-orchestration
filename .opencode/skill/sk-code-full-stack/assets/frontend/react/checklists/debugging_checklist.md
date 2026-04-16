---
title: Systematic Debugging Checklist
description: Universal step-by-step checklist for investigating technical issues across all stacks.
---

# 🔍 Debugging Checklist

Universal step-by-step checklist for investigating technical issues systematically across TypeScript/JavaScript, Go, and Swift.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Ensures thorough investigation before attempting fixes. Follow phases in order: Investigation, Pattern Analysis, Hypothesis Testing, Implementation.

### Usage

Use this checklist for ANY technical issue. Complete all applicable phases sequentially before moving to implementation. Skip language-specific sections that don't apply.

### Language Coverage

| Language | Primary Debugging Environment |
|----------|------------------------------|
| TypeScript/JavaScript | Browser DevTools, Node.js debugger |
| Go | Delve debugger, pprof |
| Swift | Xcode Debugger, LLDB, Instruments |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:before-attempting-any-fix -->
## 2. BEFORE ATTEMPTING ANY FIX

- [ ] Opened appropriate debugging environment
- [ ] Read complete error message without skipping
- [ ] Noted file name, line number, error code
- [ ] Read full stack trace
- [ ] Checked logs for related errors

**If you cannot check ALL boxes above, you are not ready to debug.**

---

<!-- /ANCHOR:before-attempting-any-fix -->
<!-- ANCHOR:phase-1-root-cause-investigation -->
## 3. PHASE 1: ROOT CAUSE INVESTIGATION

### Error Analysis (Universal)

- [ ] Read error message carefully - what EXACTLY does it say?
- [ ] Identified error type/category
- [ ] Located source file and line number
- [ ] Read surrounding context (5 lines before/after)
- [ ] Checked for warning messages that preceded error

### Error Analysis (TypeScript/JavaScript)

- [ ] Console tab checked for JavaScript errors
- [ ] Network tab checked for resource failures
- [ ] Elements tab inspected for DOM issues
- [ ] Checked for unhandled promise rejections
- [ ] Verified script loading order

### Error Analysis (Go)

- [ ] Checked stderr output
- [ ] Verified goroutine stack traces
- [ ] Ran with `-race` flag for race conditions
- [ ] Checked for panic vs error returns
- [ ] Verified context cancellation handling

### Error Analysis (Swift)

- [ ] Xcode debug console reviewed
- [ ] Crash logs checked (if applicable)
- [ ] Memory graph debugger examined
- [ ] Thread state verified
- [ ] Checked for force unwrap crashes

### Reproduction

- [ ] Can trigger issue reliably
- [ ] Documented exact steps to reproduce
- [ ] Identified: Always happens OR intermittent
- [ ] Tested in different environments
- [ ] Isolated minimum reproduction case

### Reproduction (Web/Mobile)

- [ ] Tested on current browser/device
- [ ] Tested on different browsers/devices
- [ ] Tested at different viewport sizes
- [ ] Tested with different network conditions

### Recent Changes

- [ ] Checked `git log -5` for recent commits
- [ ] Checked `git diff` for current changes
- [ ] Reviewed new dependencies
- [ ] Checked version changes (package.json, go.mod, Package.swift)
- [ ] Verified deployment/build changes

### Evidence Gathering

- [ ] Added strategic logging at boundaries
- [ ] Logged function entry/exit points
- [ ] Logged state changes and variable values
- [ ] Captured screenshots/recordings if UI
- [ ] Documented what works vs. what's broken

---

<!-- /ANCHOR:phase-1-root-cause-investigation -->
<!-- ANCHOR:phase-2-pattern-analysis -->
## 4. PHASE 2: PATTERN ANALYSIS

### Working Examples

- [ ] Found similar working code in codebase
- [ ] Checked other modules/pages that work correctly
- [ ] Reviewed past implementations in git history
- [ ] Documented what works correctly

### Reference Comparison

- [ ] Read reference implementation completely
- [ ] Checked official documentation
- [ ] Reviewed library/framework docs
- [ ] Understood the pattern fully

### Difference Identification

- [ ] Listed all differences between working and broken
- [ ] Checked configuration differences
- [ ] Compared dependency versions
- [ ] Verified execution order/timing
- [ ] Checked environment differences

### Dependency Understanding

- [ ] Identified required dependencies
- [ ] Verified dependency versions compatible
- [ ] Checked for breaking changes in updates
- [ ] Confirmed initialization order correct

---

<!-- /ANCHOR:phase-2-pattern-analysis -->
<!-- ANCHOR:phase-3-hypothesis-and-testing -->
## 5. PHASE 3: HYPOTHESIS AND TESTING

### Hypothesis Formation

- [ ] Stated hypothesis clearly: "I think X causes Y because Z"
- [ ] Wrote hypothesis down (not just thought it)
- [ ] Made hypothesis specific, not vague
- [ ] Based hypothesis on evidence from Phase 1-2
- [ ] Hypothesis is testable with a single change

### Minimal Testing

- [ ] Made SMALLEST possible change
- [ ] Changed ONE variable at a time
- [ ] Documented what was changed and result
- [ ] Avoided fixing multiple things at once
- [ ] Reverted change if hypothesis disproved

### Verification Criteria (define BEFORE testing)

- [ ] Issue resolved completely?
- [ ] No new errors introduced?
- [ ] Performance not degraded?
- [ ] Works across all target environments?

### When Uncertain

- [ ] Admitted "I don't understand X"
- [ ] Researched more (official docs, Stack Overflow)
- [ ] Checked compatibility/requirements
- [ ] Asked for help if needed after 3 attempts

---

<!-- /ANCHOR:phase-3-hypothesis-and-testing -->
<!-- ANCHOR:phase-4-implementation -->
## 6. PHASE 4: IMPLEMENTATION

### Documentation

- [ ] Added code comments explaining WHY fix needed
- [ ] Noted compatibility considerations
- [ ] Documented any workarounds required
- [ ] Referenced related issues in comments

### Single Fix

- [ ] Addressed root cause (not symptom)
- [ ] Made ONE change at a time
- [ ] No "while I'm here" improvements
- [ ] No bundled refactoring

### Verification

- [ ] Tested in all target environments
- [ ] Tested happy path and error cases
- [ ] Checked logs for errors/warnings
- [ ] Verified performance acceptable
- [ ] Tested user interactions (if applicable)

### Fix Effectiveness

- [ ] If fix worked -> Done
- [ ] If fix didn't work AND < 3 attempts -> Return to Phase 1
- [ ] If >= 3 fixes failed -> STOP and question architecture

---

<!-- /ANCHOR:phase-4-implementation -->
<!-- ANCHOR:root-cause-tracing-checklist -->
## 7. ROOT CAUSE TRACING CHECKLIST

Use when errors occur deep in call stack:

- [ ] Observed symptom (error message, behavior)
- [ ] Found immediate cause (where error appears)
- [ ] Traced one level up (what called this function)
- [ ] Kept tracing up (full execution path)
- [ ] Identified original trigger
- [ ] Fixed at source, not symptom
- [ ] Documented root cause in comments
- [ ] Removed debug logging statements

### Tracing Techniques

**TypeScript/JavaScript:**
- [ ] Browser DevTools debugger (breakpoints)
- [ ] `console.trace()` for call stack
- [ ] `debugger;` statement in code
- [ ] Network waterfall for request order
- [ ] Performance timeline for timing issues

**Go:**
- [ ] Delve debugger with breakpoints
- [ ] `runtime.Stack()` for goroutine traces
- [ ] `pprof` for CPU/memory profiling
- [ ] `-race` flag for data races
- [ ] `go tool trace` for execution traces

**Swift:**
- [ ] Xcode breakpoints (exception, symbolic)
- [ ] `po` and `v` LLDB commands
- [ ] Instruments (Time Profiler, Allocations)
- [ ] View Debugger for UI hierarchy
- [ ] Thread sanitizer for concurrency

---

<!-- /ANCHOR:root-cause-tracing-checklist -->
<!-- ANCHOR:common-error-patterns -->
## 8. COMMON ERROR PATTERNS

### TypeScript/JavaScript

| Error | Likely Cause | Investigation |
|-------|--------------|---------------|
| `undefined is not a function` | Method on null object | Check object initialization |
| `Cannot read property of undefined` | Missing null check | Trace data flow to source |
| `NetworkError` | CORS, server down | Check Network tab, server logs |
| `Unhandled Promise Rejection` | Missing catch/await | Find unhandled async call |
| `Maximum call stack exceeded` | Infinite recursion | Check recursive function exit |
| `Module not found` | Import path wrong | Verify file exists, path casing |

### Go

| Error | Likely Cause | Investigation |
|-------|--------------|---------------|
| `nil pointer dereference` | Missing nil check | Check pointer initialization |
| `index out of range` | Slice bounds wrong | Verify slice length before access |
| `deadlock` | Goroutine waiting forever | Check channel/mutex usage |
| `data race` | Concurrent access | Run with `-race`, add sync |
| `context deadline exceeded` | Timeout too short | Check context timeout values |
| `connection refused` | Service not running | Verify server/port availability |

### Swift

| Error | Likely Cause | Investigation |
|-------|--------------|---------------|
| `unexpectedly found nil` | Force unwrap failed | Use guard/if let instead |
| `EXC_BAD_ACCESS` | Memory corruption | Check memory graph, use zombies |
| `Thread X: signal SIGABRT` | Assertion failed | Check crash log for reason |
| `Unbalanced calls` | Push/pop mismatch | Check navigation stack |
| `Closure captures self strongly` | Retain cycle | Add [weak self] capture |
| `Collection mutated during enumeration` | Concurrent modification | Copy before iterating |

---

<!-- /ANCHOR:common-error-patterns -->
<!-- ANCHOR:stuck-after-3-attempts -->
## 9. STUCK AFTER 3+ ATTEMPTS

### Architecture Questions

- [ ] Is approach fundamentally sound?
- [ ] Am I fighting the framework/platform?
- [ ] Does this need a different architecture?
- [ ] Should this be refactored instead?
- [ ] Is there a simpler alternative?

### Common Blockers

- [ ] Bug only in production (env difference)
- [ ] Platform/framework limitation
- [ ] Cross-platform compatibility impossible
- [ ] Performance requires architecture changes
- [ ] Third-party library bug

### Escalation Checklist

- [ ] Documented all attempts and results
- [ ] Captured full reproduction steps
- [ ] Gathered all relevant logs/errors
- [ ] Listed hypotheses tested and disproved
- [ ] Prepared specific questions for help

---

<!-- /ANCHOR:stuck-after-3-attempts -->
<!-- ANCHOR:final-verification -->
## 10. FINAL VERIFICATION

- [ ] Root cause identified and documented
- [ ] Fix addresses cause, not symptom
- [ ] Tested across all target environments
- [ ] No new errors introduced
- [ ] Performance not degraded
- [ ] Code comments explain WHY fix needed
- [ ] Debug logging removed
- [ ] Single fix resolved issue (not multiple)

---

**Remember:** Find root cause BEFORE fixing. Symptom fixes are failure.

---

<!-- /ANCHOR:final-verification -->
<!-- ANCHOR:related-resources -->
## 11. RELATED RESOURCES

### Companion Checklists

- [code_quality_checklist.md](./code_quality_checklist.md) - Code quality validation
- [verification_checklist.md](./verification_checklist.md) - Testing and verification

### Parent Skill

- [SKILL.md](../../../../SKILL.md) - sk-code-full-stack skill (Phase 2: Debugging)
<!-- /ANCHOR:related-resources -->
