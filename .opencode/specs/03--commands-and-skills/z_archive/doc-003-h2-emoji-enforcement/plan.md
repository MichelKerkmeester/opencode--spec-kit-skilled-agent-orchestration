---
title: "H2 Emoji Enforcement - Implementation Plan [003-h2-emoji-enforcement/plan]"
description: "This plan implements a \"Copy-First, Validate-All\" approach to prevent H2 emoji omission errors in template-based documentation."
trigger_phrases:
  - "emoji"
  - "enforcement"
  - "implementation"
  - "plan"
  - "017"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# H2 Emoji Enforcement - Implementation Plan

<!-- ANCHOR:summary -->
## Overview

This plan implements a "Copy-First, Validate-All" approach to prevent H2 emoji omission errors in template-based documentation.

<!-- /ANCHOR:summary -->

---

## Phase 1: Prevention Layer (write.md)

**Goal:** Eliminate reconstruction errors by mandating skeleton copy before content.

### 1.1 Update CORE WORKFLOW Section

**Current step 6:**
```
6. **CREATE/IMPROVE** → Apply template structure exactly
```

**New steps 6-7:**
```
6. **COPY SKELETON** → Copy template's H1/H2 header structure verbatim
   - Copy ALL ## N. [emoji] TITLE headers exactly as they appear
   - NEVER reconstruct headers from memory - copy/paste only
   - Include emojis, numbers, and capitalization exactly
7. **FILL CONTENT** → Add content under each copied header
```

### 1.2 Update Template Alignment Checklist

**Add new section:**
```markdown
H2 Header Validation (BLOCKING):
□ ALL H2 headers follow pattern: ## N. [emoji] TITLE
□ Each section number has its designated emoji (see mapping below)
□ No H2 headers missing emojis (common reconstruction error)
□ TOC entries include emojis matching their section headers
□ Emojis match the standard mapping for document type
```

### 1.3 Add Emoji Mapping Table

**Add after checklist:**
```markdown
### Standard Section Emoji Mapping

| Section | Emoji | Pattern |
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
```

### 1.4 Add Anti-Pattern

**Add to ANTI-PATTERNS section:**
```markdown
❌ **Never reconstruct headers from memory**
- COPY headers exactly from template - emojis, numbers, capitalization
- Reconstruction from memory leads to omission errors (e.g., missing emojis)
- If unsure, re-read the template and copy/paste the header line
- This is the #1 cause of template alignment failures
```

---

## Phase 2: Detection Layer (extract_structure.py)

**Goal:** Make missing H2 emoji a blocking error for template-based documents.

### 2.1 Add SECTION_EMOJIS Constant

**Add after SEMANTIC_EMOJIS (line ~295):**
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

# Document types that require H2 emojis (blocking)
EMOJI_REQUIRED_TYPES = {'skill', 'readme', 'asset', 'reference'}
```

### 2.2 Modify check_h2_formatting Function

**Update function (lines 378-423):**
```python
def check_h2_formatting(headings: List[Dict], doc_type: str) -> List[Dict[str, Any]]:
    """Check H2 formatting: number + emoji + ALL CAPS."""
    issues = []

    # Determine if emoji is required (blocking) or optional (warning)
    emoji_required = doc_type in EMOJI_REQUIRED_TYPES
    severity = 'error' if emoji_required else 'warning'

    for h in headings:
        if h['level'] != 2:
            continue

        text = h['text']

        # Check for number prefix (for numbered sections)
        has_number = bool(re.match(r'^\d+\.', text))

        # If numbered, check for emoji
        if has_number:
            # Extract character after "N. "
            match = re.match(r'^\d+\.\s*(.)', text)
            if match:
                first_char = match.group(1)
                has_valid_emoji = first_char in SECTION_EMOJIS

                if not has_valid_emoji:
                    issues.append({
                        'type': 'h2_missing_emoji',
                        'line': h['line'],
                        'text': f"H2 '{text}' missing emoji after number (found: '{first_char}')",
                        'severity': severity
                    })

        # Check for ALL CAPS (extract text after number and emoji)
        section_text = re.sub(r'^\d+\.\s*', '', text)  # Remove number
        # Remove emoji (check first char)
        if section_text and section_text[0] in SECTION_EMOJIS:
            section_text = section_text[1:].strip()

        if section_text and not section_text.isupper():
            issues.append({
                'type': 'h2_not_caps',
                'line': h['line'],
                'text': f"H2 section name '{section_text}' should be ALL CAPS",
                'severity': 'warning'
            })

    return issues
```

### 2.3 Update Checklists

**Add h2_emoji to REFERENCE_CHECKLIST:**
```python
REFERENCE_CHECKLIST = [
    ('has_h1_title', 'Has H1 title', ...),
    ('has_intro', 'Has introduction paragraph', ...),
    ('h2_numbered', 'H2s have number prefix', ...),
    ('h2_emoji', 'H2s have emoji', lambda fm, h, c: all(heading['has_emoji'] for heading in h if heading['level'] == 2) if any(heading['level'] == 2 for heading in h) else True),  # ADD THIS
    ('no_placeholders', 'No placeholder markers', ...),
    ('has_depth', 'Has substantial content (>200 words)', ...),
]
```

### 2.4 Expand Style Checks

**Update main extraction (lines 1103-1109):**
```python
# Run style checks (for template-based types)
style_issues = []
if doc_type in EMOJI_REQUIRED_TYPES:
    style_issues.extend(check_h2_formatting(headings, doc_type))
    style_issues.extend(check_section_dividers(content, headings))
if doc_type == 'skill':
    style_issues.extend(check_h3_emoji_usage(headings, content))
```

---

## Phase 3: Documentation Layer

**Goal:** Clearly document emoji requirements per document type.

### 3.1 Update sk-doc SKILL.md

**Add after Emoji Usage Rules table (line ~543):**
```markdown
### H2 Emoji Requirements by Document Type

| Document Type | H2 Emoji | Enforcement | Notes |
|---------------|----------|-------------|-------|
| SKILL.md | REQUIRED | Blocking | All sections must have emoji |
| README.md (template-based) | REQUIRED | Blocking | When using readme_template.md |
| Reference files | REQUIRED | Blocking | Follow skill_reference_template.md |
| Asset files | REQUIRED | Blocking | Follow skill_asset_template.md |
| Install guides | REQUIRED | Blocking | Follow install_guide_template.md |
| Knowledge files | OPTIONAL | Warning | Recommended for scannability |
| Spec files | OPTIONAL | None | Not enforced |
| Command files | SEMANTIC ONLY | Warning | Only 🚨 🔒 ✅ ❌ ⚠️ allowed |

**Template-based detection:** Document has numbered H2 sections (## 1., ## 2., etc.)
```

### 3.2 Update core_standards.md

**Add to Section 5 (Common Violations):**
```markdown
### H2 Emoji Violations

| Type | Violation | Severity | Fix |
|------|-----------|----------|-----|
| SKILL | H2 missing emoji | **BLOCKING** | Add required emoji per section |
| README (template-based) | H2 missing emoji | **BLOCKING** | Add emoji from readme_template.md |
| Reference | H2 missing emoji | **BLOCKING** | Add emoji per skill_reference_template.md |
| Asset | H2 missing emoji | **BLOCKING** | Add emoji per skill_asset_template.md |
| Knowledge | H2 missing emoji | Warning | Recommended but not required |

**Detection:** `extract_structure.py` checks all numbered H2 headers for emoji presence.

**Common cause:** Reconstructing headers from memory instead of copying from template.

**Prevention:** Always copy the template skeleton first, then fill in content.
```

---

<!-- ANCHOR:phases -->
## Implementation Order

| Order | Phase | File | Priority | Est. LOC |
|-------|-------|------|----------|----------|
| 1 | Phase 1 | write.md | P0 | ~50 |
| 2 | Phase 2 | extract_structure.py | P0 | ~40 |
| 3 | Phase 3 | SKILL.md | P1 | ~20 |
| 4 | Phase 3 | core_standards.md | P1 | ~30 |

**Total estimated changes:** ~140 LOC

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:rollback -->
## Rollback Plan

If issues arise:
1. Revert write.md to previous version
2. Change `severity: 'error'` back to `severity: 'warning'` in extract_structure.py
3. Remove new checklist items

All changes are additive and can be reverted independently.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:testing -->
## Testing Plan

1. **Unit test:** Run extract_structure.py on file with missing H2 emoji
   - Expected: Checklist fails, style_issues contains error

2. **Integration test:** Create README using write agent
   - Expected: Agent copies skeleton first, validates emojis before delivery

3. **Regression test:** Run extract_structure.py on existing compliant files
   - Expected: No new failures

<!-- /ANCHOR:testing -->
