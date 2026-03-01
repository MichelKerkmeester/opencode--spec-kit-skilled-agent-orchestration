---
title: "Decision Record: system-spec-kit Reimagined Refinement [089-speckit-reimagined-refinement/decision-record]"
description: "title: \"Decision Record: system-spec-kit Reimagined Refinement\""
trigger_phrases:
  - "decision"
  - "record"
  - "system"
  - "spec"
  - "kit"
  - "decision record"
  - "089"
  - "speckit"
importance_tier: "important"
contextType: "decision"
spec: "089"
---
# Decision Record: system-spec-kit Reimagined Refinement

---

## DR-001: Audit Methodology — Parallel Agent Dispatch

**Date:** 2026-02-06
**Status:** Accepted
**Context:** The system-spec-kit ecosystem spans ~50+ files across 8 directories. A serial audit would take multiple sessions.

**Decision:** Dispatch 10 parallel Opus 4.6 research agents, each covering one area:
1. SKILL.md, 2. References, 3. Assets, 4. Scripts, 5. Config, 6. MCP Server, 7. Commands, 8. Agents, 9. Pre-analysis 081, 10. Target 089

**Outcome:** All 10 agents completed. ~120+ findings identified in one session. Commands agent hit context limits twice due to deep file reads (re-launched with focused scope).

**Alternatives Considered:**
- Serial analysis (too slow for ecosystem-wide audit)
- 20 agents (excessive for 8 directories; 10 was sufficient)

---

## DR-002: Pre-analysis 081 — Archive Rather Than Update

**Date:** 2026-02-06
**Status:** Accepted
**Context:** The 081 pre-analysis identified gaps and recommended enhancements. Agent abf1403 discovered that **every single recommendation has already been implemented** in the current codebase. The documents are entirely obsolete for forward-looking work.

**Decision:** Archive 081 as SUPERSEDED rather than updating the documents.

**Rationale:**
- Updating 8 redundant files (4 analysis + 4 recommendations) to reflect current state would be wasted effort
- The 4x duplication (parallel agent outputs never consolidated) makes maintenance impractical
- Historical value is preserved by archiving, not editing
- Fresh audit (this spec, 089) provides accurate current-state documentation

**Alternatives Considered:**
- Update all 8 files (too much effort for obsolete content)
- Delete 081 entirely (loses historical research value)
- Consolidate into 2 files then update (reasonable but lower priority than bug fixes)

---

## DR-003: Config Dead Code — Document Before Removing

**Date:** 2026-02-06
**Status:** Accepted
**Context:** config.jsonc sections 2-11 are never read at runtime. complexity-config.jsonc is entirely unused. The config/README.md claims functions that don't exist.

**Decision:** Phase 3 will document dead sections before removal, rather than deleting immediately.

**Rationale:**
- Some config may have been intended for future features
- Removal without documentation could lose design intent
- Documentation-first approach allows informed decision about each section
- complexity-config.jsonc may be referenced by external documentation

**Alternatives Considered:**
- Immediate deletion (risks losing design intent)
- Wire into runtime (over-engineering if features aren't needed)

---

## DR-004: LIKE Injection Fix — Escape Helper Pattern

**Date:** 2026-02-06
**Status:** Accepted
**Context:** `resolve_memory_reference()` in memory-save.js passes user input directly to LIKE patterns without escaping `%` and `_` wildcard characters. Severity: MEDIUM-HIGH.

**Decision:** Create an `escapeLikePattern()` utility function and apply it at the query boundary.

**Rationale:**
- Centralized helper is reusable across other LIKE queries in the codebase
- Escape at query boundary (not at input) preserves data integrity
- Minimal change footprint (single function + apply at 1-2 call sites)

**Alternatives Considered:**
- Parameterized exact match instead of LIKE (would change search semantics)
- Input sanitization at API boundary (too broad, may break legitimate uses)

---

## DR-005: Agent Model Version Updates — Defer to Phase 4

**Date:** 2026-02-06
**Status:** Accepted
**Context:** Agent files reference Opus 4.5 (now 4.6) and GPT-5.2-Codex as defaults. These are stale but not breaking.

**Decision:** Defer model version updates to Phase 4 (LOW priority).

**Rationale:**
- Model version strings in agent files are advisory, not functional
- Agents work correctly regardless of documented model version
- Updating all 7 agent files is mechanical but time-consuming
- Higher priority bugs should be addressed first

---

## DR-006: Filters.jsonc — Fix Path AND Naming Together

**Date:** 2026-02-06
**Status:** Accepted
**Context:** Two separate bugs prevent filters.jsonc from loading: (1) wrong path resolution, (2) camelCase vs snake_case mismatch. Fixing only one would not resolve the issue.

**Decision:** Fix both bugs atomically in the same commit. Align to snake_case in config (matching code convention).

**Rationale:**
- Fixing path without naming alignment would create a false "fixed" state where values still don't load
- snake_case aligns with the existing code convention in content-filter.js
- Atomic fix prevents partial-fix confusion

**Alternatives Considered:**
- Fix path only, fix naming later (broken intermediate state)
- Convert code to camelCase (would require more code changes than config changes)

---

## DR-007: Scope Boundary — Commands Directory Excluded from Fixes

**Date:** 2026-02-06
**Status:** Accepted
**Context:** The commands directory audit (agent a4c8601) found 0 issues across 19 .md files and 13 .yaml assets. All references validated, naming consistent, frontmatter complete.

**Decision:** Exclude commands directory from remediation scope. No changes needed.

**Evidence:** 100% compliance across all audit dimensions (reference integrity, naming, frontmatter, Gate 3 enforcement, workflow patterns).
