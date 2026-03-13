---
title: Config File Quality Checklist
description: Quality validation checklist for JSON and JSONC configuration files in the OpenCode development environment.
---

# Config File Quality Checklist

Quality validation checklist for JSON and JSONC configuration files in the OpenCode development environment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Specific quality checks for configuration files (JSON, JSONC). Use alongside the [universal_checklist.md](./universal_checklist.md) for complete validation.

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

### Valid JSON Syntax

```markdown
[ ] File is valid JSON/JSONC
    - All strings double-quoted
    - Proper bracket/brace matching
    - No trailing commas (JSON)
    - Valid value types
```

**Validation command**:
```bash
# Pure JSON
python -m json.tool config.json

# JSONC (strip comments first)
grep -v '^\s*//' config.jsonc | python -m json.tool
```

### String Quoting

```markdown
[ ] All strings use double quotes
```

**Correct**:
```jsonc
{
  "name": "value",
  "path": "./path/to/file"
}
```

**Wrong**:
```jsonc
{
  'name': 'value',    // Single quotes invalid
  name: "value"       // Unquoted key invalid
}
```

### Bracket Matching

```markdown
[ ] All brackets and braces properly matched
```

**Check for**:
- Opening `{` has closing `}`
- Opening `[` has closing `]`
- Nested structures properly closed

---

<!-- /ANCHOR:p0-hard-blockers -->
<!-- ANCHOR:p1-required -->
## 3. P1 - REQUIRED

These must be addressed or receive approval to defer.

### Schema Reference

```markdown
[ ] $schema reference included (when available)
```

**Recommended**:
```jsonc
{
  "$schema": "https://json-schema.org/draft-07/schema",
  // ... rest of config
}
```

### JSONC Section Comments

```markdown
[ ] Major sections have comment headers (JSONC files)
```

**Required format**:
```jsonc
{
  // ─────────────────────────────────────────────────────────────
  // 1. SECTION NAME
  // ─────────────────────────────────────────────────────────────
  "sectionConfig": { }
}
```

### WHY Comment Policy (JSONC)

```markdown
[ ] Purposeful WHY comments only (max 3 comments per 10 LOC)
    - Comments explain WHY, not WHAT
    - Narrative comments are not used
```

### camelCase Keys

```markdown
[ ] All property keys use camelCase
```

**Correct**:
```jsonc
{
  "maxResults": 100,
  "minSimilarityScore": 50,
  "autoRebuildOnSave": true
}
```

**Wrong**:
```jsonc
{
  "max_results": 100,      // snake_case
  "MaxResults": 100,       // PascalCase
  "max-results": 100       // kebab-case
}
```

### Inline Documentation

```markdown
[ ] Non-obvious values have inline comments (JSONC)
```

**Good**:
```jsonc
{
  "scaleDays": 90,         // Half-life ~ 62 days with this value
  "rrfK": 60               // RRF constant for rank fusion
}
```

### KISS / DRY / SOLID Checks

```markdown
[ ] KISS: section nesting remains minimal and behavior-focused
[ ] DRY: repeated constants appear in one canonical section
[ ] SOLID: SRP/OCP/LSP/ISP/DIP impacts reviewed for config consumers
```

---

<!-- /ANCHOR:p1-required -->
<!-- ANCHOR:p2-recommended -->
## 4. P2 - RECOMMENDED

These improve quality but can be deferred.

### Logical Key Ordering

```markdown
[ ] Keys ordered logically
    - $schema first
    - Related settings grouped
    - Common settings before advanced
```

**Example ordering**:
```jsonc
{
  "$schema": "...",

  // Basic settings first
  "enabled": true,
  "name": "feature",

  // Configuration next
  "settings": { },

  // Advanced/internal last
  "debug": false
}
```

### Consistent Indentation

```markdown
[ ] 2-space indentation throughout
```

### Section Spacing

```markdown
[ ] Blank lines between major sections
```

**Example**:
```jsonc
{
  // Section 1
  "setting1": "value",

  // Section 2
  "setting2": "value"
}
```

### Value Type Hints

```markdown
[ ] Complex values have type hints in comments
```

**Example**:
```jsonc
{
  "port": 3000,            // number: 1-65535
  "logLevel": "info",      // enum: debug, info, warn, error
  "timeout": 30000         // number: milliseconds
}
```

---

<!-- /ANCHOR:p2-recommended -->
<!-- ANCHOR:validation-patterns -->
## 5. VALIDATION PATTERNS

### Feature Toggle Pattern

```jsonc
{
  "featureName": {
    "enabled": true,
    "setting1": "value",
    "setting2": 100
  }
}
```

### Tier Configuration Pattern

```jsonc
{
  "tiers": {
    "high": { "boost": 3.0, "decay": false },
    "medium": { "boost": 2.0, "decay": false },
    "low": { "boost": 1.0, "decay": true }
  }
}
```

### Rule Configuration Pattern

```jsonc
{
  "rules": {
    "ruleType1": { "threshold": 0.5 },
    "ruleType2": { "threshold": 0.3 }
  },
  "defaultRule": "ruleType1"
}
```

---

<!-- /ANCHOR:validation-patterns -->
<!-- ANCHOR:checklist-template -->
## 6. CHECKLIST TEMPLATE

For formal findings-first review output, use `sk-code--review` as the baseline and treat this file as the config standards overlay.

```markdown
## Config Standards Overlay Notes (sk-code--opencode)

- [ ] Config standards validated in `config_checklist.md`
- [ ] Universal standards validated in `universal_checklist.md`
- [ ] Findings severity/order produced with `sk-code--review/references/quick_reference.md`
- [ ] Baseline security, quality, and test checks sourced from `sk-code--review`
- [ ] Overlay-only deviations documented with file:line evidence
```

---

<!-- /ANCHOR:checklist-template -->
<!-- ANCHOR:validation-commands -->
## 7. VALIDATION COMMANDS

```bash
# Validate pure JSON
python -m json.tool config.json

# Validate JSON and format
python -m json.tool config.json > /dev/null && echo "Valid"

# Check with jq (if available)
jq empty config.json && echo "Valid"

# Validate JSONC (strip comments, then validate)
sed 's|//.*||' config.jsonc | python -m json.tool

# VSCode: Open file - syntax highlighting shows errors
```

### Common JSON Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Expecting property name" | Single quotes or unquoted key | Use double quotes |
| "Expecting ',' delimiter" | Missing comma | Add comma after value |
| "Extra data" | Trailing comma | Remove trailing comma |
| "Expecting value" | Empty or missing value | Add proper value |

---

<!-- /ANCHOR:validation-commands -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Checklists
- [universal_checklist.md](./universal_checklist.md) - Language-agnostic checks

### Style Guide
- [Config Style Guide](../config/style_guide.md)

### External Resources
- [JSON Specification](https://www.json.org/)
- [JSON Schema](https://json-schema.org/)
<!-- /ANCHOR:related-resources -->
