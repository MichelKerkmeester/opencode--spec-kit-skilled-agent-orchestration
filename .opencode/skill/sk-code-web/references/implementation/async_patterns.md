---
title: Async Patterns
description: Browser scheduling APIs and patterns for non-blocking code execution.
---

# Async Patterns

Browser scheduling APIs and patterns for non-blocking code execution.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Modern browsers provide APIs for scheduling work efficiently without blocking the main thread. This guide covers `requestIdleCallback`, `requestAnimationFrame`, `queueMicrotask`, `scheduler.postTask`, and related patterns for optimizing JavaScript execution timing.

### Key APIs

- **requestAnimationFrame** - Schedule work before next repaint (~16ms at 60fps)
- **requestIdleCallback** - Schedule work during browser idle periods
- **queueMicrotask** - Execute immediately after current task, before repaint
- **scheduler.postTask** - Priority-based task scheduling (Chrome 94+)
- **setTimeout** - Fallback for unsupported browsers

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:requestanimationframe-pattern -->
## 2. REQUESTANIMATIONFRAME PATTERN

### Overview

`requestAnimationFrame` schedules work to run before the next browser repaint, ideal for visual updates and animations. Runs at ~60fps (16.67ms intervals) when the tab is active.

### Basic RAF Loop with Cleanup

```javascript
// RAF loop with cleanup
function create_raf_loop(callback) {
    let raf_id = null;
    let is_running = false;

    function loop(timestamp) {
        if (!is_running) return;
        callback(timestamp);
        raf_id = requestAnimationFrame(loop);
    }

    return {
        start() {
            if (is_running) return;
            is_running = true;
            raf_id = requestAnimationFrame(loop);
        },
        stop() {
            is_running = false;
            if (raf_id) cancelAnimationFrame(raf_id);
        }
    };
}

// Usage
const animation = create_raf_loop(function(timestamp) {
    update_position(timestamp);
});
animation.start();
// Later: animation.stop();
```

### Throttling with RAF

Use RAF to throttle high-frequency events like pointer/scroll:

```javascript
// RAF-based throttle for pointer events
function create_raf_throttle(callback) {
    let is_scheduled = false;
    let last_args = null;

    return function(...args) {
        last_args = args;
        if (is_scheduled) return;

        is_scheduled = true;
        requestAnimationFrame(function() {
            is_scheduled = false;
            callback.apply(null, last_args);
        });
    };
}

// Usage for scroll handling
const handle_scroll = create_raf_throttle(function(event) {
    update_scroll_position(window.scrollY);
});
window.addEventListener('scroll', handle_scroll, { passive: true });
```

### Background Tab Behavior

- Active tab: ~60fps (16.67ms)
- Background tab: Throttled to ~1fps (1000ms)
- This is browser optimization, not controllable via code
- Design animations to handle variable frame timing

```javascript
// Handle variable frame timing
let last_timestamp = 0;

function animate(timestamp) {
    const delta = timestamp - last_timestamp;
    last_timestamp = timestamp;

    // Use delta for time-based animation (handles throttling)
    position += velocity * (delta / 1000);

    requestAnimationFrame(animate);
}
```

---

<!-- /ANCHOR:requestanimationframe-pattern -->
<!-- ANCHOR:requestidlecallback-pattern -->
## 3. REQUESTIDLECALLBACK PATTERN

### Overview

`requestIdleCallback` schedules work during browser idle periods, preventing main thread blocking.

### Basic Usage

```javascript
if ('requestIdleCallback' in window) {
    requestIdleCallback(function() {
        // Non-critical work here
    });
}
```

### With Timeout

```javascript
requestIdleCallback(my_function, { timeout: 3000 });
```

The `timeout` option ensures the callback runs within the specified time even if the browser is never idle.

### Safari Fallback Pattern

Safari doesn't support `requestIdleCallback`. Always provide a fallback:

```javascript
if ('requestIdleCallback' in window) {
    requestIdleCallback(load_non_critical, { timeout: 3000 });
} else {
    setTimeout(load_non_critical, 2000);
}
```

### Chunked Work with Deadline

```javascript
function process_in_chunks(items, process_item, on_complete) {
    let index = 0;

    function process_chunk(deadline) {
        // Process while we have time remaining (> 1ms)
        while (index < items.length && deadline.timeRemaining() > 1) {
            process_item(items[index]);
            index++;
        }

        if (index < items.length) {
            // More work to do, schedule next chunk
            requestIdleCallback(process_chunk, { timeout: 5000 });
        } else {
            on_complete();
        }
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(process_chunk, { timeout: 5000 });
    } else {
        // Fallback: process all at once after delay
        setTimeout(function() {
            items.forEach(process_item);
            on_complete();
        }, 100);
    }
}
```

---

<!-- /ANCHOR:requestidlecallback-pattern -->
<!-- ANCHOR:queuemicrotask-pattern -->
## 4. QUEUEMICROTASK PATTERN

### Overview

`queueMicrotask` schedules a function to run immediately after the current synchronous code completes, but before any setTimeout callbacks or the next event loop tick.

### Basic Usage

```javascript
// Immediate post-current-task execution
// Runs before any setTimeout, even setTimeout(fn, 0)
queueMicrotask(function() {
    // Runs after current synchronous code
    // But before next event loop tick
});
```

### Batching DOM Updates

```javascript
// Use case: Ensure DOM updates are batched
function batch_dom_updates(updates) {
    queueMicrotask(function() {
        updates.forEach(function(update) {
            update();
        });
    });
}

// Usage
const pending_updates = [];
pending_updates.push(function() { element.textContent = 'Updated'; });
pending_updates.push(function() { element.classList.add('active'); });
batch_dom_updates(pending_updates);
```

### When to Use queueMicrotask

- Batching multiple synchronous updates
- Deferring work until after current stack clears
- Ensuring consistent ordering of async operations
- Avoiding setTimeout(fn, 0) overhead

### Caution: Microtask Starvation

```javascript
// WARNING: Don't create infinite microtask loops
// This WILL freeze the browser
function bad_pattern() {
    queueMicrotask(bad_pattern); // Never do this!
}

// Instead, use requestAnimationFrame or setTimeout for recurring work
```

---

<!-- /ANCHOR:queuemicrotask-pattern -->
<!-- ANCHOR:scheduler-posttask-pattern -->
## 5. SCHEDULER.POSTTASK PATTERN

### Overview

`scheduler.postTask` provides priority-based task scheduling (Chrome 94+, Edge 94+). Not yet supported in Firefox or Safari.

### Basic Usage

```javascript
// Modern priority-based scheduling (Chrome 94+)
if ('scheduler' in window) {
    // Priority levels: 'user-blocking', 'user-visible', 'background'
    scheduler.postTask(function() {
        // Low priority background work
    }, { priority: 'background' });
}
```

### Priority Levels

| Priority | Use Case | Timing |
|----------|----------|--------|
| `user-blocking` | Critical user interactions | Immediate |
| `user-visible` | Updates user can see | Soon |
| `background` | Non-critical, analytics | When idle |

### Universal Scheduling Function with Fallback

```javascript
// Fallback for unsupported browsers
function schedule_task(callback, priority) {
    priority = priority || 'background';

    if ('scheduler' in window) {
        return scheduler.postTask(callback, { priority: priority });
    }

    // Fallback based on priority
    if (priority === 'user-blocking') {
        queueMicrotask(callback);
        return Promise.resolve();
    } else if (priority === 'background') {
        return new Promise(function(resolve) {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(function() {
                    callback();
                    resolve();
                });
            } else {
                setTimeout(function() {
                    callback();
                    resolve();
                }, 1);
            }
        });
    } else {
        // user-visible
        return new Promise(function(resolve) {
            setTimeout(function() {
                callback();
                resolve();
            }, 0);
        });
    }
}

// Usage
schedule_task(function() {
    send_analytics_event();
}, 'background');
```

---

<!-- /ANCHOR:scheduler-posttask-pattern -->
<!-- ANCHOR:priority-timing-decision-tree -->
## 6. PRIORITY & TIMING DECISION TREE

### Quick Reference Table

| Need | API | Timing |
|------|-----|--------|
| Visual updates (animation) | `requestAnimationFrame` | ~16ms (60fps) |
| After current task, before repaint | `queueMicrotask` | Immediate |
| When browser is idle | `requestIdleCallback` | Variable |
| Low priority background | `scheduler.postTask('background')` | Variable |
| Specific delay | `setTimeout` | Specified ms |

### Decision Flowchart

```
Is it a visual/animation update?
├─ YES → requestAnimationFrame
└─ NO → Is it time-critical for user experience?
         ├─ YES → queueMicrotask or scheduler.postTask('user-blocking')
         └─ NO → Can it wait for idle time?
                  ├─ YES → requestIdleCallback with timeout
                  └─ NO → setTimeout with appropriate delay
```

### Common Patterns by Use Case

| Use Case | API | Timeout/Fallback |
|----------|-----|------------------|
| Analytics/GTM | requestIdleCallback | timeout: 3000ms, fallback: 2000ms setTimeout |
| Non-critical init | requestIdleCallback | timeout: 5000ms, fallback: 3000ms setTimeout |
| Prefetching | requestIdleCallback | no timeout, fallback: 1000ms setTimeout |
| Animation loop | requestAnimationFrame | N/A |
| DOM batching | queueMicrotask | N/A |
| Background tasks | scheduler.postTask | fallback: requestIdleCallback |

---

<!-- /ANCHOR:priority-timing-decision-tree -->
<!-- ANCHOR:browser-compatibility -->
## 7. BROWSER COMPATIBILITY

### Support Matrix

| API | Chrome | Firefox | Safari | Edge |
|-----|--------|---------|--------|------|
| `requestAnimationFrame` | 24+ | 23+ | 6.1+ | 12+ |
| `requestIdleCallback` | 47+ | 55+ | ❌ | 79+ |
| `queueMicrotask` | 71+ | 69+ | 12.1+ | 79+ |
| `scheduler.postTask` | 94+ | ❌ | ❌ | 94+ |
| `setTimeout` | ✅ | ✅ | ✅ | ✅ |

### Safari-Safe Pattern

Always provide fallbacks for Safari:

```javascript
// Universal async scheduler
const async_scheduler = {
    on_idle: function(callback, timeout) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback, { timeout: timeout || 5000 });
        } else {
            setTimeout(callback, Math.min(timeout || 5000, 2000) / 2);
        }
    },

    on_frame: function(callback) {
        requestAnimationFrame(callback);
    },

    immediate: function(callback) {
        if (typeof queueMicrotask === 'function') {
            queueMicrotask(callback);
        } else {
            Promise.resolve().then(callback);
        }
    }
};
```

---

<!-- /ANCHOR:browser-compatibility -->
<!-- ANCHOR:webflow-specific-timing-patterns -->
## 8. WEBFLOW-SPECIFIC TIMING PATTERNS

### Wait for Collection List Render

Collection items render asynchronously after DOMContentLoaded:

```javascript
// Wait for Webflow to finish rendering collection lists
// Collection items render async after DOMContentLoaded
function wait_for_collection_render(selector, timeout) {
    timeout = timeout || 3000;

    return new Promise(function(resolve, reject) {
        var start = Date.now();

        function check() {
            var items = document.querySelectorAll(selector);
            if (items.length > 0) {
                resolve(items);
                return;
            }
            if (Date.now() - start > timeout) {
                reject(new Error('Collection ' + selector + ' not rendered within timeout'));
                return;
            }
            requestAnimationFrame(check);
        }

        check();
    });
}

// Usage
wait_for_collection_render('.w-dyn-item')
    .then(function(items) {
        initialize_collection_features(items);
    })
    .catch(function(error) {
        console.warn('Collection render timeout:', error);
    });
```

### Wait for Webflow Interactions to Initialize

```javascript
// Webflow.push ensures code runs after Webflow JS initializes
window.Webflow = window.Webflow || [];
window.Webflow.push(function() {
    // Safe to interact with Webflow-managed elements
    // Interactions, forms, and other Webflow features are ready
});
```

### Combining with Idle Callback

```javascript
// Initialize non-critical features after Webflow + idle
window.Webflow = window.Webflow || [];
window.Webflow.push(function() {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(function() {
            init_analytics();
            init_scroll_tracking();
        }, { timeout: 3000 });
    } else {
        setTimeout(function() {
            init_analytics();
            init_scroll_tracking();
        }, 2000);
    }
});
```

---

<!-- /ANCHOR:webflow-specific-timing-patterns -->
<!-- ANCHOR:real-example-gtm-delay -->
## 9. REAL EXAMPLE: GTM DELAY

```javascript
(function() {
    function load_gtm() {
        // GTM initialization code
        var script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-XXXX';
        document.head.appendChild(script);
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(load_gtm, { timeout: 3000 });
    } else {
        setTimeout(load_gtm, 2000);
    }
})();
```

---

<!-- /ANCHOR:real-example-gtm-delay -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Internal References

- [implementation_workflows.md](./implementation_workflows.md) - Condition-based waiting patterns
- [performance_patterns.md](./performance_patterns.md) - Throttle/debounce and performance optimization
- [../performance/third_party.md](../performance/third_party.md) - Third-party script loading optimization

### External References

- [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [MDN: requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [MDN: queueMicrotask](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)
- [MDN: Scheduler.postTask](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask)
<!-- /ANCHOR:related-resources -->
