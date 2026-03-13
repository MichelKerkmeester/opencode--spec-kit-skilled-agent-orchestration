---
title: JavaScript Code Quality Checklist
description: Quality validation checklist for JavaScript code in the OpenCode development environment.
---

# JavaScript Code Quality Checklist

Quality validation checklist for JavaScript code in the OpenCode development environment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Specific quality checks for JavaScript files. Use alongside the [universal_checklist.md](./universal_checklist.md) for complete validation.

### Priority Levels

| Level | Meaning | Enforcement |
|-------|---------|-------------|
| P0 | HARD BLOCKER | Must fix before commit |
| P1 | Required | Must fix or get explicit approval |
| P2 | Recommended | Can defer with justification |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:p0-hard-blockers -->
## 2. P0 - HARD BLOCKERS

These items MUST be fixed before any commit.

### Box Header

```markdown
[ ] File has box header with component identification
```

**Required format**:
```javascript
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: [Component Name]                                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: [Brief description of what this file does]                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
```

### 'use strict'

```markdown
[ ] 'use strict' directive present at top of file
```

**Required** (immediately after header):
```javascript
'use strict';
```

### Function Naming

```markdown
[ ] All functions use camelCase naming
```

**Correct**:
```javascript
function validateInput(data) { }
function processFile(path) { }
const handleError = (err) => { };
```

**Wrong**:
```javascript
function validate_input(data) { }    // snake_case
function ProcessFile(path) { }       // PascalCase
```

### No Commented-Out Code

```markdown
[ ] No commented-out code blocks
```

**Remove**:
```javascript
// function old_implementation() {
//     return "deprecated";
// }
```

### WHY Comments

```markdown
[ ] Purposeful WHY comments only (max 3 comments per 10 LOC)
    - Comments explain WHY, not WHAT
    - No narrative comments describing obvious mechanics
```

**Required for**:
- Algorithm choices
- Performance optimizations
- Business rule implementations
- Workarounds for known issues

### Numbered ALL-CAPS Sections

```markdown
[ ] Numbered ALL-CAPS section headers are preserved (`## N. SECTION NAME`)
```

---

<!-- /ANCHOR:p0-hard-blockers -->
<!-- ANCHOR:p1-required -->
## 3. P1 - REQUIRED

These must be addressed or receive approval to defer.

### CommonJS Exports

```markdown
[ ] Uses CommonJS module.exports (not ES modules)
```

**Correct**:
```javascript
module.exports = { functionName, CONSTANT };
module.exports = functionName;
```

**Wrong** (for Node.js in this codebase):
```javascript
export { function_name };
export default function_name;
```

### Guard Clauses

```markdown
[ ] Functions use early returns for invalid states
```

**Correct**:
```javascript
function processData(data) {
    if (!data) return null;
    if (!data.requiredField) return null;

    // Main logic here
    return result;
}
```

**Wrong**:
```javascript
function processData(data) {
    if (data) {
        if (data.requiredField) {
            // Deeply nested logic
        }
    }
}
```

### Bracketed Logging

```markdown
[ ] Console output uses bracketed format
```

**Correct**:
```javascript
console.log('[COMPONENT] Processing file:', filename);
console.error('[COMPONENT] Error:', error.message);
```

**Wrong**:
```javascript
console.log('Processing file: ' + filename);
console.log(filename);  // No context
```

### Constants

```markdown
[ ] Module-level constants use UPPER_SNAKE_CASE
```

**Correct**:
```javascript
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;
const VALID_TYPES = ['a', 'b', 'c'];
```

### Error Handling

```markdown
[ ] Try/catch blocks handle errors appropriately
[ ] Error messages include context
```

**Correct**:
```javascript
try {
    const data = JSON.parse(content);
} catch (error) {
    console.error('[PARSER] Failed to parse JSON:', error.message);
    throw new Error(`Invalid JSON in ${filename}: ${error.message}`);
}
```

### KISS / DRY / SOLID Checks

```markdown
[ ] KISS: avoid unnecessary abstraction or layering
[ ] DRY: repeated rules/constants extracted to shared source
[ ] SOLID: SRP/OCP/LSP/ISP/DIP violations checked and documented
```

---

<!-- /ANCHOR:p1-required -->
<!-- ANCHOR:p2-recommended -->
## 4. P2 - RECOMMENDED

These improve quality but can be deferred.

### JSDoc Comments

```markdown
[ ] Public functions have JSDoc documentation
```

**Example**:
```javascript
/**
 * Validates input data against schema.
 * @param {Object} data - The data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result with isValid and errors
 */
function validateInput(data, schema) { }
```

### Consistent String Quotes

```markdown
[ ] Strings use single quotes consistently
```

**Preferred**:
```javascript
const message = 'Hello world';
const config = { key: 'value' };
```

### Async/Await Pattern

```markdown
[ ] Async operations use async/await (not callbacks where possible)
```

**Preferred**:
```javascript
async function fetchData() {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
```

### Destructuring

```markdown
[ ] Object destructuring used where it improves clarity
```

**Good**:
```javascript
const { name, value } = config;
function process({ data, options = {} }) { }
```

---

<!-- /ANCHOR:p2-recommended -->
<!-- ANCHOR:checklist-template -->
## 5. CHECKLIST TEMPLATE

For formal findings-first review output, use `sk-code--review` as the baseline and treat this file as the JavaScript standards overlay.

```markdown
## JavaScript Standards Overlay Notes (sk-code--opencode)

- [ ] JavaScript standards validated in `javascript_checklist.md`
- [ ] Universal standards validated in `universal_checklist.md`
- [ ] Findings severity/order produced with `sk-code--review/references/quick_reference.md`
- [ ] Baseline security, quality, and test checks sourced from `sk-code--review`
- [ ] Overlay-only deviations documented with file:line evidence
```

---

<!-- /ANCHOR:checklist-template -->
<!-- ANCHOR:validation-commands -->
## 6. VALIDATION COMMANDS

```bash
# Syntax check
node --check file.js

# ESLint (if configured)
npx eslint file.js

# Check for common issues
grep -n "function [a-z]*_[a-z]" file.js  # Find snake_case functions
grep -n "^export " file.js              # Find ES module exports
```

---

<!-- /ANCHOR:validation-commands -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

### Checklists
- [universal_checklist.md](./universal_checklist.md) - Language-agnostic checks

### Style Guide
- [JavaScript Style Guide](../javascript/style_guide.md)
- [JavaScript Quality Standards](../javascript/quality_standards.md)
<!-- /ANCHOR:related-resources -->
