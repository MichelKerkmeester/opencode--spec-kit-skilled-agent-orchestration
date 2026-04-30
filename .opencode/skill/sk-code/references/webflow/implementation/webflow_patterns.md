---
title: Webflow Platform Patterns - Development Guide
description: Complete platform constraints and collection list patterns for Webflow development.
---

# Webflow Platform Patterns - Development Guide

Complete platform constraints and collection list patterns for Webflow development.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Platform constraints and collection list patterns for Webflow development. These limits are enforced by Webflow and cannot be overridden - architecture must work within them from the start.

### Prerequisites
Follow code quality standards:
- **Initialization:** Use CDN-safe pattern with guard flags and delays
- **Naming:** Use `snake_case` for functions/variables
- See [code_quality_standards.md](../standards/code_quality_standards.md) for complete standards

### When to Use
- Working with Webflow CMS Collections
- Understanding platform limits (items per list, nesting)
- Configuring production settings

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:platform-limits-quick-reference -->
## 2. PLATFORM LIMITS QUICK REFERENCE

### CMS Limits (Next-Gen)

Webflow Next-Gen CMS dramatically increased limits, but they're still hard constraints:

| Limit Type | Value | Impact if Exceeded |
|------------|-------|-------------------|
| **Collections per site** | 40 | Designer prevents adding more |
| **Total items (all collections)** | 1,000,000 | Cannot add items, publishing fails |
| **Items per collection** | 1,000,000 | Cannot add more items to collection |
| **Collection lists per page** | 40 | Designer prevents adding more lists |
| **Items displayed per list** | 100 | **Truncates silently** - remaining items hidden |
| **Nested lists per page** | 10 | Designer prevents adding more |
| **Items in nested list** | 100 | Truncates if exceeded |
| **Nesting depth** | 3 levels | Deeper nesting not supported |

**Critical limit to note:** The 100 items per list display limit **silently truncates** - if collection has 150 items, only first 100 display. No error, no warning.

### Field Limits

| Field Type | Limit | Impact |
|------------|-------|--------|
| **Reference fields** | 10 | Cannot add more |
| **Multi-reference fields** | 10 | Cannot add more |
| **Rich text length** | 10,000 chars | Truncates if exceeded |
| **Plain text length** | 2,000 chars | Truncates if exceeded |

### API Limits

| Limit Type | Value | Error if Exceeded |
|------------|-------|------------------|
| **API calls per minute** | 60 | HTTP 429 (Rate Limited) |
| **API payload size** | 4MB | Request rejected |

### Production Configuration (Non-Negotiable)

Webflow enforces these settings in production - you cannot override them:

| Setting | Value | Development Impact |
|---------|-------|-------------------|
| **JavaScript loading** | Synchronous (`sync`) | Scripts load in order, blocking |
| **CSS scope** | Per-page (`per_page`) | No global CSS cascade between pages |
| **Minification** | Enabled (HTML/CSS/JS) | Function names mangled - never use `function.name` |
| **SSL** | Enforced | HTTPS required for all requests |

---

<!-- /ANCHOR:platform-limits-quick-reference -->
<!-- ANCHOR:collection-list-patterns -->
## 3. COLLECTION LIST PATTERNS

### Problem 1: ID Duplication

**Issue:** Webflow duplicates `id` attributes across collection items

**Example:** Collection list with 10 blog posts, each has `<button id="read-more">`. Result: 10 elements with same ID.

**Impact:** `getElementById()` returns only first match, breaking per-item logic

**Solution: Never target by ID inside collection lists**

```javascript
// ❌ WRONG: Returns only first item's button
const button = document.getElementById('read-more');
button.addEventListener('click', handleClick);

// ✅ CORRECT: Use classes with querySelectorAll
document.querySelectorAll('.read-more-button').forEach(btn => {
  btn.addEventListener('click', handleClick);
});

// ✅ BETTER: Event delegation (recommended)
document.addEventListener('click', (e) => {
  if (e.target.matches('.read-more-button')) {
    handleClick(e);
  }
});
```

**Why event delegation is better:**
- Single event listener (less memory)
- Works for dynamically added items (pagination, filters)
- Simpler code, easier to maintain

#### Debugging ID Duplication with CLI Tools

**Use CLI tools to detect duplicate IDs before deployment:**

**Option 1: Quick ID Duplication Check**
```bash
#!/bin/bash
# Detect duplicate IDs in collection lists

URL="https://example.com"

echo "🔍 Checking for duplicate IDs..."

# Start browser session
bdg "$URL" 2>&1

# Query all elements with IDs
IDS=$(bdg js "Array.from(document.querySelectorAll('[id]')).map(el => el.id).join('\\n')" 2>&1)

# Stop session
bdg stop 2>&1

# Find duplicates
echo "$IDS" | sort | uniq -d | while read -r duplicate_id; do
  if [ -n "$duplicate_id" ]; then
    COUNT=$(echo "$IDS" | grep -c "^$duplicate_id$")
    echo "❌ DUPLICATE ID: '$duplicate_id' appears $COUNT times"
  fi
done

echo "✅ ID duplication check complete"
```

**Option 2: Collection List DOM Inspection**
```bash
#!/bin/bash
# Inspect collection list structure and IDs

URL="https://example.com"

echo "🔍 Inspecting collection list structure..."

# Start browser session
bdg "$URL" 2>&1

# Query collection items and their IDs
bdg js "
(() => {
  const items = document.querySelectorAll('.w-dyn-item');
  const results = {
    totalItems: items.length,
    duplicateIds: {},
    report: []
  };

  items.forEach((item, index) => {
    const idsInItem = Array.from(item.querySelectorAll('[id]')).map(el => el.id);

    idsInItem.forEach(id => {
      if (!results.duplicateIds[id]) {
        results.duplicateIds[id] = 0;
      }
      results.duplicateIds[id]++;
    });

    results.report.push({
      itemIndex: index,
      idsInItem: idsInItem,
      hasConflicts: idsInItem.length > 0
    });
  });

  return results;
})()
" 2>&1 | jq '.'

# Stop session
bdg stop 2>&1

echo "✅ Collection list inspection complete"
```

**Option 3: Automated Pre-Deployment Validation**
```bash
#!/bin/bash
# Pre-deployment validation: Assert no duplicate IDs

URL="https://example.com"
FAIL=0

echo "🔍 Running pre-deployment ID validation..."

# Start browser session
bdg "$URL" 2>&1

# Check for duplicate IDs
DUPLICATES=$(bdg js "
(() => {
  const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
  const counts = {};
  ids.forEach(id => counts[id] = (counts[id] || 0) + 1);
  return Object.entries(counts).filter(([id, count]) => count > 1);
})()
" 2>&1)

# Stop session
bdg stop 2>&1

# Parse results
DUPLICATE_COUNT=$(echo "$DUPLICATES" | jq 'length')

if [ "$DUPLICATE_COUNT" -gt 0 ]; then
  echo "❌ FAIL: Found $DUPLICATE_COUNT duplicate IDs:"
  echo "$DUPLICATES" | jq -r '.[] | "  - \(.[0]): \(.[1]) occurrences"'
  FAIL=1
else
  echo "✅ PASS: No duplicate IDs found"
fi

exit $FAIL
```

**See also:** `.opencode/skill/mcp-chrome-devtools/SKILL.md` for complete CLI debugging patterns

---

### Problem 2: Async Rendering Delays

**Issue:** Collection items render asynchronously after DOM ready event fires

**Example:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.w-dyn-item');
  console.log(items.length);  // Often returns 0!
});
```

**Impact:** `querySelectorAll('.w-dyn-item')` returns empty array on immediate query

**Solution: Use delay, retry, or observer pattern**

#### Option 1: Fixed Delay (Simple)

**When to use:** Simple components, fast connections, known load times

```javascript
const INIT_DELAY_MS = 500;

setTimeout(() => {
  const items = document.querySelectorAll('.w-dyn-item');
  if (items.length) {
    init_collection_items(items);
  }
}, INIT_DELAY_MS);
```

**Pros:** Simple, works most of the time
**Cons:** Breaks on slow connections, wastes time on fast connections

#### Option 2: Retry Pattern (Robust)

**When to use:** Production code, variable network speeds, critical functionality

```javascript
// WEBFLOW: Collection items render asynchronously after DOM ready
(function retry_init(attempts = 10) {
  const items = document.querySelectorAll('.w-dyn-item');

  if (items.length) {
    return init_collection_items(items);
  }

  if (attempts > 0) {
    setTimeout(() => retry_init(attempts - 1), 200);
  } else {
    console.error('Collection items failed to render after 2 seconds');
  }
})();
```

**Pros:** Works on all connection speeds, logs failure
**Cons:** Slightly more complex than fixed delay

#### Option 3: MutationObserver (Reactive)

**When to use:** Complex pages, progressive enhancement, dynamic content

```javascript
const observer = new MutationObserver(() => {
  const items = document.querySelectorAll('.w-dyn-item');

  if (items.length) {
    init_collection_items(items);
    observer.disconnect();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Timeout fallback if items never render
setTimeout(() => {
  observer.disconnect();
  console.error('Collection items failed to render after 5 seconds');
}, 5000);
```

**Pros:** Reactive, no polling delays, works with progressive enhancement
**Cons:** More complex, requires cleanup

**Recommended approach:** Use retry pattern for most cases, MutationObserver for progressive enhancement.

---

### Problem 3: Event Delegation for Dynamic Items

**Issue:** Direct event binding doesn't work for dynamically added items (pagination, filters)

**Example of problem:**
```javascript
document.querySelectorAll('.w-dyn-item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// Items added later (pagination, filters) won't have listeners!
```

**Solution: Delegate events to document or parent container**

```javascript
function setup_collection_events() {
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.w-dyn-item');
    if (!item) return;
    if (e.target.matches('.expand-button')) {
      toggle_item_expansion(item);
    }

    if (e.target.matches('.delete-button')) {
      delete_collection_item(item);
    }

    if (e.target.matches('.favorite-button')) {
      toggle_favorite(item);
    }
  });
}

// Helper functions
function toggle_item_expansion(item) {
  const details = item.querySelector('.item-details');
  details.classList.toggle('is-expanded');
}

function delete_collection_item(item) {
  if (confirm('Delete this item?')) {
    item.remove();
  }
}

function toggle_favorite(item) {
  const button = item.querySelector('.favorite-button');
  button.classList.toggle('is-favorited');
}
```

**Benefits of event delegation:**
- ✅ Works for items added after page load
- ✅ Single event listener (less memory usage)
- ✅ Simpler code (no need to rebind after DOM changes)
- ✅ Better performance (1 listener vs 100 listeners)

---

### Problem 4: Progressive Enhancement

**Issue:** Items may be added after initial page load (pagination, filters, infinite scroll)

**Solution: Initialize existing items, then observe for additions**

```javascript
function progressive_init() {
  function init_existing_items() {
    const items = document.querySelectorAll('.w-dyn-item:not([data-initialized])');

    items.forEach(item => {
      item.dataset.initialized = 'true';

      item.dataset.itemIndex = item.parentNode.children.indexOf(item);

      setup_item_behavior(item);
    });

    console.log(`Initialized ${items.length} new collection items`);
  }

  init_existing_items();

  const list = document.querySelector('.w-dyn-list');
  if (list) {
    const observer = new MutationObserver(init_existing_items);
    observer.observe(list, {
      childList: true
    });
  }
}

function setup_item_behavior(item) {
  const title = item.querySelector('[data-field="title"]')?.textContent;
  const itemId = item.querySelector('[data-field="id"]')?.textContent;

  item.dataset.itemTitle = title;
  item.dataset.itemId = itemId;

  console.log(`Setup item: ${title} (ID: ${itemId})`);
}
```

**When to use this pattern:**
- Pagination (load more buttons)
- Infinite scroll
- Filter/search that adds/removes items
- Dynamic content loading

---

### Problem 5: Data Attributes as Stable Handles

**Issue:** Need stable identifiers for per-item behavior without relying on IDs

**Solution: Attach data attributes during initialization**

```javascript
function init_collection_items() {
  document.querySelectorAll('.w-dyn-item').forEach((item, index) => {
    item.dataset.itemIndex = String(index);

    const itemId = item.querySelector('[data-cms-id]')?.textContent;
    const itemSlug = item.querySelector('[data-cms-slug]')?.textContent;
    const itemCategory = item.querySelector('[data-cms-category]')?.textContent;

    item.dataset.itemId = itemId || '';
    item.dataset.itemSlug = itemSlug || '';
    item.dataset.itemCategory = itemCategory || '';

    item.addEventListener('click', (e) => {
      console.log('Clicked item:', {
        index: item.dataset.itemIndex,
        id: item.dataset.itemId,
        slug: item.dataset.itemSlug,
        category: item.dataset.itemCategory
      });
    });
  });
}
```

**Benefits:**
- ✅ Stable identifiers (not relying on duplicated IDs)
- ✅ Easy data access (`item.dataset.itemId`)
- ✅ Works with event delegation
- ✅ Survives DOM manipulations

---

<!-- /ANCHOR:collection-list-patterns -->
<!-- ANCHOR:development-best-practices -->
## 4. DEVELOPMENT BEST PRACTICES

### Architectural Guidance

**Design around limits from the start - don't fight them later:**

1. **Collection lists** - Budget for 100 items max display per list
   - If collection has >100 items, implement pagination or filtering
   - Don't assume all items will display (Webflow truncates silently)

2. **Multiple lists** - Plan for up to 40 lists per page when composing complex layouts
   - Designer prevents adding more, so plan list usage carefully
   - Consider combining related content into single lists

3. **Event binding** - Prefer event delegation over per-item binding
   - 1 delegated listener vs 100 individual listeners
   - Works for dynamic content (pagination, filters)

4. **Nested lists** - Use conservatively (max 10 per page, 3 levels deep)
   - Performance degrades with nesting depth
   - Consider flatter data structures where possible

### Performance Considerations

**Optimize for Webflow constraints:**

| Concern | Recommendation | Rationale |
|---------|---------------|-----------|
| **Item count** | Design pagination for >100 items | Display limit is 100 per list |
| **Event listeners** | Use delegation (1 listener) | vs per-item (100 listeners) reduces memory |
| **Initialization** | Use retry pattern or observer | Items render asynchronously |
| **Nested lists** | Minimize depth and count | Performance degrades, 10 list limit |
| **CSS scope** | Inline critical styles | Per-page CSS, no global cascade |

### DOM Attribute Hygiene

**Maintain clean HTML by removing empty attributes:**

| Attribute Type | Issue | Action |
|----------------|-------|--------|
| **Empty IDs** (`id=""`) | Invalid HTML, selector bugs | **Always Remove** |
| **Empty Config** (`data-type=""`) | DOM bloat, noise | **Remove** (Allowlist only) |
| **Empty Markers** (`data-active`) | Boolean flag logic | **Keep** (Never remove) |

**Strategy:**
- Use a global cleanup script (see `attribute_cleanup.js`)
- **Allowlist approach:** Only remove specific attributes known to be value-based
- **Never** blindly remove all empty attributes (breaks boolean flags)

### Quick Validation Script

**Check your page against Webflow limits:**

```javascript
(() => {
  const lists = document.querySelectorAll('.w-dyn-list');
  const nested = document.querySelectorAll('.w-dyn-list .w-dyn-list');
  const itemCounts = Array.from(lists).map(list =>
    list.querySelectorAll('.w-dyn-item').length
  );
  const maxItems = Math.max(0, ...itemCounts);
  const totalItems = itemCounts.reduce((sum, count) => sum + count, 0);

  const results = {
    'Collection Lists': `${lists.length}/40`,
    'Nested Lists': `${nested.length}/10`,
    'Max Items in a List': `${maxItems}/100`,
    'Total Items on Page': totalItems,
    'Status': maxItems <= 100 && lists.length <= 40 && nested.length <= 10
      ? '✅ Within limits'
      : '⚠️ Exceeds limits'
  };

  console.table(results);

  itemCounts.forEach((count, i) => {
    if (count > 80) {
      console.warn(`List ${i + 1} has ${count} items (approaching 100 limit)`);
    }
  });
})();
```

**When to run this:**
- During development (before publishing)
- After adding new collection lists
- When experiencing rendering issues
- Before launching to production

---

<!-- /ANCHOR:development-best-practices -->
<!-- ANCHOR:production-configuration-constraints -->
## 5. PRODUCTION CONFIGURATION CONSTRAINTS

### JavaScript Loading (Synchronous)

**Webflow enforces synchronous script loading:**

```javascript
// Scripts load in this order, blocking:
// 1. jQuery (Webflow dependency)
// 2. Webflow.js (site interactions)
// 3. Your custom code (page-specific)
```

**What this means:**
- Scripts load in order defined in Designer
- Each script blocks until previous completes
- Cannot override to async/defer
- Place heavy scripts strategically

**Optimization strategies:**
```javascript
window.addEventListener('load', () => {
  init_heavy_features();
});

// Keep page-level code minimal
// Move shared code to global footer (loads once)
```

### CSS Scope (Per-Page)

**Webflow enforces per-page CSS scope:**

```css
/* page-1.css */
.button { color: red; }

/* page-2.css */
.button { color: blue; }
```

**What this means:**
- Each page has isolated CSS (no cascade between pages)
- Cannot rely on styles from other pages
- Shared styles must be in global CSS or duplicated

**Strategies for shared styles:**
```javascript
// Option 1: Embed shared styles in global footer
<style>
  /* Shared across all pages */
  .button-primary { ... }
  .modal-overlay { ... }
</style>

// Option 2: Use Webflow's global CSS feature (in Designer)

// Option 3: Duplicate critical styles per page (if minimal)
```

### Function Names Minified

**Webflow minifies all JavaScript in production:**

```javascript
// Your code:
function handle_form_submit() { ... }

// After minification:
function a() { ... }
```

**What this means:**
- Never use `function.name` for logic
- Function names mangled, unreliable
- Use explicit identifiers instead

**Wrong approach:**
```javascript
// ❌ Breaks in production (function.name minified)
function handle_submit() { }
const handlerName = handle_submit.name;  // "handle_submit" in dev, "a" in prod
```

**Correct approach:**
```javascript
// ✅ Use explicit identifiers
function handle_submit() { }
const handlerName = 'handle_submit';

const handlers = {
  submit: function() { },
  reset: function() { }
};
```

---

<!-- /ANCHOR:production-configuration-constraints -->
<!-- ANCHOR:testing-checklist -->
## 6. TESTING CHECKLIST

### Collection List Testing

Test across different item counts:

- [ ] **Empty state (0 items)** - Verify graceful degradation, empty message shows
- [ ] **Single item (1 item)** - Verify layout doesn't break, no JavaScript errors
- [ ] **Moderate count (20-50 items)** - Verify performance acceptable
- [ ] **Full list (100 items)** - Verify all items display correctly, no truncation message
- [ ] **Over limit (>100 items in CMS)** - Verify truncation behavior, first 100 show

### Multi-List Testing

Test multiple lists on a page:

- [ ] **1 list** - Baseline functionality works
- [ ] **10 lists** - Moderate complexity, check performance
- [ ] **40 lists** - At limit, verify Designer allows, check page performance
- [ ] **Nested lists** - Up to 3 levels deep with max 10 nested lists total

### Event Delegation Testing

Verify event delegation works correctly:

- [ ] **Initial items** - Events fire for items present on page load
- [ ] **Added items** - Events fire for items added dynamically (pagination, filters)
- [ ] **Multiple clicks** - Events don't double-fire (no listener duplication)
- [ ] **Removed items** - No errors when clicking removed items

### Network Conditions Testing

Test async rendering patterns:

- [ ] **Fast connection** - Items load quickly, no visible delay
- [ ] **Slow connection (throttled)** - Retry/observer patterns work, items eventually load
- [ ] **Offline → Online** - Verify recovery behavior when connection restored

### Responsive Testing

Test across all Webflow breakpoints:

- [ ] **Desktop (>992px)** - Full functionality
- [ ] **Tablet (768-991px)** - Layout adapts, features work
- [ ] **Mobile landscape (480-767px)** - Compact layout, touch-friendly
- [ ] **Mobile portrait (<480px)** - Minimal layout, core features work

---

<!-- /ANCHOR:testing-checklist -->
<!-- ANCHOR:integration -->
## 7. INTEGRATION WITH WORKFLOWS-CODE

### Phase 1: Implementation

When implementing Webflow features:
1. **Check platform limits** - Verify design fits within CMS constraints
2. **Use collection list patterns** - Event delegation, retry pattern for async rendering
3. **Plan for truncation** - 100 item display limit, implement pagination if needed
4. **Follow CDN-safe pattern** - Guard flags, delays, Webflow.push integration

### Phase 2: Debugging

When debugging Webflow-specific issues:
1. **ID duplication** - Switch to classes or data attributes
2. **Async rendering** - Add retry logic or MutationObserver
3. **Event delegation** - Verify delegation to document/parent, not per-item binding
4. **Platform limits** - Run validation script to check for exceeded limits

### Phase 3: Verification

When verifying Webflow implementations:
1. **Run validation script** - Check lists/items against limits
2. **Test item counts** - Empty, single, moderate, full (100), over-limit scenarios
3. **Network conditions** - Fast, slow, offline → online recovery
4. **Production configuration** - Verify synchronous loading, per-page CSS work as expected

---

**Core principle:** Webflow platform constraints are enforced and cannot be overridden. Design your architecture to work within them from the start. Attempting to bypass limits will result in broken functionality or failed publishes.

---

<!-- /ANCHOR:integration -->
<!-- ANCHOR:finsweet-custom-select-bridge-pattern -->
## 8. FINSWEET CUSTOM SELECT BRIDGE PATTERN

### Problem: Custom Select + Native Form Submission

**Issue:** Custom select UI components (styled dropdowns) don't integrate with native form submission or Finsweet's list-sort library.

**Why this happens:**
- Custom selects use `<div>` elements for styling flexibility
- Native `<select>` elements are required for form submission
- Finsweet list-sort only detects changes on native `<select>` elements
- Two separate DOM structures need to stay synchronized

### Solution Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CUSTOM SELECT BRIDGE PATTERN                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐         ┌─────────────────────┐                   │
│  │   Custom Select     │   sync  │   Hidden Native     │                   │
│  │   (Visible UI)      │ ──────► │   <select>          │                   │
│  │                     │         │   (Form/FS Target)  │                   │
│  └─────────────────────┘         └─────────────────────┘                   │
│           │                                │                                │
│           ▼                                ▼                                │
│  ┌─────────────────────┐         ┌─────────────────────┐                   │
│  │  User Interaction   │         │  Finsweet/Form      │                   │
│  │  - Click options    │         │  - list-sort        │                   │
│  │  - Keyboard nav     │         │  - Form submission  │                   │
│  │  - Visual feedback  │         │  - Native events    │                   │
│  └─────────────────────┘         └─────────────────────┘                   │
│                                                                             │
│  FLOW:                                                                      │
│  1. User clicks custom option                                               │
│  2. CustomSelect updates visible input                                      │
│  3. Bridge listens for 'change' event on custom input                       │
│  4. Bridge syncs value to hidden native <select>                            │
│  5. Bridge dispatches 'change' event on native select                       │
│  6. Finsweet/Form receives native change event                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Pattern

**File structure (load order matters):**
1. `input_select.js` - Base CustomSelect implementation
2. `input_select_fs_bridge.js` - Finsweet bridge (loads AFTER)

#### Step 1: Hidden Native Select Creation

Create a visually hidden but accessible native `<select>` that mirrors custom options.

```javascript
// [SOURCE: src/javascript/form/input_select_fs_bridge.js:26-73]

// Configuration
const FS_ATTR = 'fs-list-element';
const FS_VALUE = 'sort-trigger';
const HIDDEN_CLASS = 'fs-sort-select--hidden';

function create_hidden_select(custom_select_instance) {
  const container = custom_select_instance.container;
  const options = custom_select_instance.options;
  const placeholder = custom_select_instance.placeholder;

  const native_select = document.createElement('select');
  native_select.className = HIDDEN_CLASS;
  native_select.setAttribute(FS_ATTR, FS_VALUE);

  // Hide visually but keep accessible to Finsweet
  // Uses screen-reader-only pattern (not display:none)
  native_select.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
    pointer-events: none;
  `;

  const placeholder_opt = document.createElement('option');
  placeholder_opt.value = '';
  placeholder_opt.textContent = placeholder;
  placeholder_opt.disabled = true;
  placeholder_opt.selected = true;
  native_select.appendChild(placeholder_opt);

  options.forEach((custom_opt) => {
    const native_opt = document.createElement('option');
    native_opt.value = custom_opt.dataset.value || '';
    native_opt.textContent = custom_opt.textContent.trim();
    native_select.appendChild(native_opt);
  });

  container.appendChild(native_select);

  // Remove attribute from wrapper so Finsweet only sees the native select
  container.removeAttribute(FS_ATTR);

  return native_select;
}
```

**Key implementation details:**
- Uses screen-reader-only CSS pattern (not `display: none`)
- `display: none` prevents Finsweet from detecting the element
- Moves `fs-list-element` attribute from wrapper to native select
- Mirrors all options including placeholder

#### Step 2: Sync Helper

Synchronize selection from custom select to hidden native select.

```javascript
// [SOURCE: src/javascript/form/input_select_fs_bridge.js:79-83]

function sync_to_native(native_select, value) {
  native_select.value = value;
  native_select.dispatchEvent(new Event('change', { bubbles: true }));
}
```

**Critical:** Must dispatch a `change` event after setting value. Finsweet listens for native events, not just value changes.

#### Step 3: Bridge Initialization

Connect the bridge after CustomSelect instances are ready.

```javascript
// [SOURCE: src/javascript/form/input_select_fs_bridge.js:89-137]

const INIT_FLAG = '__finsweetSelectBridgeInit';

function init_finsweet_bridge() {
  const sort_triggers = document.querySelectorAll(
    `[data-select="wrapper"][${FS_ATTR}="${FS_VALUE}"]`
  );

  if (sort_triggers.length === 0) return;

  sort_triggers.forEach((container) => {
    const instance = container._customSelect;
    if (!instance) {
      console.warn('FinsweetBridge: CustomSelect instance not found', container);
      return;
    }

    const native_select = create_hidden_select(instance);

    instance._fs_native_select = native_select;

    instance.input.addEventListener('change', () => {
      const value = instance.input.dataset.value || '';
      sync_to_native(native_select, value);
    });
  });

  console.log(`FinsweetBridge: Connected ${sort_triggers.length} sort trigger(s)`);
}

const start = () => {
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;

  // Delay to ensure CustomSelect has initialized first
  setTimeout(init_finsweet_bridge, 100);
};

// WEBFLOW: Use Webflow.push for proper timing with Webflow interactions
if (window.Webflow?.push) {
  window.Webflow.push(start);
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
```

**Load order dependency:** Bridge must load AFTER `input_select.js` because it accesses `container._customSelect` instance.

### Webflow Attribute Configuration

| Element | Attribute | Value | Purpose |
|---------|-----------|-------|---------|
| Custom select wrapper | `data-select` | `wrapper` | CustomSelect targets this |
| Custom select wrapper | `fs-list-element` | `sort-trigger` | Bridge detects this |
| Hidden native select | `fs-list-element` | `sort-trigger` | Finsweet targets this |
| Custom options | `data-value` | `{sort-value}` | Value synced to native |

**Attribute migration:** Bridge moves `fs-list-element` from wrapper to hidden native select, so Finsweet only sees one target.

### DOM Structure

**Before bridge initialization:**
```html
<div data-select="wrapper" fs-list-element="sort-trigger">
  <div data-select="trigger">
    <input data-select="input" placeholder="Sort by..." readonly>
  </div>
  <div data-select="dropdown">
    <div data-select="option" data-value="date-asc">Date (Oldest)</div>
    <div data-select="option" data-value="date-desc">Date (Newest)</div>
    <div data-select="option" data-value="name-asc">Name (A-Z)</div>
  </div>
</div>
```

**After bridge initialization:**
```html
<div data-select="wrapper" data-select-initialized="true">
  <!-- fs-list-element removed from wrapper -->
  <div data-select="trigger">
    <input data-select="input" placeholder="Sort by..." readonly>
  </div>
  <div data-select="dropdown">
    <div data-select="option" data-value="date-asc">Date (Oldest)</div>
    <div data-select="option" data-value="date-desc">Date (Newest)</div>
    <div data-select="option" data-value="name-asc">Name (A-Z)</div>
  </div>
  <!-- Hidden native select created by bridge -->
  <select class="fs-sort-select--hidden" fs-list-element="sort-trigger">
    <option value="" disabled selected>Sort by...</option>
    <option value="date-asc">Date (Oldest)</option>
    <option value="date-desc">Date (Newest)</option>
    <option value="name-asc">Name (A-Z)</option>
  </select>
</div>
```

### When to Use This Pattern

| Scenario | Use Bridge? | Rationale |
|----------|-------------|-----------|
| Custom select + Finsweet list-sort | Yes | Finsweet requires native select |
| Custom select + Form submission | Maybe | Use if backend expects native select |
| Custom select + Validation only | No | CustomSelect handles validation |
| Native select + Custom styling | No | Style native select with CSS |

### Anti-Patterns to Avoid

**Do NOT use `display: none` for hidden select:**
```javascript
// ❌ WRONG: Finsweet cannot detect display:none elements
native_select.style.display = 'none';

// ✅ CORRECT: Screen-reader-only pattern
native_select.style.cssText = `
  position: absolute;
  width: 1px;
  height: 1px;
  clip: rect(0, 0, 0, 0);
  ...
`;
```

**Do NOT sync on every input event:**
```javascript
// ❌ WRONG: Fires too frequently, includes partial values
instance.input.addEventListener('input', () => {
  sync_to_native(native_select, instance.input.value);
});

// ✅ CORRECT: Only sync on final selection (change event)
instance.input.addEventListener('change', () => {
  sync_to_native(native_select, instance.input.dataset.value);
});
```

**Do NOT forget to dispatch native event:**
```javascript
// ❌ WRONG: Value changes but Finsweet doesn't detect it
native_select.value = value;

// ✅ CORRECT: Dispatch change event for Finsweet
native_select.value = value;
native_select.dispatchEvent(new Event('change', { bubbles: true }));
```

### Debugging the Bridge

**Check if bridge initialized:**
```javascript
console.log(window.__finsweetSelectBridgeInit);

document.querySelectorAll('.fs-sort-select--hidden').forEach(sel => {
  console.log('Hidden select:', sel.value, sel.options.length);
});
```

**Verify sync is working:**
```javascript
document.querySelectorAll('.fs-sort-select--hidden').forEach(sel => {
  sel.addEventListener('change', (e) => {
    console.log('Native select changed:', e.target.value);
  });
});
```

**Common issues:**

| Symptom | Cause | Fix |
|---------|-------|-----|
| Bridge not initializing | Script load order | Load bridge AFTER input_select.js |
| Finsweet not sorting | Hidden select not found | Check fs-list-element attribute |
| Values not syncing | Missing change listener | Verify event listener on custom input |
| Double sorting | Attribute on both elements | Bridge should remove attr from wrapper |

---

<!-- /ANCHOR:finsweet-custom-select-bridge-pattern -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](./implementation_workflows.md) - Condition-based waiting patterns complement async rendering solutions
- [code_quality_standards.md](../standards/code_quality_standards.md) - CDN-safe initialization pattern for Webflow platform
- [performance_patterns.md](./performance_patterns.md) - Performance optimization for collection lists with many items

### Source Files (Evidence)
- `src/javascript/form/input_select.js` - Base CustomSelect implementation with ARIA support
- `src/javascript/form/input_select_fs_bridge.js` - Finsweet bridge pattern implementation

### Related Skills
- `mcp-chrome-devtools` - CLI debugging tools for ID duplication detection and collection list inspection

### External Documentation
- [Finsweet CMS Sort](https://finsweet.com/attributes/cms-sort) - Official Finsweet list-sort documentation
<!-- /ANCHOR:related-resources -->
