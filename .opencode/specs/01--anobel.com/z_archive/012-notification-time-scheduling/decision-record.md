---
title: "Decision Record: Notification Time-Based Scheduling [013-notification-time-scheduling/decision-record]"
description: "Key architectural and implementation decisions for the time-based scheduling feature."
trigger_phrases:
  - "decision"
  - "record"
  - "notification"
  - "time"
  - "based"
  - "decision record"
  - "013"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Notification Time-Based Scheduling

Key architectural and implementation decisions for the time-based scheduling feature.

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Category**: Decision Record
- **Created**: 2025-12-29
- **Status**: Active
- **Participants**: Development Team

---
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:decisions -->
## 2. DECISIONS

### DEC-001: Use String Pattern Matching for Time Detection

**Date**: 2025-12-29
**Status**: Accepted

**Context**:
Need to determine if a date string includes a time component to decide which comparison mode to use.

**Decision**:
Use regex pattern matching on the raw attribute string: `/(\d{1,2}:\d{2})|([AP]M)|T\d{2}:/i`

**Rationale**:
- Cannot reliably detect from parsed Date object (midnight could be intentional)
- String pattern matching is unambiguous
- Handles all common Webflow date formats

**Alternatives Considered**:
1. Check if parsed Date has hours/minutes = 0 → Rejected: ambiguous (midnight is valid time)
2. Add separate boolean CMS field → Rejected: adds complexity for content managers
3. Always use exact time → Rejected: breaks backward compatibility

**Consequences**:
- ✅ Clear distinction between date-only and datetime
- ✅ No CMS changes required
- ⚠️ Depends on Webflow outputting time in attribute

---

### DEC-002: Dual-Mode Comparison (Backward Compatible)

**Date**: 2025-12-29
**Status**: Accepted

**Context**:
Existing alerts use date-only scheduling. New feature must not break them.

**Decision**:
Implement dual-mode comparison:
- If time detected → exact timestamp comparison
- If date only → midnight/end-of-day comparison (legacy)

**Rationale**:
- Zero impact on existing alerts
- Gradual adoption possible
- No migration required

**Alternatives Considered**:
1. Breaking change (all dates require time) → Rejected: disrupts existing content
2. Configuration flag to enable time mode → Rejected: unnecessary complexity

**Consequences**:
- ✅ Existing alerts continue working unchanged
- ✅ New alerts can use time when needed
- ⚠️ Slightly more complex code logic

---

### DEC-003: End Dates Without Time Use 23:59:59

**Date**: 2025-12-29
**Status**: Accepted

**Context**:
When end date is "December 29, 2025" (no time), should alert hide at midnight (start of day) or end of day?

**Decision**:
Use end of day (23:59:59.999) for date-only end dates.

**Rationale**:
- More intuitive: "end on Dec 29" means show all day
- Matches user expectation
- Consistent with how humans interpret "until date X"

**Alternatives Considered**:
1. Use midnight (00:00:00) → Rejected: would hide alert at START of end day
2. Use noon (12:00:00) → Rejected: arbitrary, confusing

**Consequences**:
- ✅ Intuitive behavior for content managers
- ✅ Alert visible for entire end date
- ✅ Matches existing behavior (current code compares dates at midnight level)

---

### DEC-004: No Separate Time Fields in CMS

**Date**: 2025-12-29
**Status**: Accepted

**Context**:
Could add separate `data-alert-start-time` and `data-alert-end-time` attributes.

**Decision**:
Use existing DateTime fields; rely on Webflow to output time in date string.

**Rationale**:
- Simpler CMS structure
- Fewer fields for content managers
- DateTime fields already support time

**Alternatives Considered**:
1. Add separate time fields → Rejected: doubles number of date-related fields
2. Use Unix timestamps → Rejected: not human-readable in CMS

**Consequences**:
- ✅ No CMS schema changes
- ✅ Simpler content management
- ⚠️ Depends on Webflow DateTime field configuration

---

### DEC-005: CDN Version Increment Strategy

**Date**: 2025-12-29
**Status**: Accepted

**Context**:
Need to ensure browsers load the updated script.

**Decision**:
Increment version from 1.1.09 to 1.1.10 in query string.

**Rationale**:
- Simple cache busting
- Maintains version history
- Easy rollback (just change version back)

**Consequences**:
- ✅ Guaranteed fresh script load
- ✅ Previous version remains available
- ✅ Clear version progression

---
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:open-questions -->
## 3. OPEN QUESTIONS

### Q1: Does Webflow Output Time in Attribute Bindings?

**Status**: Needs Verification

**Question**: When a CMS DateTime field has time enabled, does Webflow include the time in custom attribute bindings?

**Expected**: `data-alert-start="December 29, 2025 9:50 AM"`
**Current**: `data-alert-start="December 29, 2025"` (no time)

**Action**: User needs to verify in Webflow Designer and test with time-enabled field.

---
<!-- /ANCHOR:open-questions -->

<!-- ANCHOR:changelog -->
## 4. CHANGELOG

### 2025-12-29
- Initial decision record created
- Documented 5 key decisions
- Identified 1 open question
<!-- /ANCHOR:changelog -->
