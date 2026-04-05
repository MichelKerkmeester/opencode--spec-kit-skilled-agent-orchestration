# Deprecated Files Scan - system-spec-kit

**Scan Date:** 2026-01-16
**Scan Target:** `.opencode/skill/system-spec-kit/`
**Status:** Complete

---

## Summary

Found **8 file categories** requiring attention:
- 3 deprecated modules (still functional, marked for removal)
- 4 obsolete template files (superseded by level-based templates)
- 1 re-export wrapper set (intentional, not orphaned)

**Estimated cleanup impact:** ~2,000 LOC removal potential

---

## 1. DEPRECATED MODULES (STILL FUNCTIONAL)

### lib/complexity/ - Complexity Detection System
**Status:** DEPRECATED (marked @deprecated in code)
**Evidence:** JSDoc tags + comment blocks in features.js, marker-parser.js
**Current Usage:** 2 scripts still reference it (expand-template.js, detect-complexity.js)

**Files:**
```
FILE: .opencode/skill/system-spec-kit/lib/complexity/features.js
TYPE: deprecated
EVIDENCE: @deprecated JSDoc tag (line 7-17): "COMPLEXITY_GATE DEPRECATION NOTICE"
ACTION: REVIEW

FILE: .opencode/skill/system-spec-kit/lib/complexity/detector.js
TYPE: deprecated
EVIDENCE: Used by deprecated expand-template.js script
ACTION: REVIEW

FILE: .opencode/skill/system-spec-kit/lib/complexity/index.js
TYPE: deprecated
EVIDENCE: Exports deprecated complexity module
ACTION: REVIEW

FILE: .opencode/skill/system-spec-kit/lib/complexity/classifier.js
TYPE: deprecated
EVIDENCE: Part of deprecated complexity system
ACTION: REVIEW

FILE: .opencode/skill/system-spec-kit/lib/complexity/scorers/research.js
FILE: .opencode/skill/system-spec-kit/lib/complexity/scorers/multi-agent.js
FILE: .opencode/skill/system-spec-kit/lib/complexity/scorers/scope.js
FILE: .opencode/skill/system-spec-kit/lib/complexity/scorers/coordination.js
FILE: .opencode/skill/system-spec-kit/lib/complexity/scorers/risk.js
TYPE: deprecated
EVIDENCE: Part of deprecated complexity scoring system
ACTION: REVIEW
```

**Reason for deprecation:**
Per `lib/complexity/features.js` (lines 7-17):
> "As of the level-based template architecture:
> - Level folders (level_1/, level_2/, level_3/) now contain pre-expanded templates
> - Templates no longer use COMPLEXITY_GATE markers for conditional expansion
> - The templatePath fields have been removed (templates/complexity/ folder is obsolete)"

**Dependencies:**
- `scripts/expand-template.js` (uses `../lib/expansion/preprocessor`)
- `scripts/detect-complexity.js` (uses `../lib/complexity/detector`)
- `scripts/create-spec-folder.sh` (calls detect-complexity.js)
- Documentation references in `references/templates/complexity_guide.md`

**Replacement:** Level-based templates in `templates/level_1/`, `templates/level_2/`, `templates/level_3/`, `templates/level_3+/`

---

### lib/expansion/ - Template Expansion System
**Status:** DEPRECATED (marked @deprecated in code)
**Evidence:** @deprecated tags in marker-parser.js (line 19-23), user-stories.js (line 199-202)

**Files:**
```
FILE: .opencode/skill/system-spec-kit/lib/expansion/marker-parser.js
TYPE: deprecated
EVIDENCE: @deprecated JSDoc tag (line 19-23): "COMPLEXITY_GATE markers are deprecated as of Spec 069/071"
ACTION: REVIEW

FILE: .opencode/skill/system-spec-kit/lib/expansion/preprocessor.js
TYPE: deprecated
EVIDENCE: Used by deprecated expand-template.js script
ACTION: REVIEW

FILE: .opencode/skill/system-spec-kit/lib/expansion/index.js
TYPE: deprecated
EVIDENCE: Exports deprecated expansion module
ACTION: REVIEW

FILE: .opencode/skill/system-spec-kit/lib/expansion/generators/checklist-items.js
FILE: .opencode/skill/system-spec-kit/lib/expansion/generators/user-stories.js
FILE: .opencode/skill/system-spec-kit/lib/expansion/generators/phases.js
TYPE: deprecated
EVIDENCE: Part of deprecated template expansion system
ACTION: REVIEW
```

**Reason for deprecation:**
Per `lib/expansion/marker-parser.js` (lines 19-23):
> "Level folders now contain pre-expanded templates. This module is retained for backward compatibility with existing templates that still use COMPLEXITY_GATE syntax."

**Dependencies:**
- `scripts/expand-template.js` (main consumer)
- Only 1 file imports from lib/expansion

---

### scripts/expand-template.js + scripts/detect-complexity.js
**Status:** DEPRECATED (functionality superseded)
**Evidence:** Only referenced in documentation and create-spec-folder.sh (optional usage)

**Files:**
```
FILE: .opencode/skill/system-spec-kit/scripts/expand-template.js
TYPE: deprecated
EVIDENCE: Uses deprecated lib/expansion module; references obsolete templates/complexity/
ACTION: DELETE

FILE: .opencode/skill/system-spec-kit/scripts/detect-complexity.js
TYPE: deprecated
EVIDENCE: Uses deprecated lib/complexity module; optional feature in create-spec-folder.sh
ACTION: DELETE
```

**References:**
- `references/templates/complexity_guide.md` (documentation only)
- `scripts/create-spec-folder.sh` (optional, with fallback)
- `SKILL.md` (example usage)
- `assets/complexity_decision_matrix.md` (documentation)

**Impact of removal:**
- Create-spec-folder.sh has fallback behavior if scripts missing
- Documentation references can be removed or marked as legacy
- No breaking changes to core functionality

---

## 2. OBSOLETE TEMPLATE FILES

### templates/complexity/ - Old Feature Templates
**Status:** OBSOLETE (superseded by level-based templates)
**Evidence:** Referenced only in deprecated complexity_guide.md

**Files:**
```
FILE: .opencode/skill/system-spec-kit/templates/complexity/ai-protocol.md
TYPE: obsolete
EVIDENCE: Superseded by level_3+/ templates; no code references
ACTION: DELETE

FILE: .opencode/skill/system-spec-kit/templates/complexity/dependency-graph.md
TYPE: obsolete
EVIDENCE: Superseded by level_2+/ templates; no code references
ACTION: DELETE

FILE: .opencode/skill/system-spec-kit/templates/complexity/effort-estimation.md
TYPE: obsolete
EVIDENCE: Superseded by level_2+/ templates; no code references
ACTION: DELETE

FILE: .opencode/skill/system-spec-kit/templates/complexity/extended-checklist.md
TYPE: obsolete
EVIDENCE: Superseded by level_3+/ templates; no code references
ACTION: DELETE
```

**Replacement:** Content integrated into level-specific templates

---

## 3. RE-EXPORT WRAPPERS (INTENTIONAL, NOT ORPHANED)

These files are **NOT orphaned** - they're intentional compatibility shims:

```
FILE: .opencode/skill/system-spec-kit/scripts/lib/retry-manager.js
TYPE: re-export wrapper
EVIDENCE: Exports from ../../mcp_server/lib/providers/retry-manager.js (canonical source)
ACTION: KEEP

FILE: .opencode/skill/system-spec-kit/scripts/lib/embeddings.js
TYPE: re-export wrapper
EVIDENCE: Exports from ../../shared/embeddings.js (canonical source)
ACTION: KEEP

FILE: .opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.js
TYPE: re-export wrapper
EVIDENCE: Likely exports from ../../shared/trigger-extractor.js
ACTION: KEEP
```

**Purpose:** Allow scripts to use consistent import paths while consolidating implementation

---

## 4. FILES MARKED AS DELETED (GIT STATUS)

These were already deleted in working tree but staged for commit:

```
FILE: .opencode/skill/system-spec-kit/database/context-index__voyage__voyage-3.5__1024.sqlite
TYPE: deleted
EVIDENCE: Git status shows 'D' flag
ACTION: Already handled (commit pending)

FILE: .opencode/skill/system-spec-kit/mcp_server/lib/confidence-tracker.js
TYPE: moved/reorganized
EVIDENCE: Git status shows 'D' flag but file exists at mcp_server/lib/scoring/confidence-tracker.js
ACTION: Verify git properly tracked the move

FILE: .opencode/skill/system-spec-kit/mcp_server/lib/importance-tiers.js
TYPE: moved/reorganized
EVIDENCE: Git status shows 'D' flag but file exists at mcp_server/lib/scoring/importance-tiers.js
ACTION: Verify git properly tracked the move
```

**Note:** Git status shows these as deleted but they actually moved to new locations:
- Old: `mcp_server/lib/confidence-tracker.js` → New: `mcp_server/lib/scoring/confidence-tracker.js`
- Old: `mcp_server/lib/importance-tiers.js` → New: `mcp_server/lib/scoring/importance-tiers.js`

**References still point to old paths:**
- `mcp_server/README.md` references `scoring/confidence-tracker.js` (correct path now)
- `mcp_server/lib/README.md` references old path structure
- Several files import from scoring/ subfolder (correct)

---

## 5. TEST FILES (ACTIVE, NOT DEPRECATED)

These test files are **active** and should be kept:

```
FILE: .opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js
FILE: .opencode/skill/system-spec-kit/scripts/tests/test-embeddings-factory.js
FILE: .opencode/skill/system-spec-kit/mcp_server/tests/summary-generator.test.js
FILE: .opencode/skill/system-spec-kit/mcp_server/tests/co-activation.test.js
FILE: .opencode/skill/system-spec-kit/mcp_server/tests/working-memory.test.js
FILE: .opencode/skill/system-spec-kit/mcp_server/tests/modularization.test.js
FILE: .opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.test.js
FILE: .opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.test.js
TYPE: test file
EVIDENCE: Active test suites for MCP server features
ACTION: KEEP
```

---

## RECOMMENDATIONS

### High Priority (Safe to Delete)

1. **Delete obsolete template folder:**
   ```bash
   rm -rf .opencode/skill/system-spec-kit/templates/complexity/
   ```

2. **Delete deprecated scripts:**
   ```bash
   rm .opencode/skill/system-spec-kit/scripts/expand-template.js
   rm .opencode/skill/system-spec-kit/scripts/detect-complexity.js
   ```

3. **Update create-spec-folder.sh:**
   - Remove optional calls to detect-complexity.js and expand-template.js
   - Or add clear "DEPRECATED" warnings if keeping for backward compat

### Medium Priority (Review Before Delete)

4. **Remove deprecated lib modules:**
   ```bash
   rm -rf .opencode/skill/system-spec-kit/lib/complexity/
   rm -rf .opencode/skill/system-spec-kit/lib/expansion/
   ```
   - First verify no external tools/workflows depend on these
   - Estimated removal: ~1,500 LOC

5. **Clean up documentation:**
   - Remove or mark as "LEGACY" in `references/templates/complexity_guide.md`
   - Update `SKILL.md` to remove detect-complexity.js examples
   - Update `assets/complexity_decision_matrix.md`

### Low Priority (Verify Git Tracking)

6. **Confirm file moves were properly tracked:**
   ```bash
   git status
   # Verify these show as renamed (R) not deleted (D):
   # - confidence-tracker.js
   # - importance-tiers.js
   ```

7. **Update documentation references:**
   - `mcp_server/lib/README.md` - Update old import paths
   - Any other files referencing old locations

---

## IMPACT ANALYSIS

### Lines of Code Reduction
- `lib/complexity/`: ~800 LOC
- `lib/expansion/`: ~700 LOC
- `scripts/expand-template.js`: ~300 LOC
- `scripts/detect-complexity.js`: ~200 LOC
- `templates/complexity/`: ~100 LOC
- **Total:** ~2,100 LOC removal

### Breaking Changes
- **None** if scripts/create-spec-folder.sh properly handles missing scripts
- **None** if no external tools call expand-template.js or detect-complexity.js directly
- Documentation updates needed but non-breaking

### Maintenance Reduction
- Removes 2 deprecated CLIs from support surface
- Eliminates confusion about which template system to use
- Reduces cognitive load (one way to do things, not two)

---

## VERIFICATION STEPS

Before deleting deprecated modules:

1. **Search for external dependencies:**
   ```bash
   grep -r "expand-template\|detect-complexity" ../../../ --exclude-dir=.opencode
   ```

2. **Test create-spec-folder.sh without deprecated scripts:**
   ```bash
   mv scripts/expand-template.js scripts/expand-template.js.bak
   mv scripts/detect-complexity.js scripts/detect-complexity.js.bak
   ./scripts/create-spec-folder.sh --level 2 test-folder
   ```

3. **Verify level-based templates cover all use cases:**
   - Compare templates/level_N/ with old templates/complexity/
   - Ensure no features lost in migration

---

## NOTES

- Node_modules files excluded from scan (not relevant)
- All @deprecated tags properly documented with reason
- Re-export wrappers (scripts/lib/*.js) are intentional, not duplicates
- Test files are active and should not be removed
- Git-tracked file moves need verification (confidence-tracker, importance-tiers)
