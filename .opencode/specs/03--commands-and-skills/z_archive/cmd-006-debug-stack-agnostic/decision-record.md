---
title: "Decision Record: Make Debug Command Stack-Agnostic [006-debug-stack-agnostic/decision-record]"
description: "The /spec_kit:debug command was analyzed for technology stack bias. The command itself is reasonably generic, but its references point to frontend-specific debugging materials."
trigger_phrases:
  - "decision"
  - "record"
  - "make"
  - "debug"
  - "command"
  - "decision record"
  - "006"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Decision Record: Make Debug Command Stack-Agnostic

<!-- ANCHOR:adr-001 -->
<!-- ANCHOR:adr-001-context -->
## Context

The `/spec_kit:debug` command was analyzed for technology stack bias. The command itself is reasonably generic, but its references point to frontend-specific debugging materials.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
## Decision 1: No Stack Awareness

### Question
Should the debug command detect or ask about technology stack?

### Options Considered

| Option | Approach |
|--------|----------|
| A) Auto-detect stack | Analyze file extensions, error patterns |
| B) Ask user | Present stack selection question |
| C) Template field | Add Technology Stack to debug-delegation.md |
| D) No awareness | Command is inherently universal, sub-agent adapts |

### Decision
**Option D: No stack awareness**

### Rationale
- User explicitly requested no detection logic
- Sub-agent naturally adapts from error messages, file extensions, and code snippets
- Simpler implementation with same effectiveness
- No additional user interaction required
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-002 -->
<!-- ANCHOR:adr-002-decision -->
## Decision 2: Preserve Frontend Resources

### Question
What to do with existing frontend-specific debugging resources?

### Options Considered

| Option | Approach |
|--------|----------|
| A) Remove | Delete frontend-specific files |
| B) Replace | Overwrite with universal content |
| C) Supplement | Add universal, keep frontend as supplementary |

### Decision
**Option C: Supplement**

### Rationale
- Frontend debugging resources are valuable and mature
- Universal methodology provides baseline for all stacks
- Frontend-specific guide remains available for specialized needs
- No wasted work on existing content
<!-- /ANCHOR:adr-002-decision -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
<!-- ANCHOR:adr-003-decision -->
## Decision 3: Minimal Changes

### Question
How extensive should the changes be?

### Options Considered

| Option | Scope |
|--------|-------|
| A) Comprehensive | Rewrite debug command, add phases, create multiple docs |
| B) Moderate | Add stack detection, update templates, create methodology |
| C) Minimal | Remove frontend-specific names, update references, create methodology |

### Decision
**Option C: Minimal (~108 lines)**

### Rationale
- User requested minimal logic
- Sub-agent prompt is already generic (no changes needed)
- Only references and tool names have frontend bias
- Universal methodology document is the main addition
<!-- /ANCHOR:adr-003-decision -->
<!-- /ANCHOR:adr-003 -->
<!-- /ANCHOR:adr-001 -->

---

## Summary

| Decision | Choice |
|----------|--------|
| Stack awareness | None - inherently universal |
| Frontend resources | Preserve as supplementary |
| Change scope | Minimal (~108 lines) |

The debug command will work for any stack because the sub-agent adapts based on context (error messages, file extensions, code). No detection or user questions needed.
