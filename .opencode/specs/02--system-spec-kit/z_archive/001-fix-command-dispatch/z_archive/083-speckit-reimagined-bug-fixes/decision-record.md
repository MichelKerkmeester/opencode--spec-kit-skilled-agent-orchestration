---
title: "Decision Record: Spec Kit Bug Fixes [083-speckit-reimagined-bug-fixes/decision-record]"
description: "The MCP server's memory-parser.js uses regex to extract ANCHOR-tagged sections. The current regex expects closing tags in /ANCHOR: format, but README.md documents ANCHOR_END for..."
trigger_phrases:
  - "decision"
  - "record"
  - "spec"
  - "kit"
  - "bug"
  - "decision record"
  - "083"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Spec Kit Bug Fixes

> Architecture Decision Records (ADRs) for significant decisions made during bug fix implementation.

---

## Document Information

| Field | Value |
|-------|-------|
| **Spec ID** | 083-speckit-reimagined-bug-fixes |
| **Level** | 3 |
| **Last Updated** | 2025-02-03 |

---

## ADR-001: ANCHOR Format Standardization

### Context

The MCP server's `memory-parser.js` uses regex to extract ANCHOR-tagged sections. The current regex expects closing tags in `/ANCHOR:` format, but README.md documents `ANCHOR_END` format.

### Decision

**Standardize on `/ANCHOR:` format** for all closing tags.

### Rationale

1. The MCP server code is already implemented with `/ANCHOR:` regex
2. Changing documentation is simpler than changing code
3. `/ANCHOR:` format is more concise and consistent with HTML comment patterns

### Consequences

- README.md examples must be updated
- Any existing memory files with `ANCHOR_END` format will silently fail extraction
- Migration guide should be provided for users with existing files

### Status

**Accepted** - 2025-02-03

---

## ADR-002: YAML Path Location

### Context

Command files reference YAML workflow assets at `.opencode/command/spec_kit/assets/` but actual files are at `.claude/commands/spec_kit/assets/`.

### Decision

**Update all command files to reference `.claude/commands/spec_kit/assets/`**

### Alternatives Considered

1. **Move YAML files to `.opencode/` path**
   - Rejected: Would break existing workflows
   - Would require updating Claude command discovery

2. **Create symlinks between paths**
   - Rejected: Adds complexity
   - Not portable across platforms

3. **Update documentation only** (Selected)
   - Simplest fix
   - No file movement required
   - Maintains current working structure

### Consequences

- All 12 command files need path updates
- Single search-and-replace operation
- No structural changes required

### Status

**Accepted** - 2025-02-03

---

## ADR-003: complete.md Step Count Resolution

### Context

The `/spec_kit:complete` command file documents 14 steps, but YAML workflow assets only implement 12 steps. Missing steps are:
- Step 11: Checklist Verification (P0/P1 quality gate)
- Step 14: Handover Check (session continuity)

### Decision

**Add missing steps to YAML files and renumber existing steps**

### Rationale

1. Checklist verification (Step 11) is a critical quality gate
2. Handover check (Step 14) ensures session continuity
3. Removing steps from documentation would reduce functionality
4. YAMLs should match command file as source of truth

### Implementation

```yaml
# Add step_11_checklist_verify with @review agent dispatch
# Renumber step_11_completion to step_12_completion
# Renumber step_12_save_context to step_13_save_context
# Add step_14_handover_check at end
```

### Consequences

- YAML files become larger
- Workflow execution time slightly increases
- Quality gates properly enforced

### Status

**Accepted** - 2025-02-03

---

## ADR-004: Task Tool Parameter Correction

### Context

The `handover.md` command uses a `model` parameter in Task tool invocations that doesn't exist in the Task tool schema. Available parameters are: `subagent_type`, `description`, `prompt`, `session_id`, `command`.

### Decision

**Remove `model` parameter and rely on `subagent_type` for model selection**

### Rationale

1. Task tool doesn't support arbitrary parameters
2. Model selection is inherent in subagent_type designation
3. Current syntax would cause runtime errors or silent failures

### Before/After

```diff
# Before (invalid)
- Task(subagent_type="handover", model="sonnet", prompt=...)

# After (valid)
+ Task(subagent_type="handover", description="Session handover", prompt=...)
```

### Consequences

- Model selection for handover is determined by subagent configuration
- Users cannot override model at invocation time
- More consistent with other command patterns

### Status

**Accepted** - 2025-02-03

---

## ADR-005: WebSearch Tool Handling

### Context

The `research.md` command lists `WebSearch` in allowed-tools, but this tool may not exist. Only `webfetch` is confirmed to exist.

### Decision

**Investigate and remove if phantom; standardize tool names to lowercase**

### Investigation Steps

1. Check if WebSearch is a valid tool in the system
2. If not found, remove from allowed-tools
3. Standardize all tool names to lowercase format

### Rationale

1. Phantom tool references could cause LLM confusion
2. Lowercase is the standard format for tool names
3. WebFetch/webfetch provides similar functionality

### Consequences

- If removed, research workflow loses potential web search capability
- Tool name standardization improves consistency
- May require testing to verify no regression

### Status

**Pending Investigation** - 2025-02-03

---

## ADR-006: handover.md YAML Contradiction

### Context

handover.md line 258 states "This command uses direct execution without YAML asset files" but line 550 references `spec_kit_handover_full.yaml`.

### Decision

**Remove the contradictory statement and keep YAML reference**

### Rationale

1. The YAML file exists and is functional
2. Claiming no YAML while referencing one is confusing
3. YAML-based workflow is consistent with other commands

### Consequences

- Documentation becomes internally consistent
- No functional changes required
- YAML workflow continues to be used

### Status

**Accepted** - 2025-02-03

---

## ADR-007: Orphaned Command References

### Context

The `speckit.md` agent file references `/memory:why` and `/memory:correct` which were deleted in the memory command consolidation (spec 083).

### Decision

**Remove orphaned references and update to consolidated commands**

### Mapping

| Old Command | New Location |
|-------------|--------------|
| `/memory:why` | Removed (use MCP tools directly) |
| `/memory:correct` | `/memory:learn correct` subcommand |

### Consequences

- Agent file reflects current command structure
- Users directed to correct commands
- No stale documentation

### Status

**Accepted** - 2025-02-03

---

## ADR-008: Step Numbering Consistency

### Context

Multiple commands have step numbering inconsistencies between command files and YAML assets, including:
- implement.md references "Step 11" (only 9 steps exist)
- implement.md has duplicate "6." in setup phase
- resume.md key_steps references step 5 (only 4 steps in auto mode)

### Decision

**Audit and correct all step references across all command files and YAMLs**

### Approach

1. Enumerate actual steps in each command
2. Update all references to match actual step counts
3. Verify key_steps arrays only reference existing steps

### Consequences

- All step references will be accurate
- Navigation within workflows will be correct
- Agent routing will target correct steps

### Status

**Accepted** - 2025-02-03

---

## Decision Summary

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Use `/ANCHOR:` format | Accepted |
| ADR-002 | Update paths to `.claude/commands/` | Accepted |
| ADR-003 | Add missing steps to YAMLs | Accepted |
| ADR-004 | Remove invalid `model` parameter | Accepted |
| ADR-005 | Remove phantom WebSearch tool | Pending |
| ADR-006 | Remove YAML contradiction | Accepted |
| ADR-007 | Update orphaned references | Accepted |
| ADR-008 | Fix step numbering | Accepted |

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-02-03 | Initial ADRs from audit |
