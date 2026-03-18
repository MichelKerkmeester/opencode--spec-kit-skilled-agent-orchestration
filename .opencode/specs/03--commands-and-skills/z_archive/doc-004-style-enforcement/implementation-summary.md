---
title: "Implementation Summary: Zero-Tolerance Documentation Formatting [004-style-enforcement/implementation-summary]"
description: "Location: .opencode/skill/sk-doc/assets/template_rules.json"
trigger_phrases:
  - "implementation"
  - "summary"
  - "zero"
  - "tolerance"
  - "documentation"
  - "implementation summary"
  - "018"
  - "style"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Implementation Summary: Zero-Tolerance Documentation Formatting

> Implementation complete. Created validation script and updated write agent workflow.

---

<!-- ANCHOR:metadata -->
## What Was Built

### 1. Template Rules File (`template_rules.json`)

**Location:** `.opencode/skill/sk-doc/assets/template_rules.json`

**Features:**
- 5 document types: readme, skill, reference, asset, agent
- Section emoji mappings for each type
- Severity levels: blocking, warning, info
- Auto-fix rules for safe transformations
- Validation regex patterns

### 2. Validation Script (`validate_document.py`)

**Location:** `.opencode/skill/sk-doc/scripts/validate_document.py`

**CLI Interface:**
```bash
# Basic validation
python validate_document.py <file.md>

# With options
python validate_document.py <file.md> --json        # JSON output
python validate_document.py <file.md> --type readme # Explicit type
python validate_document.py <file.md> --fix         # Auto-fix safe issues
python validate_document.py <file.md> --fix --dry-run  # Preview fixes
python validate_document.py <file.md> --blocking-only   # Show only blockers
```

**What It Checks:**
| Check | Severity | Auto-Fixable |
|-------|----------|--------------|
| Missing TOC section | blocking | No |
| TOC anchor single-dash (should be double) | blocking | Yes |
| TOC entry missing emoji | blocking | No (needs enhancement) |
| H2 header missing emoji | blocking | Partial |
| Missing required section | blocking | No |
| Non-sequential numbering | warning | No |

**Exit Codes:**
- 0 = Valid (no blocking errors)
- 1 = Invalid (blocking errors found)
- 2 = File not found / parse error

### 3. Write Agent Updates (`write.md`)

**Changes:**
- Added HARD GATE for template loading (step 3)
- Added VALIDATE FORMAT step with `validate_document.py` (step 8)
- Updated workflow flowchart with validation gates
- Added validation script to Scripts table
- Documented mandatory validation before delivery

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## Test Results

**Validation Against system-spec-kit READMEs:**

| Result | Count | Notes |
|--------|-------|-------|
| VALID | 27 | All pass validation |
| INVALID (fixed) | 3 | architecture, scripts, mcp_server root |
| Excluded | N/A | node_modules, .pytest_cache (third-party) |

**Fixed Files:**
1. `mcp_server/lib/architecture/README.md` - Added emojis to TOC entries
2. `mcp_server/scripts/README.md` - Added TOC section
3. Updated validator to accept `## 📑 TABLE OF CONTENTS` variant

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:verification -->
## How It Prevents Errors

### Three-Layer Defense

```
LAYER 1: TEMPLATE LOADING (Prevention)
├─ HARD GATE: Template MUST be loaded before creating document
├─ Write agent enforces Read() on template file
└─ HALT if template not loaded

LAYER 2: FORMAT VALIDATION (Detection)
├─ validate_document.py checks structure automatically
├─ Detects: missing TOC, wrong anchors, missing emojis
└─ BLOCKING errors prevent delivery

LAYER 3: DQI SCORING (Quality)
├─ extract_structure.py calculates quality score
├─ Target: Good band (75+)
└─ Must pass both validation AND DQI
```

### Error Detection Examples

```bash
# Missing TOC
$ python validate_document.py missing_toc.md
❌ INVALID
🚫 Blocking errors (1):
  - [missing_toc] Missing TABLE OF CONTENTS section

# Single-dash anchor
$ python validate_document.py single_dash.md
❌ INVALID
🚫 Blocking errors (1):
  - [toc_single_dash_anchor] TOC anchor uses single dash
    Auto-fixable: Yes (use --fix)

# Missing H2 emoji
$ python validate_document.py no_emoji.md
❌ INVALID
🚫 Blocking errors (1):
  - [missing_h2_emoji] H2 header missing emoji: "## 1. OVERVIEW"
    Fix: Add 📖 emoji after section number
```

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:decisions -->
## Files Created/Modified

| File | Action | Path |
|------|--------|------|
| `template_rules.json` | CREATED | `.opencode/skill/sk-doc/assets/` |
| `validate_document.py` | CREATED | `.opencode/skill/sk-doc/scripts/` |
| `write.md` | MODIFIED | `.opencode/agent/` |
| `architecture/README.md` | FIXED | `.opencode/skill/system-spec-kit/mcp_server/lib/` |
| `scripts/README.md` | FIXED | `.opencode/skill/system-spec-kit/mcp_server/` |

---

## Usage Instructions

### For Write Agent

1. Load template before creating any documentation
2. Copy skeleton headers verbatim (never reconstruct from memory)
3. Run `validate_document.py` before claiming completion
4. Fix any blocking errors
5. Run DQI scoring with `extract_structure.py`
6. Deliver only if both pass

### For Manual Validation

```bash
# Validate single file
python .opencode/skill/sk-doc/scripts/validate_document.py README.md

# Batch validate (exclude node_modules)
find .opencode/skill/system-spec-kit -name "README.md" -not -path "*/node_modules/*" \
  -exec python .opencode/skill/sk-doc/scripts/validate_document.py {} \;

# Auto-fix safe issues
python .opencode/skill/sk-doc/scripts/validate_document.py README.md --fix
```

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:limitations -->
## P1/P2 Completion (2026-02-03)

### TOC Emoji Auto-Fix Enhancement

The `validate_document.py` script was enhanced to auto-fix missing TOC emojis:

```bash
# Before: TOC entry missing emoji
- [1. OVERVIEW](#1--overview)

# After --fix: Emoji inserted from mapping
- [1. 📖 OVERVIEW](#1--overview)
```

**Implementation:** Enhanced `validate_toc()` function to generate fix values using regex substitution that inserts the mapped emoji after the section number.

### Test Suite Created

**Location:** `.opencode/skill/sk-doc/scripts/tests/`

| File | Purpose | Expected Result |
|------|---------|-----------------|
| `valid_readme.md` | Valid README with TOC, emojis | Exit 0 |
| `valid_skill.md` | Valid SKILL.md | Exit 0 |
| `missing_toc.md` | README without TOC | Exit 1, `missing_toc` |
| `single_dash_anchors.md` | Wrong anchor format | Exit 1, `toc_single_dash_anchor` |
| `missing_emojis.md` | H2 headers without emojis | Exit 1, `missing_h2_emoji` |
| `missing_sections.md` | Missing required section | Exit 1, `missing_required_section` |

**Test Runner:** `test_validator.py` with `--verbose` support

```bash
# Run all tests
python .opencode/skill/sk-doc/scripts/tests/test_validator.py --verbose

# Result: 6/6 tests passed
```

---

## Bug Fixes (2026-02-03)

### Multi-Fix Single Pass
**Issue:** When a single line had multiple issues (e.g., single-dash anchor AND missing emoji), running `--fix` only applied one fix per run, requiring multiple passes.

**Fix:** Rewrote `apply_fixes()` to iterate until no more fixes can be applied. After each fix round, it re-validates the content to get fresh error objects with updated line content.

```bash
# Before: Required 2 passes
python validate_document.py file.md --fix  # Fixes anchors
python validate_document.py file.md --fix  # Fixes emojis

# After: Single pass fixes all
python validate_document.py file.md --fix  # Fixes both
```

### Path Exclusions
**Issue:** Validator flagged auto-generated files (.pytest_cache), third-party READMEs (mcp-narsil), and intentionally minimal template placeholders.

**Fix:** Added exclusion patterns with `--no-exclude` override:

| Pattern Type | Examples | Reason |
|--------------|----------|--------|
| Auto-generated | `.pytest_cache`, `node_modules` | Not user documentation |
| Third-party | `mcp-narsil/mcp_server` | Different format conventions |
| Templates | `system-spec-kit/templates/` | Intentionally minimal placeholders |

```bash
# Skipped by default
python validate_document.py .pytest_cache/README.md
# ⏭️  SKIPPED: Excluded: matches pattern '.pytest_cache'

# Force validation with --no-exclude
python validate_document.py .pytest_cache/README.md --no-exclude
# ❌ INVALID: ...
```

### Updated Batch Results

| Status | Count | Notes |
|--------|-------|-------|
| ✅ VALID | 53 | All main project READMEs |
| ⏭️ SKIPPED | 19 | Auto-generated, third-party, templates |
| ❌ INVALID | 0 | None in main codebase |

---

## Future Enhancements

| Enhancement | Priority | Description |
|-------------|----------|-------------|
| Git hook integration | P3 | Pre-commit validation of markdown files |
| VS Code extension | P3 | Real-time validation in editor |

<!-- /ANCHOR:limitations -->

---

*Initial Implementation: 2026-02-02*
*P1/P2 Completion: 2026-02-03*
*Bug Fixes: 2026-02-03*
