---
title: "H2 Emoji Enforcement - QA Checklist [003-h2-emoji-enforcement/checklist]"
description: "1. Run all P0 checklist items"
trigger_phrases:
  - "emoji"
  - "enforcement"
  - "checklist"
  - "017"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# H2 Emoji Enforcement - QA Checklist

## Metadata

- **Category:** Checklist
- **Tags:** h2-emoji, template-enforcement, write-agent, validation
- **Priority:** P0
- **Type:** Implementation QA

---

<!-- ANCHOR:pre-impl -->
## P0: Critical - Must Pass

### Phase 1: Prevention (write.md)

- [x] CHK-P1-01 [P0] write.md has "COPY SKELETON" step in CORE WORKFLOW | Evidence: Lines 39-42 show step 6 with "COPY SKELETON" and "Copy ALL ## N. [emoji] TITLE headers exactly"
- [x] CHK-P1-02 [P0] write.md has "NEVER reconstruct" instruction | Evidence: Line 41 says "NEVER reconstruct headers from memory - copy/paste only"
- [x] CHK-P1-03 [P0] Template Alignment Checklist includes ALL H2 emoji validation | Evidence: Lines 95-98 show "H2 Header Validation (BLOCKING for template-based docs)" with 4 validation items
- [x] CHK-P1-04 [P0] Checklist marks H2 emoji as BLOCKING | Evidence: Line 95 says "BLOCKING for template-based docs" and line 97 says "reconstruction error = BLOCKING"
- [x] CHK-P1-05 [P0] Emoji mapping table added | Evidence: Lines 103-122 show "Standard Section Emoji Mapping" table with 17 section→emoji mappings
- [x] CHK-P1-06 [P0] Reconstruction anti-pattern added | Evidence: Lines 427-431 show "Never reconstruct headers from memory" as first anti-pattern with 4 bullet points

<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
### Phase 2: Detection (extract_structure.py)

- [x] CHK-P2-01 [P0] SECTION_EMOJIS constant added | Evidence: Lines 299-311 define SECTION_EMOJIS set with 📖, 🚀, 📁, ⚡, ⚙️, 💡, 🛠️, etc.
- [x] CHK-P2-02 [P0] EMOJI_REQUIRED_TYPES constant added | Evidence: Lines 314-315 define EMOJI_REQUIRED_TYPES = {'skill', 'readme', 'asset', 'reference'}
- [x] CHK-P2-03 [P0] check_h2_formatting returns 'error' for required types | Evidence: Lines 395-408 show severity = 'error' if requires_emoji else 'warning'
- [x] CHK-P2-04 [P0] REFERENCE_CHECKLIST includes h2_emoji check | Evidence: Line 657 shows ('h2_emoji', 'H2s have emoji', lambda...)
- [x] CHK-P2-05 [P0] Style checks run for all EMOJI_REQUIRED_TYPES | Evidence: Line 1118 shows "if doc_type in EMOJI_REQUIRED_TYPES:"

<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
### Testing

- [x] CHK-T-01 [P0] extract_structure.py flags missing emoji as error | Evidence: Test README.md returned style_issues with severity: 'error' for 3 H2 headers
- [x] CHK-T-02 [P0] Checklist fails for file with missing H2 emoji | Evidence: Test README.md returned checklist.passed=4, checklist.failed=2, pass_rate=66.7%

<!-- /ANCHOR:testing -->

---

## P1: High Priority - Required

<!-- ANCHOR:docs -->
### Phase 3: Documentation

- [x] CHK-P3-01 [P1] SKILL.md has document-type emoji requirements table | Evidence: Lines 547-560 show "H2 Emoji Enforcement by Document Type" table with 7 document types
- [x] CHK-P3-02 [P1] core_standards.md has H2 emoji violations section | Evidence: Lines 168-199 show "H2 Emoji Violations (BLOCKING)" section with violation table and prevention steps

<!-- /ANCHOR:docs -->

### Regression Testing

- [x] CHK-R-01 [P1] Existing compliant SKILL.md files pass | Evidence: sk-doc/SKILL.md returns DQI=99 (excellent), 0 style issues, 100% pass rate
- [x] CHK-R-02 [P1] Existing compliant README files pass | Evidence: install_scripts/README.md returns DQI=95 (excellent), 100% checklist pass rate

---

## P2: Medium Priority - Nice to Have

- [x] CHK-P2-06 [P2] Error message shows what character was found | Evidence: Test output shows "found: 'O' where emoji expected" for OVERVIEW header
- [x] CHK-P2-07 [P2] SECTION_EMOJIS is comprehensive | Evidence: Set includes 25+ emojis covering README, SKILL, Agent, Install guide, and common sections

---

<!-- ANCHOR:protocol -->
## Verification Protocol

### Before Claiming Complete

1. Run all P0 checklist items
2. Provide evidence for each item
3. Run extract_structure.py on test file with missing emoji
4. Verify error (not warning) is returned
5. Run on existing compliant files to verify no regression

### Evidence Format

```markdown
- [x] CHK-P1-01 [P0] write.md has "COPY SKELETON" step | Evidence: Lines 34-38 show step 6 with copy instruction
```

<!-- /ANCHOR:protocol -->

---

## Test Files

### Test Case 1: Missing Emoji (should fail)

```markdown
# Test README

> Test description

## 1. OVERVIEW

Content here.

## 2. QUICK START

Content here.
```

**Expected:** Checklist fails, style_issues contains 2 errors

### Test Case 2: Correct Format (should pass)

```markdown
# Test README

> Test description

## 1. OVERVIEW

Content here.

## 2. QUICK START

Content here.
```

**Expected:** Checklist passes, no style_issues errors
