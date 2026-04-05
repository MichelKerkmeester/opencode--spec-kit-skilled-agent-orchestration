---
title: "Decision [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/032-system-health-audit/decision-record]"
description: "Date: 2025-12-25"
trigger_phrases:
  - "decision"
  - "record"
  - "system"
  - "health"
  - "audit"
  - "decision record"
  - "032"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record - System Health Audit

## DR-001: Decay Formula Resolution

**Date:** 2025-12-25  
**Status:** Accepted  
**Decision:** Update documentation to match code

### Context
- Docs said: "90-day half-life: decay = 0.5^(days/90)"
- Code does: "Exponential decay: decay = e^(-days/90)" (~62-day half-life)

### Options Considered
| Option | Pros | Cons |
|--------|------|------|
| Fix code | Matches user expectations | Changes rankings |
| Fix docs | No behavior change | Users relearn |

### Decision
**Fix documentation** - The exponential decay is mathematically valid. Changing code would affect existing search rankings.

### Outcome
Updated SKILL.md with correct formula and decay table.

---

## DR-002: Promotion Tier Resolution

**Date:** 2025-12-25  
**Status:** Accepted  
**Decision:** Change code to promote to "critical" tier

### Context
- Docs said: Promote to "critical" tier
- Code did: Promote to "constitutional" tier

### Options Considered
| Option | Behavior |
|--------|----------|
| Keep constitutional | 3x boost, always surfaces |
| Change to critical | 2x boost, relevant searches only |

### Decision
**Change to critical** - Constitutional is too privileged for auto-promotion. Should be reserved for fundamental rules.

### Outcome
Updated confidence-tracker.js to promote to "critical" tier.

---

## DR-003: MCP Path Portability

**Date:** 2025-12-25  
**Status:** Accepted  
**Decision:** Use relative paths and environment variables

### Context
opencode.json had hardcoded absolute paths like `/Users/michelkerkmeester/...`

### Options Considered
| Option | Example |
|--------|---------|
| Relative paths | `./mcp_server/...` |
| Environment vars | `${HOME}/.local/bin/...` |
| Config override | `opencode.local.json` |

### Decision
**Combination approach:**
- Relative paths for project-local servers
- `${HOME}` for user-local binaries
- Documentation for external servers

### Outcome
Updated opencode.json with portable paths.

---

## DR-004: Gate 4 Option Labels

**Date:** 2025-12-25  
**Status:** Accepted  
**Decision:** Standardize on A/B/C/D format

### Context
- AGENTS.md used: A/B/C/D
- SKILL.md used: [1]/[2]/[all]/[skip]

### Decision
**Use A/B/C/D everywhere** - Alphabetic is clearer and matches AGENTS.md (source of truth for gates).

### Outcome
Updated SKILL.md to use A/B/C/D format.

---

## DR-005: Spec Folder Location

**Date:** 2025-12-25  
**Status:** Accepted  
**Decision:** Create new 005-bug-fixes category

### Context
This work spans multiple systems (memory, SpecKit, framework). Where to document?

### Options
- 005-memory (memory-focused)
- 006-opencode (framework-focused)
- 005-bug-fixes (new category for fixes)

### Decision
**Create 005-bug-fixes** - Dedicated category for bug fix work, separate from feature development.

### Outcome
Created .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/032-system-health-audit/

---

## DR-006: Implementation Approach

**Date:** 2025-12-25  
**Status:** Accepted  
**Decision:** Parallel agent execution

### Context
34 issues to fix. Sequential would take hours.

### Decision
**10 parallel agents** - Each agent handles related issues, all run simultaneously.

### Outcome
All 34 issues fixed in ~15 minutes of parallel execution.
