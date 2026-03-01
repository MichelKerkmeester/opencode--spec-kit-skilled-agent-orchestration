---
title: "Specification: Post-Merge Refinement Final [043-post-merge-refinement-final/spec]"
description: "After the major Spec Kit + Memory system merger (spec 035), eight refinement attempts (036-042) identified ~300+ issues. However, many were"
trigger_phrases:
  - "specification"
  - "post"
  - "merge"
  - "refinement"
  - "final"
  - "spec"
  - "043"
importance_tier: "important"
contextType: "decision"
---
# Specification: Post-Merge Refinement Final

| **Field** | **Value** |
|-----------|-----------|
| **Level** | 3 |
| **Status** | Draft |
| **Created** | 2025-12-25 |
| **Spec Folder** | 043-post-merge-refinement-final |

## Problem Statement

After the major Spec Kit + Memory system merger (spec 035), eight refinement attempts (036-042) identified ~300+ issues. However, many were:
- **Duplicates** across specs
- **Already fixed** but not verified
- **Superseded** by later changes

A comprehensive 10-agent research sweep across all 42 specs with code verification has identified **39 unique, verified open issues** that require resolution.

### Why This Spec Exists
- Consolidates fragmented refinement work
- Provides single source of truth for remaining issues
- Enables focused, prioritized remediation
- Closes out specs 036-042 by incorporating their findings

## Goals

1. **Close P0 Critical Issues (8)** - System stability
   - Fix MCP server bugs causing crashes/cache bypass
   - Create missing scripts referenced in documentation

2. **Resolve P1 High Issues (14)** - User experience
   - Align documentation across AGENTS.md, SKILL.md, commands
   - Fix feature bugs (contiguity, cache invalidation)

3. **Address P2 Medium Issues (12)** - Quality
   - Add database indexes, standardize formats
   - Improve code quality (remove process.exit, fix regex)

4. **Document Architectural Decisions** - Future maintainability
   - Record why issues were fixed certain ways
   - Identify deferred items for future work

## Non-Goals

1. Adding new features beyond bug fixes
2. Major architecture changes
3. Resolving P3/P4 polish items (deferred)
4. Creating CI/CD pipeline (separate spec needed)

## Success Criteria

| Criterion | Target |
|-----------|--------|
| P0 issues resolved | 8/8 (100%) |
| P1 issues resolved | 14/14 (100%) |
| P2 issues resolved | ≥8/12 (≥67%) |
| Documentation aligned | AGENTS.md = SKILL.md = Commands |
| Code verification | All P0/P1 verified fixed |
| No regressions | Existing tests pass |

## Scope

### In Scope
| Component | Files |
|-----------|-------|
| MCP Server | `.opencode/skill/system-spec-kit/mcp-server/src/*` |
| Scripts | `.opencode/skill/system-spec-kit/scripts/*` |
| SKILL.md | `.opencode/skill/system-spec-kit/SKILL.md` |
| Commands | `.opencode/command/spec_kit/*`, `.opencode/command/memory/*` |
| AGENTS.md | `AGENTS.md` (Spec Kit sections only) |

### Out of Scope
| Component | Reason |
|-----------|--------|
| LEANN MCP | Separate system |
| Narsil MCP | Separate system |
| Other skills | Not affected by merger |
| CI/CD pipeline | Requires separate spec (P2-012) |
| New features | Bug fixes only |

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | Single getConstitutionalMemories function | P0 |
| FR-002 | verifyIntegrityWithPaths implemented or removed | P0 |
| FR-003 | cleanupOrphans implemented or removed | P0 |
| FR-004 | Database column names consistent | P0 |
| FR-005 | related_memories column migrated | P0 |
| FR-006 | validate-spec.sh script created | P0 |
| FR-007 | recommend-level.sh script created | P0 |
| FR-008 | MCP tool documentation matches actual names | P0 |
| FR-009 | Gate numbering consistent (Gate 4) | P1 |
| FR-010 | Step count consistent (14 steps) | P1 |
| FR-011 | Level 1 requirements aligned | P1 |
| FR-012 | includeContiguity parameter functional | P1 |
| FR-013 | Trigger cache invalidated after mutations | P1 |
| FR-014 | Checkpoint restore preserves embeddings | P1 |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | No performance regression | P0 |
| NFR-002 | Backward compatible with existing data | P0 |
| NFR-003 | Clear error messages | P1 |
| NFR-004 | Database indexes for common queries | P2 |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Database migration breaks data | Medium | High | Backup before migration |
| Doc changes cause confusion | Low | Medium | Announce changes |
| Fixes introduce regressions | Medium | Medium | Verification checklist |
| Scope creep from new issues | High | Medium | Strict scope discipline |

## References

- issue-registry.md - Master issue list
- research-findings.md - All spec summaries
- specs 036-042 - Prior refinement attempts
- z_archive 001-034 - Historical context
