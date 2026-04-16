---
title: Swift/iOS Verification Checklist
description: Checklist for verifying Swift and iOS/macOS work before claiming completion.
---

# ✓ Swift/iOS Verification Checklist

Checklist for verifying Swift and iOS/macOS work before claiming completion.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

**The Iron Law**: Evidence before claims, always. This checklist ensures all completion claims are backed by actual testing evidence.

### Usage

Use this checklist BEFORE claiming any work is complete, fixed, or working. Complete all applicable sections for your stack before making completion claims.

### Language Coverage

| Language | Primary Testing Environment |
|----------|---------------------------|
| Swift | XCTest, Xcode, Simulator/Device |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:before-claiming-anything -->
## 2. BEFORE CLAIMING ANYTHING

- [ ] **I have actually run the code** (not just reviewed it)
- [ ] **I have tested the actual functionality** (not assumed it works)
- [ ] **I have seen it work** (not trusted code review alone)
- [ ] **I can describe exactly what I observed** (have specific evidence)

**If you cannot check ALL four boxes above, your claim is premature.**

---

<!-- /ANCHOR:before-claiming-anything -->
<!-- ANCHOR:universal-test-execution -->
## 3. UNIVERSAL: TEST EXECUTION

### Automated Tests

- [ ] All existing tests pass (`npm test`, `go test`, `swift test`)
- [ ] No tests were skipped or disabled
- [ ] Test coverage maintained or improved
- [ ] New functionality has corresponding tests
- [ ] Edge cases have test coverage

### Manual Testing

- [ ] Happy path tested manually
- [ ] Error cases tested manually
- [ ] Edge cases tested manually
- [ ] Tested with realistic data
- [ ] Tested with invalid/malformed input

### Build Verification

- [ ] Code compiles without errors
- [ ] No new compiler warnings
- [ ] Linting passes
- [ ] Type checking passes (if applicable)
- [ ] Production build succeeds

---

<!-- /ANCHOR:universal-test-execution -->
<!-- ANCHOR:typescript-javascript-browser-testing -->
## 4. TYPESCRIPT/JAVASCRIPT: BROWSER TESTING

### Minimum Requirements (ALWAYS REQUIRED)

- [ ] Chrome Desktop (1920px) - Primary browser
- [ ] Mobile emulation (375px) - via DevTools
- [ ] DevTools Console open and checked

### Standard Testing (Production Work)

- [ ] Chrome Desktop (1920px)
- [ ] Firefox Desktop (1920px)
- [ ] Safari Desktop (1920px) - if macOS available
- [ ] Mobile Chrome (375px) - via DevTools emulation
- [ ] Mobile Safari (375px) - via DevTools emulation
- [ ] Tablet viewport (768px)

### Critical Fixes (High-Stakes Changes)

- [ ] All standard testing above
- [ ] Real mobile device (not just emulation)
- [ ] Slow network simulation (Slow 3G)
- [ ] Different viewport transition points
- [ ] Edge cases (ad blockers, cache disabled)

---

<!-- /ANCHOR:typescript-javascript-browser-testing -->
<!-- ANCHOR:typescript-javascript-viewport-testing -->
## 5. TYPESCRIPT/JAVASCRIPT: VIEWPORT TESTING

- [ ] Mobile viewport (375px minimum)
  - Interactions work at this size
  - Scrolling smooth
  - No horizontal overflow
  - Touch targets large enough

- [ ] Tablet viewport (768px)
  - Layout adapts correctly
  - Navigation usable
  - Content readable

- [ ] Desktop viewport (1920px)
  - Full layout displays correctly
  - All features accessible
  - Performance acceptable

- [ ] Breakpoint transitions (resize slowly)
  - 320px -> 768px smooth
  - 768px -> 1024px smooth
  - 1024px -> 1920px smooth
  - No awkward intermediate states

---

<!-- /ANCHOR:typescript-javascript-viewport-testing -->
<!-- ANCHOR:typescript-javascript-console-network -->
## 6. TYPESCRIPT/JAVASCRIPT: CONSOLE & NETWORK

### DevTools Console

- [ ] Console open during all testing
- [ ] **No red errors** (blocking failures)
- [ ] **No yellow warnings** (or documented why acceptable)
- [ ] No unhandled promise rejections
- [ ] Expected console output appears

### Network Tab

- [ ] All requests succeed (200, 304 status)
- [ ] No 404 errors (missing resources)
- [ ] No 500 errors (server failures)
- [ ] No CORS errors
- [ ] Timing acceptable
- [ ] Payload sizes reasonable

---

<!-- /ANCHOR:typescript-javascript-console-network -->
<!-- ANCHOR:go-test-verification -->
## 7. GO: TEST VERIFICATION

### Test Suite

- [ ] `go test ./...` passes
- [ ] `go test -race ./...` passes (no race conditions)
- [ ] `go test -cover` shows adequate coverage
- [ ] Benchmark tests pass: `go test -bench=.`
- [ ] Integration tests pass (if applicable)

### Build Verification

- [ ] `go build` succeeds
- [ ] `go vet` passes (no issues)
- [ ] Linting passes (`golangci-lint run`)
- [ ] No new compiler warnings
- [ ] Cross-compilation works (if required)

### Runtime Verification

- [ ] Application starts without errors
- [ ] Graceful shutdown works
- [ ] Logging output correct
- [ ] Configuration loading works
- [ ] Health checks pass

### Concurrent Operations

- [ ] Tested with multiple goroutines
- [ ] No deadlocks observed
- [ ] Context cancellation propagates
- [ ] Resources cleaned up properly

---

<!-- /ANCHOR:go-test-verification -->
<!-- ANCHOR:swift-test-verification -->
## 8. SWIFT: TEST VERIFICATION

### Test Suite (XCTest)

- [ ] `swift test` / Cmd+U passes all tests
- [ ] Unit tests pass
- [ ] UI tests pass (if applicable)
- [ ] No test warnings or deprecations
- [ ] Code coverage adequate

### Build Verification

- [ ] Project builds without errors (Cmd+B)
- [ ] No compiler warnings
- [ ] SwiftLint passes (if configured)
- [ ] Archive build succeeds (for release)

### Device/Simulator Testing

- [ ] iPhone Simulator (latest iOS)
- [ ] iPad Simulator (if universal app)
- [ ] Real device testing (recommended)
- [ ] Different iOS versions (if supporting older)

### Platform-Specific

**iOS:**
- [ ] All supported device sizes work
- [ ] Dark mode tested
- [ ] Dynamic Type tested
- [ ] Accessibility tested (VoiceOver)
- [ ] Rotation handled correctly

**macOS:**
- [ ] Window resizing works
- [ ] Menu bar items functional
- [ ] Keyboard shortcuts work

---

<!-- /ANCHOR:swift-test-verification -->
<!-- ANCHOR:functionality-testing-all-platforms -->
## 9. FUNCTIONALITY TESTING (ALL PLATFORMS)

### Interactive Elements

- [ ] Primary user action works
- [ ] Secondary actions work
- [ ] Error states display correctly
- [ ] Loading states show properly
- [ ] Success feedback appears

### Forms (if applicable)

- [ ] All fields accept input
- [ ] Validation triggers correctly
- [ ] Error messages helpful
- [ ] Success flow completes
- [ ] Form submission succeeds

### Data Operations

- [ ] Create operation works
- [ ] Read operation works
- [ ] Update operation works
- [ ] Delete operation works
- [ ] Concurrent operations handled

### State Management

- [ ] Initial state correct
- [ ] State transitions work
- [ ] State persists correctly (if applicable)
- [ ] Reset/clear works
- [ ] No orphaned state

---

<!-- /ANCHOR:functionality-testing-all-platforms -->
<!-- ANCHOR:performance-targets -->
## 10. PERFORMANCE TARGETS

### Web (TypeScript/JavaScript)

| Metric | Target | Critical |
|--------|--------|----------|
| First Contentful Paint | < 1.8s | < 3.0s |
| Largest Contentful Paint | < 2.5s | < 4.0s |
| Time to Interactive | < 3.8s | < 7.3s |
| Total Blocking Time | < 200ms | < 600ms |
| Cumulative Layout Shift | < 0.1 | < 0.25 |
| Animation FPS | 60fps | 30fps min |

### Backend (Go)

| Metric | Target | Critical |
|--------|--------|----------|
| API Response (p50) | < 50ms | < 200ms |
| API Response (p99) | < 200ms | < 1s |
| Memory per request | < 10MB | < 50MB |
| Startup time | < 1s | < 5s |
| Graceful shutdown | < 30s | < 60s |

### Mobile (Swift)

| Metric | Target | Critical |
|--------|--------|----------|
| App launch (cold) | < 1s | < 2s |
| App launch (warm) | < 0.5s | < 1s |
| Screen transition | < 0.3s | < 0.5s |
| Animation FPS | 60fps | 30fps min |
| Memory footprint | < 100MB | < 200MB |
| Battery impact | Minimal | Acceptable |

---

<!-- /ANCHOR:performance-targets -->
<!-- ANCHOR:documentation -->
## 11. DOCUMENTATION

### Evidence Recorded

- [ ] Noted which environments tested
- [ ] Listed test commands run
- [ ] Described what was observed
- [ ] Documented specific behavior seen
- [ ] Captured performance metrics

### Claim Format

- [ ] Stated what was tested explicitly
- [ ] Included test results summary
- [ ] Noted any limitations
- [ ] Specified testing environment

### Example Claim Format

**Good Claim:**
```
Tested on Chrome/Firefox at 1920px and 375px. All automated tests
pass (42/42). Manual testing confirms login flow works. DevTools
console clear, no errors. Performance within targets (LCP 1.2s).
```

**Bad Claim:**
```
Code looks correct
Should work now
Tested and it's fine
```

---

<!-- /ANCHOR:documentation -->
<!-- ANCHOR:red-flags-to-avoid -->
## 12. RED FLAGS TO AVOID

**Did NOT think:**

- [ ] "Code looks correct, should work"
- [ ] "Tests pass, must be fine"
- [ ] "Quick test later"
- [ ] "One environment is enough"
- [ ] "That warning isn't important"
- [ ] "Can verify after deploy"
- [ ] "Looks good to me" (without testing)

**If you thought ANY of these -> STOP and test properly.**

---

<!-- /ANCHOR:red-flags-to-avoid -->
<!-- ANCHOR:final-verification -->
## 13. FINAL VERIFICATION

### Can You Answer These?

- [ ] What exactly did you observe when testing?
- [ ] Which environments did you test?
- [ ] What test commands did you run and what were results?
- [ ] Were there any errors or warnings?
- [ ] Did you test the actual user workflow?
- [ ] Did you test from start to finish?

**If you cannot answer ALL questions -> Test more thoroughly.**

---

<!-- /ANCHOR:final-verification -->
<!-- ANCHOR:claiming-format-by-stack -->
## 14. CLAIMING FORMAT BY STACK

### TypeScript/JavaScript Web

```
VERIFICATION COMPLETE:
- Browsers: Chrome, Firefox (1920px, 768px, 375px)
- Tests: npm test (XX passed, 0 failed)
- Console: Clear, no errors
- Network: All requests 200, no failures
- Performance: LCP X.Xs, FPS 60
```

### Go Backend

```
VERIFICATION COMPLETE:
- Tests: go test ./... (XX passed)
- Race: go test -race (no races)
- Lint: golangci-lint (0 issues)
- Manual: API endpoints verified via curl
- Performance: p50 XXms, p99 XXms
```

### Swift iOS

```
VERIFICATION COMPLETE:
- Tests: Cmd+U (XX passed, 0 failed)
- Devices: iPhone 15 Pro sim, iPad sim
- Build: Release archive successful
- Manual: Full user flow tested
- Performance: Launch < 1s, 60fps animations
```

---

<!-- /ANCHOR:claiming-format-by-stack -->
<!-- ANCHOR:special-cases -->
## 15. SPECIAL CASES

### Can't Run Full Test Suite

- [ ] Documented which tests couldn't run
- [ ] Ran available subset
- [ ] Stated limitation clearly
- [ ] **Did NOT claim full verification**

### Works Locally But Not CI/Production

- [ ] Compared environment differences
- [ ] Checked dependency versions
- [ ] Verified build configuration
- [ ] Checked environment variables
- [ ] Reviewed deployment logs

### Inconsistent Test Results

- [ ] Identified flaky tests
- [ ] Ran multiple times to confirm
- [ ] Checked for timing dependencies
- [ ] Looked for shared state issues
- [ ] Documented inconsistency

---

**Remember:** If you haven't tested it THIS SESSION, you cannot claim it works.

---

<!-- /ANCHOR:special-cases -->
<!-- ANCHOR:related-resources -->
## 16. RELATED RESOURCES

### Companion Checklists

- [code_quality_checklist.md](./code_quality_checklist.md) - Code quality validation
- [debugging_checklist.md](./debugging_checklist.md) - Systematic debugging

### Parent Skill

- [SKILL.md](../../../../SKILL.md) - sk-code-full-stack skill (Phase 3: Verification)
<!-- /ANCHOR:related-resources -->
