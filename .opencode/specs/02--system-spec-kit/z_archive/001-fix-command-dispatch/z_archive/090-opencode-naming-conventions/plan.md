---
title: "Implementation Plan: OpenCode Naming Convention Alignment [090-opencode-naming-conventions/plan]"
description: "Rename all snake_case JavaScript identifiers (functions, parameters, module variables, exports) to camelCase across ~206 files in .opencode/skill/system-spec-kit/. Update 9 skil..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "opencode"
  - "naming"
  - "convention"
  - "090"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: OpenCode Naming Convention Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node.js, CommonJS) |
| **Framework** | Custom MCP server + scripts |
| **Storage** | SQLite (via better-sqlite3) |
| **Testing** | Manual + MCP server startup |

### Overview
Rename all snake_case JavaScript identifiers (functions, parameters, module variables, exports) to camelCase across ~206 files in `.opencode/skill/system-spec-kit/`. Update 9 skill documentation files to reflect the new standard. Maintain backward-compatible export aliases for MCP handlers.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All JS functions/params/variables use camelCase
- [ ] MCP server starts without errors
- [ ] All 9 skill docs updated
- [ ] Zero orphaned snake_case calls
- [ ] Backward-compat aliases in handler exports

---

## 3. ARCHITECTURE

### Pattern
Directory-by-directory migration with backward-compatible exports

### Key Components
- **MCP Handlers** (`mcp_server/handlers/`): Highest risk - external API surface
- **MCP Core** (`mcp_server/core/` + `shared/`): Server config, startup
- **Scripts** (`scripts/`): Build/utility scripts
- **Skill Docs** (`sk-code--opencode/`): Convention documentation

### Data Flow
Function definitions are renamed → Call sites updated in same file → Cross-file imports updated in sweep → MCP exports get backward-compat aliases

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Spec Folder Setup
- [x] Create Level 3+ spec folder
- [x] Document plan, tasks, checklist, decision record

### Phase 2: Skill Documentation (Part A)
- [ ] Update 9 files in `sk-code--opencode/` (parallel)

### Phase 3: JS Migration (Part B)
- [ ] Migrate 10 directory groups in parallel
- [ ] Each agent handles definitions + call sites within their directory

### Phase 4: Cross-Reference Sweep
- [ ] Fix cross-directory import mismatches

### Phase 5: Verification
- [ ] MCP server startup test
- [ ] Orphan snake_case detection
- [ ] Undefined camelCase detection

### Phase 6: Completion
- [ ] Implementation summary
- [ ] Checklist verification

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Startup | MCP server loads | `node context-server.js` |
| Grep audit | No orphaned snake_case | `grep -r` pattern scan |
| Manual | Handler invocation | MCP tool calls |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| All JS files readable | Internal | Green | Cannot migrate |
| MCP server testable | Internal | Green | Cannot verify |

---

## 7. ROLLBACK PLAN

- **Trigger**: MCP server fails to start after migration
- **Procedure**: `git checkout -- .opencode/skill/system-spec-kit/` to restore all JS files

---

## L3: CRITICAL PATH

1. **Phase 3: JS Migration** - Largest effort - CRITICAL
2. **Phase 4: Cross-ref sweep** - Catches inter-file breaks - CRITICAL
3. **Phase 5: Verification** - Confirms no regressions - CRITICAL

**Parallel Opportunities**:
- Phase 2 (docs) and Phase 3 (migration) can run simultaneously
- All 10 migration agents can run in parallel within Phase 3

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Files | Status |
|----|------|-------|--------|
| W-A | Skill Documentation | 9 skill doc files | Pending |
| W-B1-B10 | JS Migration (10 groups) | ~206 JS files | Pending |
| W-C | Cross-ref Sweep | All migrated files | Blocked on W-B |
| W-D | Verification | All files | Blocked on W-C |

### Sync Points

| Sync ID | Trigger | Output |
|---------|---------|--------|
| SYNC-001 | All W-B agents complete | Cross-ref sweep begins |
| SYNC-002 | W-C complete | Verification begins |

### File Ownership Rules
- Each directory group owned by ONE agent
- Cross-directory imports resolved in W-C sweep
- No overlapping file edits between agents
