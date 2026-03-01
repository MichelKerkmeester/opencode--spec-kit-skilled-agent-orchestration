---
title: "Decision Record: Dynamic Complexity-Based Template Scaling [069-speckit-template-complexity/decision-record]"
description: "Architectural decisions and rationale for the complexity detection system."
trigger_phrases:
  - "decision"
  - "record"
  - "dynamic"
  - "complexity"
  - "based"
  - "decision record"
  - "069"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Dynamic Complexity-Based Template Scaling

Architectural decisions and rationale for the complexity detection system.

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v1.0 -->

---

## ADR-001: 5-Dimension Scoring Algorithm

### Status
Accepted

### Context
The existing `recommend-level.sh` uses 4 factors (LOC, files, risk, complexity) but doesn't capture research requirements or multi-agent coordination needs. Analysis of specs 056-068 shows significant variance in these dimensions.

### Decision
Implement a 5-dimension scoring algorithm:
1. **Scope** (25%): Files affected, LOC estimate, systems touched
2. **Risk** (25%): Security, auth, config, breaking changes
3. **Research** (20%): Investigation keywords, unknowns, external deps
4. **Multi-Agent** (15%): Parallel workstreams, agent coordination needs
5. **Coordination** (15%): Cross-system deps, blocking relationships

### Consequences
- **Positive**: More nuanced complexity assessment
- **Positive**: Captures dimensions not in original algorithm
- **Negative**: More complex signal extraction needed
- **Negative**: May require tuning weights based on real-world usage

### Alternatives Considered
1. **Keep 4 factors**: Simpler but misses important dimensions
2. **Machine learning**: More accurate but overkill for rule-based system
3. **7+ dimensions**: Diminishing returns, harder to explain to users

---

## ADR-002: COMPLEXITY_GATE Marker System

### Status
Accepted

### Context
Need a way to include/exclude template content based on complexity level without maintaining separate template files per level.

### Decision
Use HTML-style comment markers:
```markdown
<!-- COMPLEXITY_GATE: level>=3, feature=ai-protocol -->
[Content]
<!-- /COMPLEXITY_GATE -->
```

Attributes:
- `level>=N`: Minimum level for inclusion
- `level<=N`: Maximum level for inclusion
- `feature=name`: Named feature flag

### Consequences
- **Positive**: Single template file per document type
- **Positive**: Clear marker syntax, easy to parse
- **Positive**: Backward compatible (markers are HTML comments)
- **Negative**: Templates become more complex to read
- **Negative**: Potential for marker nesting issues

### Alternatives Considered
1. **Separate template files**: spec-level1.md, spec-level2.md, etc. - maintenance burden
2. **Jinja/Handlebars templates**: Requires template engine dependency
3. **YAML frontmatter**: Doesn't work well for inline sections

---

## ADR-003: Level 3+ Extended Level

### Status
Accepted

### Context
Analysis shows some specs (like 064) require significantly more structure than typical Level 3. Need a way to distinguish highly complex multi-agent tasks.

### Decision
Add Level 3+ for scores 80-100:
- All Level 3 features
- Required AI execution protocols
- Full dependency DAG visualization
- Extended checklist (100-150 items)
- 8-15 user stories
- 8-12 phases

Level mapping:
- 0-25: Level 1 (Baseline)
- 26-55: Level 2 (Verification)
- 56-79: Level 3 (Full)
- 80-100: Level 3+ (Extended)

### Consequences
- **Positive**: Distinguishes highly complex tasks
- **Positive**: Provides appropriate structure for multi-agent work
- **Negative**: Another level to document and maintain
- **Negative**: May cause confusion about Level 3 vs 3+

### Alternatives Considered
1. **Just Level 3**: Under-serves complex specs
2. **Level 4**: Creates too many levels
3. **Level 3 with flags**: More confusing than 3+ designation

---

## ADR-004: Opt-In Then Default-On Migration

### Status
Accepted

### Context
Complexity detection is a new feature. Need to balance user safety with adoption.

### Decision
Three-phase rollout:
1. **Phase 1 (Initial)**: Opt-in via `SPECKIT_COMPLEXITY_DETECTION=true`
2. **Phase 2 (Validated)**: Default on, opt-out via `SPECKIT_COMPLEXITY_DETECTION=false`
3. **Phase 3 (Stable)**: Mandatory, migration script for v1.x templates

### Consequences
- **Positive**: Users can test before full adoption
- **Positive**: Easy to disable if issues arise
- **Negative**: Slower adoption initially
- **Negative**: Two code paths to maintain during transition

### Alternatives Considered
1. **Immediate default-on**: Risk of disrupting existing workflows
2. **Permanent opt-in**: Never achieves full adoption
3. **Feature flag system**: Overkill for single feature

---

## ADR-005: JavaScript for Detection, Bash for Integration

### Status
Accepted

### Context
Need to balance implementation effort with integration requirements. Shell scripts dominate the existing codebase.

### Decision
- **JavaScript (Node.js)**: Complexity detection and template expansion
  - Better string processing
  - JSON handling
  - Cross-platform regex
- **Bash**: Integration scripts and validation rules
  - Consistent with existing scripts
  - Easy shell integration
  - Simpler file operations

### Consequences
- **Positive**: Leverages strengths of each language
- **Positive**: Complex logic in JS, simple integration in Bash
- **Negative**: Two languages to maintain
- **Negative**: Node.js runtime dependency

### Alternatives Considered
1. **All Bash**: Difficult string processing and JSON handling
2. **All JavaScript**: Inconsistent with existing codebase
3. **Python**: Third language, unnecessary complexity

---

## ADR-006: Extend recommend-level.sh vs Replace

### Status
Accepted

### Context
`recommend-level.sh` has a working scoring algorithm (534 LOC). Need to decide whether to extend or replace it.

### Decision
**Extend** the existing system:
- Keep `recommend-level.sh` for backward compatibility
- Add complexity detection as an alternative/enhancement
- New `detect-complexity.js` builds on same principles
- Integration layer bridges both systems

### Consequences
- **Positive**: Backward compatibility maintained
- **Positive**: Users can choose which system to use
- **Negative**: Two complexity assessment systems
- **Negative**: Potential for confusion about which to use

### Alternatives Considered
1. **Replace entirely**: Breaking change for existing users
2. **Merge into Bash**: Difficult to implement 5-dimension scoring in Bash
3. **Deprecate old**: Too aggressive for initial release

---

## Decision Log

| ID | Date | Decision | Status |
|----|------|----------|--------|
| ADR-001 | 2026-01-16 | 5-Dimension Scoring | Accepted |
| ADR-002 | 2026-01-16 | COMPLEXITY_GATE Markers | Accepted |
| ADR-003 | 2026-01-16 | Level 3+ Extended | Accepted |
| ADR-004 | 2026-01-16 | Opt-In Migration | Accepted |
| ADR-005 | 2026-01-16 | JS + Bash Split | Accepted |
| ADR-006 | 2026-01-16 | Extend vs Replace | Accepted |
