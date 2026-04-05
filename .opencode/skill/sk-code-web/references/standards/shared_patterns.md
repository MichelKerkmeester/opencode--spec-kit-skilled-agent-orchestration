---
title: Shared Patterns - Cross-Workflow Standards
description: Common patterns for DevTools usage, logging, testing, error handling, and browser compatibility.
---

# Shared Patterns - Cross-Workflow Standards

Common patterns for DevTools usage, logging, testing, error handling, and browser compatibility.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Cross-workflow standards and reusable patterns for DevTools, console logging, manual testing, and browser compatibility.

### When to Use
- Implementing common UI/UX patterns
- Setting up logging and error handling
- Ensuring cross-browser compatibility

<!-- /ANCHOR:overview -->
<!-- ANCHOR:devtools-quick-reference -->
## 2. DEVTOOLS QUICK REFERENCE

### Opening DevTools

| Browser | Shortcut | Menu Path |
|---------|----------|-----------|
| Chrome/Edge | F12 or Cmd+Option+I | More Tools → Developer Tools |

### Essential Panels

**Console**
- View error messages and warnings
- Execute JavaScript commands
- View logged output from code
- Monitor network errors

**Elements/Inspector**
- Inspect DOM structure
- View computed CSS styles
- Edit HTML/CSS live
- Check element dimensions and positioning

**Sources/Debugger**
- Set breakpoints
- Step through code execution
- Watch variables
- View call stack

**Network**
- Monitor all resource requests
- Check for failed loads (404, 500, etc.)
- Inspect request/response headers
- Analyze load timing

**Performance**
- Record page performance
- Identify frame rate issues
- Find expensive operations
- Analyze rendering bottlenecks

### Common DevTools Commands

```javascript
// Check element exists
document.querySelector('[selector]');

// View all event listeners on element
getEventListeners(element);

// Inspect object structure
console.dir(object);

// Print call stack
console.trace();

// Measure performance
console.time('operation');
// ... code ...
console.timeEnd('operation');

// Group related logs
console.group('GroupName');
console.log('item 1');
console.log('item 2');
console.groupEnd();
```

### Keyboard Shortcuts

| Action | Chrome Shortcut |
|--------|----------------|
| Open DevTools | F12 / Cmd+Option+I |
| Inspect element | Cmd+Shift+C |
| Console | Cmd+Option+J |
| Hard refresh | Cmd+Shift+R |
| Toggle device toolbar | Cmd+Shift+M |

---

<!-- /ANCHOR:devtools-quick-reference -->
<!-- ANCHOR:logging-standards -->
## 3. LOGGING STANDARDS

### Consistent Log Format

Use consistent prefixes to identify component sources:

```javascript
// Component initialization
console.log('[ComponentName] Initializing...', {
  timestamp: Date.now(),
  config: config
});

// Success operations
console.log('[ComponentName] Operation successful', result);

// Warnings
console.warn('[ComponentName] Potential issue detected', details);

// Errors
console.error('[ComponentName] Operation failed:', error);

// Debug-only logs
if (DEBUG) {
  console.log('[ComponentName] Debug info:', debugData);
}
```

### Log Levels

```javascript
// INFO: Normal operation
console.log('[VideoPlayer] Playing video');

// WARN: Recoverable issues
console.warn('[VideoPlayer] Quality downgraded due to network');

// ERROR: Failures
console.error('[VideoPlayer] Failed to load video source');

// DEBUG: Development only
if (process.env.NODE_ENV === 'development') {
  console.debug('[VideoPlayer] Current state:', state);
}
```

### Structured Logging

```javascript
// Good: Object with context
console.log('[VideoPlayer] State change', {
  from: 'loading',
  to: 'playing',
  timestamp: Date.now(),
  duration: video.duration
});

// Bad: Concatenated string
console.log('[VideoPlayer] State changed from loading to playing');
```

### Log Grouping

```javascript
console.group('[VideoPlayer] Initialization');
console.log('Config:', config);
console.log('Element:', videoElement);
console.log('HLS supported:', Hls.isSupported());
console.groupEnd();
```

---

<!-- /ANCHOR:logging-standards -->
<!-- ANCHOR:testing-requirements -->
## 4. TESTING REQUIREMENTS

### Manual Testing Checklist

```markdown
BROWSER TESTING:
□ Chrome (automated: MCP or mcp-chrome-devtools, manual: DevTools)

VIEWPORT TESTING:
□ Mobile (375px)
□ Tablet (991px)
□ Desktop (1920px)
□ Breakpoint transitions

FUNCTIONALITY:
□ Click all interactive elements
□ Submit all forms
□ Watch all animations complete
□ Test all navigation paths

CONSOLE:
□ No errors in any browser
□ No warnings (or documented)
□ Network tab clean

PERFORMANCE:
□ Animations smooth (60fps)
□ Page loads quickly (< 3s)
□ No janky scrolling
```

### Device Emulation Settings

**Chrome DevTools Device Toolbar (Cmd+Shift+M):**
- iPhone SE (375x667) - Small mobile
- iPhone 12 Pro (390x844) - Modern mobile
- iPad (991x1024) - Tablet (Webflow breakpoint)
- Responsive - Custom dimensions

**Network Throttling:**
- Fast 3G - Typical mobile
- Slow 3G - Poor connection
- Offline - Test error states

**CPU Throttling:**
- 4x slowdown - Low-end mobile
- 6x slowdown - Very slow device

---

<!-- /ANCHOR:testing-requirements -->
<!-- ANCHOR:automation-patterns -->
## 5. AUTOMATION PATTERNS

### Chrome DevTools MCP Automation

**Automated testing using MCP tools for faster, repeatable verification:**

### Pattern 1: Console Error Validation

**Automated workflow to check for console errors:**

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. List console messages:
   [Use tool: mcp__chrome_devtools_2__list_console_messages]

3. Filter for errors in response:
   - Check if any message has type === "error"
   - Report errors with file, line number, message

Expected result: No errors found
```

### Pattern 2: Multi-Viewport Screenshot Capture

**Automated workflow to capture all breakpoints:**

```markdown
1. Navigate once:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Mobile (375px):
   [Use tool: mcp__chrome_devtools_2__resize_page]
   - width: 375, height: 667
   [Use tool: mcp__chrome_devtools_2__take_screenshot]

3. Tablet (991px):
   [Use tool: mcp__chrome_devtools_2__resize_page]
   - width: 991, height: 1024
   [Use tool: mcp__chrome_devtools_2__take_screenshot]

4. Desktop (1920px):
   [Use tool: mcp__chrome_devtools_2__resize_page]
   - width: 1920, height: 1080
   [Use tool: mcp__chrome_devtools_2__take_screenshot]

Result: Three screenshots at exact dimensions for visual review
```

### Pattern 3: Performance Measurement

**Automated workflow to measure Core Web Vitals:**

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Start performance trace:
   [Use tool: mcp__chrome_devtools_2__performance_start_trace]

3. Stop performance trace:
   [Use tool: mcp__chrome_devtools_2__performance_stop_trace]

4. Analyze results:
   - LCP (Largest Contentful Paint): Target <2500ms
   - FID (First Input Delay): Target <100ms
   - CLS (Cumulative Layout Shift): Target <0.1

Result: Objective performance metrics
```

### Pattern 4: Network Request Validation

**Automated workflow to check for failed requests:**

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. List network requests:
   [Use tool: mcp__chrome_devtools_2__list_network_requests]

3. Filter for failures:
   - Check if any request has status >= 400
   - Check if any request has status === 0 (blocked)
   - Report failed requests with URL + status

Expected result: No failed requests
```

### Pattern 5: Complete Automated Verification

**Full verification workflow combining all patterns:**

```markdown
1. Navigate once:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Check console errors:
   [Use tool: mcp__chrome_devtools_2__list_console_messages]
   - Filter for type === "error"
   - Report: ✅ Pass or ❌ Fail with details

3. Check network failures:
   [Use tool: mcp__chrome_devtools_2__list_network_requests]
   - Filter for status >= 400 or status === 0
   - Report: ✅ Pass or ❌ Fail with details

4. Measure performance:
   [Use tool: mcp__chrome_devtools_2__performance_start_trace]
   [Use tool: mcp__chrome_devtools_2__performance_stop_trace]
   - Check LCP, FID, CLS against targets
   - Report: ✅ Pass or ⚠️ Warning with metrics

5. Capture all viewports:
   [Resize + Screenshot for 375px, 991px, 1920px]
   - Save screenshots for manual review

Final report:
- Console: ✅/❌
- Network: ✅/❌
- Performance: ✅/⚠️ (with metrics)
- Screenshots: Ready for review
```

### Multi-Agent Concurrency

**Multiple agents can test simultaneously:**

```markdown
Agent 1: Use mcp__chrome_devtools_1__* tools
Agent 2: Use mcp__chrome_devtools_2__* tools

Both can navigate, test, and screenshot without conflicts.
```

### CLI Alternatives (browser-debugger-cli)

**For terminal-first workflows, mcp-chrome-devtools skill provides equivalent patterns via bdg tool:**

- Console errors: `bdg console logs | jq '.[] | select(.level=="error")'`
- Screenshots: `bdg screenshot output.png --width 375 --height 667`
- Performance: `bdg performance trace` (Core Web Vitals)
- Network: `bdg har export network.har`

**See**: .opencode/skill/mcp-chrome-devtools/SKILL.md for complete CLI automation workflows

### When to Use Automated vs. Manual

**Use Automated (MCP Tools) for:**
- Console error checking (faster, structured data)
- Multi-viewport screenshots (consistent dimensions)
- Performance measurement (objective metrics)
- Network request validation (easy filtering)
- Regression testing (repeatable)

**Use Manual (Browser DevTools) for:**
- Visual quality assessment (colors, spacing, polish)
- Animation smoothness perception ("feel" of 60fps)
- Interactive responsiveness (click/hover tactile feedback)
- Accessibility testing (screen readers)
- Real device testing (not emulation)
- Browser-specific debugging beyond Chrome

---

<!-- /ANCHOR:automation-patterns -->
<!-- ANCHOR:error-patterns -->
## 6. ERROR PATTERNS

### Common Frontend Errors

**1. Element Not Found**
```javascript
// Error: Cannot read property 'X' of null
// Cause: querySelector returned null

// Solution: Wait for element or validate
const element = await waitForElement('[selector]');
if (!element) {
  console.error('[Component] Element not found');
  return;
}
```

**2. Library Not Loaded**
```javascript
// Error: Hls is not defined
// Cause: Script not loaded or wrong load order

// Solution: Wait for library
const Hls = await waitForLibrary('Hls');
if (!Hls.isSupported()) {
  console.warn('[Video] HLS not supported');
  useFallback();
}
```

**3. Race Condition**
```javascript
// Error: Intermittent failures
// Cause: Code runs before dependencies ready

// Solution: Use condition-based waiting
await Promise.all([
  domReady(),
  waitForLibrary('Hls'),
  waitForElement('[video]')
]);
// Now safe to initialize
```

**4. XSS Vulnerability**
```javascript
// Risk: element.innerHTML = userInput
// Cause: Unsanitized user data

// Solution: Use textContent or sanitize
element.textContent = userInput; // Safe
// OR
element.innerHTML = sanitizeHTML(userInput); // Sanitized
```

**5. Memory Leak**
```javascript
// Cause: Event listeners not removed

// Solution: Clean up in destroy
class Component {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
    element.addEventListener('click', this.handleClick);
  }

  destroy() {
    element.removeEventListener('click', this.handleClick);
  }
}
```

### Error Handling Pattern

```javascript
async function robustOperation() {
  try {
    // Layer 1: Validate inputs
    if (!isValid(input)) {
      throw new Error('Invalid input');
    }

    // Layer 2: Perform operation
    const result = await operation();

    // Layer 3: Validate output
    if (!result || !result.data) {
      throw new Error('Invalid result');
    }

    return result;

  } catch (error) {
    // Layer 4: Handle error
    console.error('[Component] Operation failed:', error);

    // Layer 5: Provide fallback
    return getDefaultValue();
  }
}
```

---

<!-- /ANCHOR:error-patterns -->
<!-- ANCHOR:browser-compatibility -->
## 7. BROWSER COMPATIBILITY

### Feature Detection

```javascript
// Check browser support before using
if ('IntersectionObserver' in window) {
  // Use Intersection Observer
} else {
  // Fallback approach
}

// Check CSS support
if (CSS.supports('display', 'grid')) {
  // Use CSS Grid
} else {
  // Use flexbox fallback
}
```

### Polyfill Loading

```javascript
// Load polyfills only when needed
if (!window.Promise) {
  await loadScript('/polyfills/promise.js');
}

if (!Element.prototype.closest) {
  await loadScript('/polyfills/closest.js');
}
```

### Browser-Specific Workarounds

```javascript
// Chrome autoplay restrictions
video.muted = true; // Chrome requires muted autoplay for programmatic playback
video.playsInline = true; // Required for mobile devices

// Force reflow before animation if needed
element.offsetHeight;
element.classList.add('animate');
```

### Cross-Browser Testing Tools

- **BrowserStack**: Real device testing
- **LambdaTest**: Cross-browser testing
- **Can I Use**: Feature compatibility tables
- **MDN Web Docs**: Browser support tables

---

<!-- /ANCHOR:browser-compatibility -->
<!-- ANCHOR:quick-command-reference -->
## 8. QUICK COMMAND REFERENCE

### DevTools Console Commands

```javascript
// Find all elements matching selector
$$('[data-*]');

// Get computed style
getComputedStyle(element);

// Monitor all events on element
monitorEvents(element);
monitorEvents(element, 'click'); // Specific event

// Stop monitoring
unmonitorEvents(element);

// Copy to clipboard
copy(object);

// Clear console
clear();
```

### Performance Monitoring

```javascript
// Mark timing points
performance.mark('start');
// ... operation ...
performance.mark('end');

// Measure duration
performance.measure('operation', 'start', 'end');

// Get all measures
performance.getEntriesByType('measure');
```

### Network Debugging

```javascript
// Check if online
if (navigator.onLine) {
  // Network available
}

// Listen for online/offline
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);
```

---

<!-- /ANCHOR:quick-command-reference -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](../implementation/implementation_workflows.md) - Apply patterns during implementation
- [debugging_workflows.md](../debugging/debugging_workflows.md) - Use DevTools and logging during debugging
- [verification_workflows.md](../verification/verification_workflows.md) - Use browser testing patterns for verification
### Related Skills
- `mcp-chrome-devtools` - Chrome DevTools reference and CLI-based browser automation via browser-debugger-cli (bdg)

### External Resources
- [MDN Web Docs](https://developer.mozilla.org) - JavaScript, CSS, and browser API documentation
- [Can I Use](https://caniuse.com) - Browser compatibility tables
- [Chrome DevTools Docs](https://developer.chrome.com/docs/devtools/) - Official DevTools documentation
<!-- /ANCHOR:related-resources -->