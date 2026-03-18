---
title: "H2 Emoji Enforcement - Decision Record [003-h2-emoji-enforcement/decision-record]"
description: "This document records key architectural and implementation decisions for the H2 emoji enforcement feature."
trigger_phrases:
  - "emoji"
  - "enforcement"
  - "decision"
  - "record"
  - "decision record"
  - "017"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# H2 Emoji Enforcement - Decision Record

## Overview

This document records key architectural and implementation decisions for the H2 emoji enforcement feature.

---

<!-- ANCHOR:adr-001 -->
## Decision 1: Copy-First vs Validate-After

<!-- ANCHOR:adr-001-context -->
### Context

When creating documentation from templates, there are two approaches to ensure compliance:
1. **Copy-First:** Mandate copying template skeleton before adding content
2. **Validate-After:** Allow any creation method, validate at the end

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**Chosen: Copy-First with Validate-After as safety net**

<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Rationale

- Copy-First **prevents** errors by eliminating reconstruction
- Validate-After **catches** errors if they occur
- Using both provides defense in depth
- Copy-First is more reliable (can't forget what you copied)
- Validate-After alone still allows errors to be created

<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- write.md workflow must explicitly require skeleton copy
- Validation still runs as safety net
- AI must be trained to copy, not reconstruct

<!-- /ANCHOR:adr-001-consequences -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## Decision 2: Blocking vs Warning for Missing Emoji

<!-- ANCHOR:adr-002-context -->
### Context

When extract_structure.py detects a missing H2 emoji, it can:
1. **Warning:** Flag but allow document to pass
2. **Error (Blocking):** Fail the checklist, require fix

<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

**Chosen: Blocking (Error) for template-based documents**

<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Rationale

- User explicitly requested blocking enforcement
- Template-based documents have a clear standard to follow
- Warnings were ignored in the past (led to this issue)
- Blocking forces immediate correction
- Non-template documents (spec, knowledge) remain warning-only

<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- extract_structure.py must distinguish template-based vs other types
- EMOJI_REQUIRED_TYPES constant defines which types are blocking
- Existing non-compliant files will fail validation (intentional)

<!-- /ANCHOR:adr-002-consequences -->

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## Decision 3: Emoji Detection Method

<!-- ANCHOR:adr-003-context -->
### Context

Detecting if a character is an emoji can be done via:
1. **Unicode ranges:** Check if character is in emoji Unicode blocks
2. **Emoji library:** Use Python `emoji` package
3. **Explicit set:** Define known section emojis

<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision

**Chosen: Explicit set (SECTION_EMOJIS)**

<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Rationale

- We only use ~25 specific emojis in templates
- Explicit set is faster (O(1) lookup)
- No external dependency required
- More maintainable (add new emoji to set)
- Unicode ranges are complex and change with versions
- Emoji library adds dependency for simple check

<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- SECTION_EMOJIS constant must be maintained
- New section emojis must be added to set
- Unknown emojis will be flagged (feature, not bug)

<!-- /ANCHOR:adr-003-consequences -->

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## Decision 4: Template-Based Detection

<!-- ANCHOR:adr-004-context -->
### Context

How to determine if a document is "template-based" (and thus requires emoji):
1. **File path:** Check if in specific directories
2. **Document type:** Use existing type detection
3. **Content analysis:** Check for numbered H2 sections

<!-- /ANCHOR:adr-004-context -->

<!-- ANCHOR:adr-004-decision -->
### Decision

**Chosen: Document type (existing detection)**

<!-- /ANCHOR:adr-004-decision -->

<!-- ANCHOR:adr-004-alternatives -->
### Rationale

- Document type detection already exists in extract_structure.py
- Types skill, readme, asset, reference are template-based
- No new detection logic needed
- Consistent with existing validation approach

<!-- /ANCHOR:adr-004-alternatives -->

<!-- ANCHOR:adr-004-consequences -->
### Consequences

- EMOJI_REQUIRED_TYPES = {'skill', 'readme', 'asset', 'reference'}
- Other types (spec, knowledge, generic) remain optional
- Type detection must be accurate (already is)

<!-- /ANCHOR:adr-004-consequences -->

<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## Decision 5: Scope of Changes

<!-- ANCHOR:adr-005-context -->
### Context

The fix could be implemented in:
1. **write.md only:** Prevention layer
2. **extract_structure.py only:** Detection layer
3. **Both + documentation:** Full solution

<!-- /ANCHOR:adr-005-context -->

<!-- ANCHOR:adr-005-decision -->
### Decision

**Chosen: Both + documentation (full solution)**

<!-- /ANCHOR:adr-005-decision -->

<!-- ANCHOR:adr-005-alternatives -->
### Rationale

- Prevention alone doesn't catch errors if AI ignores instruction
- Detection alone doesn't prevent errors from being created
- Documentation ensures humans understand the requirement
- Defense in depth is more robust
- User explicitly requested script update

<!-- /ANCHOR:adr-005-alternatives -->

<!-- ANCHOR:adr-005-consequences -->
### Consequences

- Four files modified: write.md, extract_structure.py, SKILL.md, core_standards.md
- More comprehensive but more changes to review
- Better long-term maintainability

<!-- /ANCHOR:adr-005-consequences -->

<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## Decision 6: Emoji Mapping Location

<!-- ANCHOR:adr-006-context -->
### Context

The emoji mapping table could live in:
1. **write.md only:** Agent-specific
2. **SKILL.md only:** Skill-specific
3. **Both:** Redundant but accessible

<!-- /ANCHOR:adr-006-context -->

<!-- ANCHOR:adr-006-decision -->
### Decision

**Chosen: write.md (primary) with reference in SKILL.md**

<!-- /ANCHOR:adr-006-decision -->

<!-- ANCHOR:adr-006-alternatives -->
### Rationale

- write.md is where the agent needs the mapping
- SKILL.md can reference write.md for details
- Avoids duplication that could get out of sync
- Agent has immediate access during document creation

<!-- /ANCHOR:adr-006-alternatives -->

<!-- ANCHOR:adr-006-consequences -->
### Consequences

- write.md has the authoritative emoji mapping table
- SKILL.md has document-type requirements table (different purpose)
- Single source of truth for emoji → section mapping

<!-- /ANCHOR:adr-006-consequences -->

<!-- /ANCHOR:adr-006 -->

---

## Summary

| Decision | Choice | Key Reason |
|----------|--------|------------|
| Copy-First vs Validate-After | Both | Defense in depth |
| Blocking vs Warning | Blocking for template-based | User requirement, prevents ignored warnings |
| Emoji Detection | Explicit set | Simple, fast, no dependencies |
| Template-Based Detection | Document type | Existing infrastructure |
| Scope of Changes | Full solution | Comprehensive fix |
| Emoji Mapping Location | write.md primary | Agent needs it during creation |
