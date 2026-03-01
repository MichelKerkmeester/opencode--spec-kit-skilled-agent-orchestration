---
title: "Checklist: Zero-Tolerance Documentation Formatting [004-style-enforcement/checklist]"
description: "python -c \"import json; json.load(open('.opencode/skill/sk-doc/assets/template_rules.json'))\""
trigger_phrases:
  - "checklist"
  - "zero"
  - "tolerance"
  - "documentation"
  - "formatting"
  - "018"
  - "style"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Checklist: Zero-Tolerance Documentation Formatting

> Quality gates and verification items for implementation.

---

<!-- ANCHOR:pre-impl -->
## P0: Critical Items (Must Complete)

### Template Rules File
- [x] `template_rules.json` created at correct location
- [x] All document types defined (readme, skill, reference, asset, agent)
- [x] All section emojis mapped correctly
- [x] JSON is valid (parseable without errors)
- [x] Severity levels defined (blocking, warning, info)

### Validation Script
- [x] `validate_document.py` created at correct location
- [x] Loads `template_rules.json` successfully
- [x] Detects missing TOC section
- [x] Detects single-dash TOC anchors (should be double-dash)
- [x] Detects missing H2 emojis
- [x] Detects missing required sections
- [x] Returns exit code 0 for valid documents
- [x] Returns exit code 1 for documents with blocking errors
- [x] Returns exit code 2 for file not found / parse errors
- [x] JSON output mode (`--json`) works correctly
- [x] Document type detection works (from path or content)

### Testing
- [x] Validator passes on recently-fixed READMEs
- [x] Validator catches known-bad patterns (3 files found, fixed)
- [x] No false positives on valid documents
- [x] Performance acceptable (<1s per file)

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## P1: High Priority (Should Complete)

### Auto-Fix Capability
- [x] `--fix` flag implemented
- [x] `--dry-run` flag shows changes without modifying
- [x] Fixes single-dash → double-dash in TOC anchors
- [x] Adds missing H2 emojis (when section name matches mapping)
- [x] Adds missing TOC emojis (when section name matches mapping) - Enhanced 2026-02-03
- [x] Does NOT auto-fix content-requiring issues

### Write Agent Updates
- [x] Section 1 (CORE WORKFLOW) includes validation gates
- [x] HARD GATE terminology used for template loading
- [x] Script command documented in workflow
- [x] Scripts table includes validate_document.py

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:docs -->
## P2: Medium Priority (Nice to Have)

### SKILL.md Updates
- [x] Section 4 (RULES) includes validation rules (ALWAYS rule #9)
- [x] ALWAYS/NEVER patterns for validation
- [x] Script documented in integration table (line 668)

### Test Suite
- [x] Test files created for each error type (6 files: valid_readme, valid_skill, missing_toc, single_dash_anchors, missing_emojis, missing_sections)
- [x] Automated test runner works (test_validator.py with --verbose support)
- [x] All tests pass (6/6 - verified 2026-02-03)

---

## Bug Fixes (2026-02-03)

### Multi-Fix Single Pass
- [x] `apply_fixes()` iterates until no more fixes can be applied
- [x] Re-validates content after each fix round for fresh error objects
- [x] Single `--fix` run now handles all fixable issues on same line

### Path Exclusions
- [x] Added `EXCLUDED_PATH_PATTERNS` for auto-generated dirs (.pytest_cache, node_modules, etc.)
- [x] Added `THIRD_PARTY_PATTERNS` for third-party code (mcp-narsil/mcp_server)
- [x] Added `TEMPLATE_PATTERNS` for intentionally minimal templates
- [x] Added `--no-exclude` CLI flag to force validation
- [x] Skipped files show reason and hint to use --no-exclude
- [x] Test suite still passes after changes (6/6)

### Updated Results
- [x] 53 READMEs VALID
- [x] 19 READMEs SKIPPED (auto-generated, third-party, templates)
- [x] 0 READMEs INVALID in main codebase

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:protocol -->
## Verification Commands

```bash
# Verify template_rules.json is valid JSON
python -c "import json; json.load(open('.opencode/skill/sk-doc/assets/template_rules.json'))"

# Test validator on a valid README
python .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/README.md --json

# Test validator on multiple READMEs
find .opencode/skill/system-spec-kit -name "README.md" -exec python .opencode/skill/sk-doc/scripts/validate_document.py {} --json \;

# Run automated test suite (RECOMMENDED)
python .opencode/skill/sk-doc/scripts/tests/test_validator.py --verbose
```

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:summary -->
## Success Metrics

| Metric | Target | Verification |
|--------|--------|--------------|
| Validator exit code accuracy | 100% | Test suite passes |
| False positive rate | <5% | Manual review of 20 READMEs |
| Auto-fix success rate | >90% | Test fixable issues |
| Write agent compliance | 100% | Manual verification |

<!-- /ANCHOR:summary -->
