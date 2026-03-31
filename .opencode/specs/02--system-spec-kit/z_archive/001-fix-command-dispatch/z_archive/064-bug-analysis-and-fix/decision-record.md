---
title: "Decision [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/decision-record]"
description: "Architecture Decision Records (ADRs) documenting significant technical decisions for the bug fix effort."
trigger_phrases:
  - "decision"
  - "record"
  - "system"
  - "spec"
  - "kit"
  - "decision record"
  - "064"
  - "bug"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: System-Spec-Kit Bug Fix Architectural Decisions

Architecture Decision Records (ADRs) documenting significant technical decisions for the bug fix effort.

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v1.0 -->

---

# ADR-001: Config System Resolution

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Decision ID**: ADR-001
- **Status**: Accepted
- **Date**: 2026-01-15
- **Deciders**: Engineering Team
- **Related Feature**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/spec.md`
- **Supersedes**: N/A
- **Superseded By**: N/A

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:context -->
## 2. CONTEXT

### Problem Statement
The config system in system-spec-kit is almost entirely unused:
- `config-loader.js` exists but is never imported by any module
- 8 of 10 config sections in `search-weights.json` are never read
- Only `maxTriggersPerMemory` and `smartRanking` sections are actually used
- Modules use hardcoded constants instead of reading config

This creates technical debt and misleading documentation suggesting the system is configurable when it largely is not.

### Current Situation
- `mcp_server/configs/search-weights.json` contains 10 config sections
- `mcp_server/lib/config-loader.js` provides loading utilities
- No module imports `config-loader.js`
- Actual config usage is ad-hoc (direct JSON reads for 2 sections)

### Constraints
- Backward compatibility with existing deployments
- Minimal risk of behavioral changes
- Clear documentation of actual capabilities

### Assumptions
- No external systems depend on unused config sections
- The intent was to make the system configurable but implementation was incomplete
- Full config implementation is not a current priority

<!-- /ANCHOR:context -->
---

<!-- ANCHOR:decision -->
## 3. DECISION

### Summary
**Remove the unused config infrastructure and document the system as having limited, hardcoded configuration with specific overrides.**

### Detailed Description

1. **Delete `config-loader.js`** - It provides no value since nothing imports it
2. **Reduce `search-weights.json`** to only the 2 used sections:
   - `maxTriggersPerMemory`
   - `smartRanking`
3. **Move hardcoded values to a constants file** for the sections that aren't configurable
4. **Update documentation** to accurately describe configuration capabilities
5. **Add TODO comment** for future full config implementation if needed

### Technical Approach

```javascript
// Before: 10 sections in search-weights.json, config-loader.js unused
// After: 2 sections in search-weights.json, constants.js for fixed values

// constants.js (new file)
export const DEFAULTS = {
  minSimilarityThreshold: 0.3,
  hybridSearchWeight: 0.7,
  // ... other fixed values
};

// Modules continue to read search-weights.json for configurable values
// Non-configurable values come from constants.js
```

<!-- /ANCHOR:decision -->
---

## 4. ALTERNATIVES CONSIDERED

### Option 1: Remove Unused Code [CHOSEN]

**Description**: Delete config-loader.js, reduce search-weights.json to used sections only

**Pros**:
- Eliminates dead code and technical debt
- Makes actual capabilities clear
- No risk of behavior change (nothing uses the removed code)
- Simpler codebase

**Cons**:
- Requires future work if full config is ever needed
- Loses "infrastructure" that might have been useful

**Score**: 8/10

**Why Chosen**: Simplest solution, eliminates misleading code, zero behavior change risk

---

### Option 2: Fully Implement Config Loading

**Description**: Add imports to all modules, make everything configurable

**Pros**:
- Fulfills original design intent
- Maximum flexibility

**Cons**:
- Significant development effort
- Risk of breaking changes
- May never be needed
- Over-engineering for current needs

**Score**: 4/10

**Why Rejected**: Too much effort for uncertain value, risk of introducing bugs

---

### Option 3: Keep Status Quo with Documentation

**Description**: Leave code as-is, just document that config is limited

**Pros**:
- Zero code changes
- No risk

**Cons**:
- Dead code remains
- Misleading structure
- Technical debt persists
- Future maintainers confused

**Score**: 3/10

**Why Rejected**: Doesn't address the core problem of dead code and confusion

---

### Comparison Matrix

| Criterion | Weight | Remove Unused | Full Implement | Status Quo |
|-----------|--------|---------------|----------------|------------|
| Risk | 3/10 | 9/10 | 4/10 | 10/10 |
| Effort | 2/10 | 8/10 | 2/10 | 10/10 |
| Clarity | 3/10 | 9/10 | 8/10 | 3/10 |
| Maintenance | 2/10 | 9/10 | 6/10 | 4/10 |
| **Weighted Score** | - | **8.7/10** | 5.0/10 | 6.1/10 |

---

<!-- ANCHOR:consequences -->
## 5. CONSEQUENCES

### Positive Consequences
- Codebase is cleaner and more honest
- Documentation matches reality
- No misleading infrastructure
- Easier to maintain

### Negative Consequences
- If full config is needed later, must rebuild infrastructure
  - *Mitigation*: Document the decision and original intent for future reference

### Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Hidden dependency on config-loader.js | High | Very Low | Grep codebase thoroughly before deletion |
| Future need for removed sections | Low | Low | Document in CHANGELOG, easy to re-add |

### Technical Debt Introduced
- None - this decision reduces technical debt

<!-- /ANCHOR:consequences -->
---

## 6. IMPLEMENTATION NOTES

**Tasks**:
1. Grep entire codebase for `config-loader` imports - verify none exist
2. Identify the 2 used config sections and their consumers
3. Delete `config-loader.js`
4. Reduce `search-weights.json` to used sections
5. Create `constants.js` for fixed values
6. Update SKILL.md to document actual config capabilities
7. Add CHANGELOG entry

---

## 7. IMPACT ASSESSMENT

### Systems Affected
- `mcp_server/lib/config-loader.js` - Deleted

---

# ADR-002: ANCHOR System Scope (Defer Full Implementation)

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Decision ID**: ADR-002
- **Status**: Proposed
- **Date**: 2026-01-15
- **Deciders**: Engineering Team
- **Related Feature**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/spec.md`
- **Supersedes**: N/A
- **Superseded By**: N/A

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:context -->
## 2. CONTEXT

### Problem Statement
The ANCHOR system is documented as enabling section-level retrieval and “93% token savings,” but it is not implemented:
- `anchor_id` is never populated
- `indexMemory` does not persist anchors
- Retrieval does not support anchor IDs

### Constraints
- Backward compatibility with existing memories
- Avoid schema migrations during bug-fix phase
- Maintain truthful documentation

<!-- /ANCHOR:context -->
---

<!-- ANCHOR:decision -->
## 3. DECISION

### Summary
**Document ANCHOR tags as validated but not indexed, and defer full implementation to a future feature.**

### Detailed Description
1. Remove “93% token savings” claims
2. Document anchors as validated syntax only
3. Create a follow-up spec for full indexing and retrieval

<!-- /ANCHOR:decision -->
---

## 4. ALTERNATIVES CONSIDERED

### Option 1: Fully Implement ANCHOR Indexing
**Pros**: Fulfills documented behavior, enables token savings  
**Cons**: Requires schema changes, increased risk during bug-fix phase

### Option 2: Document as Deferred (Chosen)
**Pros**: Honest documentation, low risk, no schema changes  
**Cons**: Feature remains incomplete

---

<!-- ANCHOR:consequences -->
## 5. CONSEQUENCES

### Positive Consequences
- Documentation matches reality
- No risky schema change during bug-fix phase
- Clear path for future implementation

### Negative Consequences
- ANCHOR feature remains incomplete

<!-- /ANCHOR:consequences -->
---

## 6. IMPLEMENTATION NOTES

**Tasks**:
1. Update SKILL.md and references to remove token savings claims
2. Add “validated but not indexed” note in memory docs
3. Add follow-up spec for ANCHOR implementation

- `mcp_server/configs/search-weights.json` - Reduced
- `SKILL.md` - Updated

### Teams Impacted
- None - internal refactoring only

### Rollback Strategy
Git revert the commit if any issues discovered

---

---

# ADR-002: ANCHOR System Resolution

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Decision ID**: ADR-002
- **Status**: Proposed
- **Date**: 2026-01-15
- **Deciders**: Engineering Team
- **Related Feature**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/spec.md`
- **Supersedes**: N/A
- **Superseded By**: N/A

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:context -->
## 2. CONTEXT

### Problem Statement
The ANCHOR system is documented as a key feature enabling "93% token savings" through section-level retrieval, but it is completely non-functional:
- `anchor_id` column in database is NEVER populated
- ANCHOR tags are validated during parsing but IDs are never extracted
- `parse_memory_file` validates anchor format but doesn't extract for indexing
- `indexMemory` call never passes `anchorId` parameter
- No API exists for anchor-based retrieval

This represents either incomplete implementation or false documentation.

### Current Situation
- Database schema has `anchor_id` column (always NULL)
- Memory files with ANCHOR tags are validated for format
- Validation provides no functional value beyond format checking
- Documentation claims significant token savings that don't exist

### Constraints
- Full implementation would require significant development
- Removing claims is straightforward
- Must not break existing memory file validation

### Assumptions
- ANCHOR format validation is useful for future implementation
- Current users are not depending on anchor-based retrieval (it doesn't work)
- The "93% token savings" was a projection, not measured reality

<!-- /ANCHOR:context -->
---

<!-- ANCHOR:decision -->
## 3. DECISION

### Summary
**Remove false documentation claims about ANCHOR functionality while preserving validation for future implementation. Document ANCHOR as a "planned feature" with current status being "format validation only."**

### Detailed Description

1. **Remove "93% token savings" claim** from SKILL.md and any other documentation
2. **Update ANCHOR documentation** to state current status:
   - "ANCHOR tags are validated for format correctness"
   - "Section-level retrieval is planned but not yet implemented"
   - "Full file content is currently retrieved"
3. **Preserve validation code** in `memory-parser.js` for future use
4. **Create future feature issue** for full ANCHOR implementation
5. **Keep `anchor_id` column** in schema for future use

### Technical Approach

```markdown
// Before in SKILL.md:
"ANCHOR system enables 93% token savings through section-level retrieval"

// After in SKILL.md:
"ANCHOR System (Planned Feature)
ANCHOR tags are validated for format during memory file parsing.
Section-level retrieval is not yet implemented - full file content is retrieved.
Future versions will enable retrieving individual sections by anchor ID."
```

<!-- /ANCHOR:decision -->
---

## 4. ALTERNATIVES CONSIDERED

### Option 1: Remove False Claims [CHOSEN]

**Description**: Update documentation to reflect reality, preserve infrastructure for future

**Pros**:
- Honest documentation
- No code changes needed
- Preserves future option
- Zero risk of breaking changes

**Cons**:
- Doesn't deliver the promised feature
- May disappoint users who expected it

**Score**: 9/10

**Why Chosen**: Honesty is essential, minimal effort, preserves future option

---

### Option 2: Fully Implement ANCHOR System

**Description**: Complete the implementation - extract anchors, store in DB, implement retrieval API

**Pros**:
- Delivers documented feature
- Real token savings
- Better user experience

**Cons**:
- Significant development effort (estimated 2-3 weeks)
- Risk of bugs in new code
- Scope creep from bug fix effort
- May not be high priority vs other features

**Score**: 5/10

**Why Rejected**: Out of scope for bug fix effort, should be separate feature request

---

### Option 3: Remove ANCHOR System Entirely

**Description**: Delete validation code, remove from docs, drop database column

**Pros**:
- Clean slate
- No misleading infrastructure

**Cons**:
- Loses work already done
- May need to re-implement later
- Schema change required (risky)

**Score**: 4/10

**Why Rejected**: Destroys useful infrastructure, schema changes risky

---

### Comparison Matrix

| Criterion | Weight | Remove Claims | Full Implement | Remove Entirely |
|-----------|--------|---------------|----------------|-----------------|
| Risk | 3/10 | 10/10 | 5/10 | 4/10 |
| Effort | 2/10 | 10/10 | 2/10 | 6/10 |
| Honesty | 3/10 | 10/10 | 10/10 | 10/10 |
| Future-proof | 2/10 | 8/10 | 10/10 | 3/10 |
| **Weighted Score** | - | **9.6/10** | 6.6/10 | 5.7/10 |

---

<!-- ANCHOR:consequences -->
## 5. CONSEQUENCES

### Positive Consequences
- Documentation is honest and accurate
- Users have correct expectations
- Infrastructure preserved for future implementation
- No code changes = no regression risk

### Negative Consequences
- Feature not available (but it wasn't before either)
  - *Mitigation*: Create prioritized feature request for future implementation

### Technical Debt Introduced
- None - this reduces technical debt (false documentation)

<!-- /ANCHOR:consequences -->
---

## 6. IMPLEMENTATION NOTES

**Tasks**:
1. Search SKILL.md for all ANCHOR claims
2. Update each section with accurate status
3. Search other docs for ANCHOR references
4. Update those as well
5. Create GitHub issue for future ANCHOR implementation
6. Add CHANGELOG entry

---

---

# ADR-003: Debug Delegation Threshold

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Decision ID**: ADR-003
- **Status**: Proposed
- **Date**: 2026-01-15
- **Deciders**: Engineering Team
- **Related Feature**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/spec.md`

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:context -->
## 2. CONTEXT

### Problem Statement
Documentation is inconsistent about when to trigger debug delegation:
- `SKILL.md` lines 543, 608: "3+ failed fix attempts"
- `debug.md` line 237: "2+ fix attempts"

This inconsistency causes unpredictable behavior depending on which document the AI assistant reads.

### Constraints
- Must pick one value and apply consistently
- Value should balance giving up too early vs. wasting time

<!-- /ANCHOR:context -->
---

<!-- ANCHOR:decision -->
## 3. DECISION

### Summary
**Standardize on "3+ failed fix attempts" as the debug delegation threshold.**

### Detailed Description

The threshold of 3+ attempts:
- Gives the primary agent adequate opportunity to solve the problem
- Avoids premature delegation (2 attempts may be too quick)
- Matches SKILL.md which is the primary documentation
- Aligns with common "rule of three" heuristics in debugging

**All documentation will be updated to use "3+ failed fix attempts" consistently.**

<!-- /ANCHOR:decision -->
---

## 4. ALTERNATIVES CONSIDERED

### Option 1: 3+ Failed Attempts [CHOSEN]

**Why Chosen**: More conservative, matches SKILL.md, avoids premature delegation

**Score**: 8/10

---

### Option 2: 2+ Failed Attempts

**Why Rejected**: May be too aggressive, doesn't match primary SKILL.md documentation

**Score**: 6/10

---

<!-- ANCHOR:consequences -->
## 5. CONSEQUENCES

### Positive Consequences
- Consistent behavior across all documentation
- Clear threshold for AI assistants to follow
- Matches SKILL.md as source of truth

### Negative Consequences
- One extra attempt before delegation vs. 2+
  - *Mitigation*: 3 attempts is still a reasonable cutoff

<!-- /ANCHOR:consequences -->
---

## 6. IMPLEMENTATION NOTES

**Tasks**:
1. Update `debug.md` line 237 from "2+" to "3+"
2. Grep for other threshold references
3. Update any found
4. Verify consistency

---

---

# ADR-004: Naming Convention Standardization

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Decision ID**: ADR-004
- **Status**: Proposed
- **Date**: 2026-01-15
- **Deciders**: Engineering Team
- **Related Feature**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/spec.md`

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:context -->
## 2. CONTEXT

### Problem Statement
The codebase has inconsistent naming conventions:
- `config-loader.js` uses snake_case for some defaults
- MCP tool parameters use different conventions
- Some files use camelCase, others kebab-case

### Constraints
- Changing public API parameter names would break compatibility
- Internal code can be standardized
- Must maintain backward compatibility

<!-- /ANCHOR:context -->
---

<!-- ANCHOR:decision -->
## 3. DECISION

### Summary
**Standardize on camelCase for JavaScript identifiers and kebab-case for file names. Do not change public API parameter names.**

### Detailed Description

**Standards**:
- File names: `kebab-case.js` (already mostly followed)
- JavaScript variables/functions: `camelCase`
- JSON config keys: `camelCase`
- MCP tool parameters: Leave as-is for backward compatibility
- Database columns: `snake_case` (SQLite convention)

**Application**:
- Fix internal inconsistencies only
- Do not change public-facing APIs
- Add lint rules for future enforcement

<!-- /ANCHOR:decision -->
---

## 4. ALTERNATIVES CONSIDERED

### Option 1: camelCase Internal, Preserve External [CHOSEN]

**Why Chosen**: Minimal breaking change risk, improves internal consistency

---

### Option 2: Full snake_case Standardization

**Why Rejected**: Would require changing public APIs, breaking compatibility

---

### Option 3: Leave As-Is

**Why Rejected**: Continues inconsistency, makes maintenance harder

---

## 5. IMPLEMENTATION NOTES

**Tasks**:
1. Identify internal naming inconsistencies in Phase 4 files
2. Update to camelCase where appropriate
3. Do NOT change MCP tool parameter names
4. Add ESLint rule for camelCase enforcement

---

---

# ADR-005: Memory Save Command Resolution

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Decision ID**: ADR-005
- **Status**: Proposed
- **Date**: 2026-01-15
- **Deciders**: Engineering Team
- **Related Feature**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/spec.md`

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:context -->
## 2. CONTEXT

### Problem Statement
SKILL.md references `/memory:save` command extensively (lines 109, 421-426, 787-788) but the corresponding command file `.opencode/command/spec_kit/memory_save.md` does not exist.

### Current Situation
- Users are instructed to use `/memory:save`
- The command cannot be invoked (file missing)
- Actual memory save happens via `generate-context.js` script
- This is confusing and inconsistent with other commands

<!-- /ANCHOR:context -->
---

<!-- ANCHOR:decision -->
## 3. DECISION

### Summary
**Create the missing `/memory:save` command file that wraps the existing `generate-context.js` workflow.**

### Detailed Description

Create `.opencode/command/spec_kit/memory_save.md` that:
1. Documents the memory save workflow
2. References `generate-context.js` as the implementation
3. Provides consistent interface with other spec_kit commands
4. Matches the documentation in SKILL.md

This is preferred over removing SKILL.md references because:
- The command is useful and logically expected
- Other commands follow this pattern
- Removing references would be more disruptive

<!-- /ANCHOR:decision -->
---

## 4. ALTERNATIVES CONSIDERED

### Option 1: Create Command File [CHOSEN]

**Why Chosen**: Fulfills documented interface, consistent with other commands

**Score**: 9/10

---

### Option 2: Remove SKILL.md References

**Why Rejected**: More disruptive, loses useful functionality documentation

**Score**: 5/10

---

## 5. IMPLEMENTATION NOTES

**Tasks**:
1. Create `.opencode/command/spec_kit/memory_save.md`
2. Model structure on existing commands (e.g., `checkpoint.md`)
3. Reference `generate-context.js` as implementation
4. Verify command is discoverable via skill system

---

---

<!-- ANCHOR:decision -->
## DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Remove unused config code, keep only used sections | Proposed |
| ADR-002 | Remove false ANCHOR claims, preserve infrastructure | Proposed |
| ADR-003 | Standardize on 3+ failed attempts for debug delegation | Proposed |
| ADR-004 | camelCase for JS, kebab-case for files, preserve APIs | Proposed |
| ADR-005 | Create missing /memory:save command file | Proposed |

<!-- /ANCHOR:decision -->
---

## APPROVAL & SIGN-OFF

### Approvers

| Name | Role | Approved | Date | Comments |
|------|------|----------|------|----------|
| Engineering | Primary | Pending | - | - |

### Status Changes

| Date | Previous Status | New Status | Reason |
|------|----------------|------------|--------|
| 2026-01-15 | - | Proposed | Initial proposal from bug analysis |

---

**Review Schedule**: These decisions should be reviewed after implementation to assess if they achieved their goals.

---

<!--
  DECISION RECORD - ARCHITECTURE DECISION RECORDS
  - Documents WHY decisions were made
  - Captures alternatives considered
  - Provides future reference for rationale
-->
