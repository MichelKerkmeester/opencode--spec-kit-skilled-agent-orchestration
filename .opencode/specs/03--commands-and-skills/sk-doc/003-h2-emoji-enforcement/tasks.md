---
title: "H2 Emoji Enforcement - Task Breakdown [003-h2-emoji-enforcement/tasks]"
description: "File: .opencode/agent/write.md"
trigger_phrases:
  - "emoji"
  - "enforcement"
  - "task"
  - "breakdown"
  - "tasks"
  - "017"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# H2 Emoji Enforcement - Task Breakdown

<!-- ANCHOR:notation -->
## Task Overview

| ID | Task | Phase | Priority | Status |
|----|------|-------|----------|--------|
| T1 | Update write.md CORE WORKFLOW | Phase 1 | P0 | ✅ Complete |
| T2 | Update write.md Template Alignment Checklist | Phase 1 | P0 | ✅ Complete |
| T3 | Add emoji mapping table to write.md | Phase 1 | P0 | ✅ Complete |
| T4 | Add reconstruction anti-pattern to write.md | Phase 1 | P0 | ✅ Complete |
| T5 | Add SECTION_EMOJIS constant to extract_structure.py | Phase 2 | P0 | ✅ Complete |
| T6 | Modify check_h2_formatting function | Phase 2 | P0 | ✅ Complete |
| T7 | Add h2_emoji to REFERENCE_CHECKLIST | Phase 2 | P0 | ✅ Complete |
| T8 | Expand style checks for template-based types | Phase 2 | P0 | ✅ Complete |
| T9 | Add emoji requirements table to SKILL.md | Phase 3 | P1 | ✅ Complete |
| T10 | Add H2 emoji violations to core_standards.md | Phase 3 | P1 | ✅ Complete |
| T11 | Test extract_structure.py with missing emoji | Testing | P0 | ✅ Complete |
| T12 | Test write agent creates compliant README | Testing | P1 | Deferred (requires manual test) |

<!-- /ANCHOR:notation -->

---

## Detailed Tasks

### T1: Update write.md CORE WORKFLOW

**File:** `.opencode/agent/write.md`
**Section:** 1. CORE WORKFLOW

**Action:** Split step 6 into two steps (6 and 7), renumber subsequent steps.

**Before:**
```markdown
6. **CREATE/IMPROVE** → Apply template structure exactly
7. **VALIDATE ALIGNMENT** → Compare output against template
```

**After:**
```markdown
6. **COPY SKELETON** → Copy template's H1/H2 header structure verbatim
   - Copy ALL ## N. [emoji] TITLE headers exactly as they appear
   - NEVER reconstruct headers from memory - copy/paste only
   - Include emojis, numbers, and capitalization exactly
7. **FILL CONTENT** → Add content under each copied header
8. **VALIDATE ALIGNMENT** → Compare output against template (see §2 Checklist)
```

**Acceptance:** Step 6 explicitly says "COPY" and "NEVER reconstruct"

---

### T2: Update write.md Template Alignment Checklist

**File:** `.opencode/agent/write.md`
**Section:** 2. TEMPLATE MAPPING → Template Alignment Checklist

**Action:** Add H2 emoji validation items to checklist.

**Add after existing Structure Alignment items:**
```markdown
H2 Header Validation (BLOCKING for template-based docs):
□ ALL H2 headers follow pattern: ## N. [emoji] TITLE
□ Each numbered section has its designated emoji
□ No H2 headers missing emojis (reconstruction error)
□ TOC entries include emojis matching section headers
```

**Acceptance:** Checklist explicitly mentions "ALL H2" and "BLOCKING"

---

### T3: Add emoji mapping table to write.md

**File:** `.opencode/agent/write.md`
**Section:** 2. TEMPLATE MAPPING (new subsection)

**Action:** Add emoji mapping table after Template Alignment Checklist.

**Content:**
```markdown
### Standard Section Emoji Mapping

| Section | Emoji | Example |
|---------|-------|---------|
| OVERVIEW | 📖 | ## 1. 📖 OVERVIEW |
| QUICK START | 🚀 | ## 2. 🚀 QUICK START |
| STRUCTURE | 📁 | ## 3. 📁 STRUCTURE |
| FEATURES | ⚡ | ## 4. ⚡ FEATURES |
| CONFIGURATION | ⚙️ | ## 5. ⚙️ CONFIGURATION |
| USAGE EXAMPLES | 💡 | ## 6. 💡 USAGE EXAMPLES |
| TROUBLESHOOTING | 🛠️ | ## 7. 🛠️ TROUBLESHOOTING |
| FAQ | ❓ | ## 8. ❓ FAQ |
| RELATED DOCUMENTS | 📚 | ## 9. 📚 RELATED DOCUMENTS |
| WHEN TO USE | 🎯 | ## 1. 🎯 WHEN TO USE |
| HOW IT WORKS | 🔍 | ## 3. 🔍 HOW IT WORKS |
| RULES | 📋 | ## 4. 📋 RULES |
```

**Acceptance:** Table provides quick reference for common sections

---

### T4: Add reconstruction anti-pattern to write.md

**File:** `.opencode/agent/write.md`
**Section:** 9. ANTI-PATTERNS

**Action:** Add new anti-pattern about header reconstruction.

**Content:**
```markdown
❌ **Never reconstruct headers from memory**
- COPY headers exactly from template - emojis, numbers, capitalization
- Reconstruction from memory leads to omission errors (e.g., missing emojis)
- If unsure, re-read the template and copy/paste the header line
- This is the #1 cause of template alignment failures
```

**Acceptance:** Anti-pattern explains the failure mode and prevention

---

### T5: Add SECTION_EMOJIS constant to extract_structure.py

**File:** `.opencode/skill/sk-doc/scripts/extract_structure.py`
**Location:** After SEMANTIC_EMOJIS constant (~line 295)

**Action:** Add emoji set and required types constant.

**Content:**
```python
# Standard section emojis for template-based documents
SECTION_EMOJIS = {
    # README sections
    '📖', '🚀', '📁', '⚡', '⚙️', '💡', '🛠️', '❓', '📚',
    # SKILL sections
    '🎯', '🧭', '🔍', '📋', '🏆', '🔌', '🔗',
    # Agent sections
    '🔄', '🚫',
    # Install guide sections
    '🤖', '✅', '📥',
    # Other common
    '📝', '💾', '⚠️', '🔀', '🏗️', '✍️', '🎨', '📄',
}

# Document types that require H2 emojis (blocking error if missing)
EMOJI_REQUIRED_TYPES = {'skill', 'readme', 'asset', 'reference'}
```

**Acceptance:** Constants defined and documented

---

### T6: Modify check_h2_formatting function

**File:** `.opencode/skill/sk-doc/scripts/extract_structure.py`
**Function:** check_h2_formatting (lines 378-423)

**Action:** Update to use SECTION_EMOJIS and return 'error' severity for required types.

**Key changes:**
1. Use SECTION_EMOJIS instead of Unicode range detection
2. Set severity based on EMOJI_REQUIRED_TYPES
3. Improve error message to show what was found

**Acceptance:** Function returns 'error' severity for skill/readme/asset/reference types

---

### T7: Add h2_emoji to REFERENCE_CHECKLIST

**File:** `.opencode/skill/sk-doc/scripts/extract_structure.py`
**Location:** REFERENCE_CHECKLIST (~line 639)

**Action:** Add h2_emoji check to reference checklist.

**Add:**
```python
('h2_emoji', 'H2s have emoji', lambda fm, h, c: all(heading['has_emoji'] for heading in h if heading['level'] == 2) if any(heading['level'] == 2 for heading in h) else True),
```

**Acceptance:** Reference files now checked for H2 emojis in checklist

---

### T8: Expand style checks for template-based types

**File:** `.opencode/skill/sk-doc/scripts/extract_structure.py`
**Location:** Main extraction function (~lines 1103-1109)

**Action:** Run check_h2_formatting for all EMOJI_REQUIRED_TYPES.

**Before:**
```python
if doc_type in ['skill', 'asset']:
    style_issues.extend(check_h2_formatting(headings, doc_type))
```

**After:**
```python
if doc_type in EMOJI_REQUIRED_TYPES:
    style_issues.extend(check_h2_formatting(headings, doc_type))
```

**Acceptance:** README and reference types now get H2 formatting checks

---

### T9: Add emoji requirements table to SKILL.md

**File:** `.opencode/skill/sk-doc/SKILL.md`
**Location:** After Emoji Usage Rules (~line 543)

**Action:** Add document-type emoji requirements table.

**Acceptance:** Table clearly shows which types require emojis and enforcement level

---

### T10: Add H2 emoji violations to core_standards.md

**File:** `.opencode/skill/sk-doc/references/core_standards.md`
**Location:** Section 5 (Common Violations)

**Action:** Add H2 emoji violations subsection.

**Acceptance:** Violations documented with severity and fix instructions

---

### T11: Test extract_structure.py with missing emoji

**Type:** Manual test

**Steps:**
1. Create test file with numbered H2 missing emoji
2. Run `python extract_structure.py test.md`
3. Verify checklist fails
4. Verify style_issues contains error (not warning)

**Acceptance:** Script correctly identifies and blocks missing emoji

---

### T12: Test write agent creates compliant README

**Type:** Integration test

**Steps:**
1. Request README creation using write agent
2. Verify agent copies skeleton first
3. Verify output has all H2 emojis
4. Run extract_structure.py to validate

**Acceptance:** Write agent produces compliant documentation
