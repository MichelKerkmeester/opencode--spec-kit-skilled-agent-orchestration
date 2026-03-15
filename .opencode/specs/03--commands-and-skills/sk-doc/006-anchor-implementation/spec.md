---
title: "Spec: Retrieval Anchors for Skill Documentation [006-anchor-implementation/spec]"
description: "Spec Folder: .opencode/specs/03--commands-and-skills/sk-doc/006-anchor-implementation"
trigger_phrases:
  - "spec"
  - "retrieval"
  - "anchors"
  - "for"
  - "skill"
  - "033"
  - "anchor"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Spec: Retrieval Anchors for Skill Documentation

<!-- ANCHOR: summary -->
**Spec Folder**: `.opencode/specs/03--commands-and-skills/sk-doc/006-anchor-implementation`  
**Level**: 3+ (Governance + Architecture)  
**Status**: Planning  
**Created**: 2026-02-17  
**Owner**: System Architecture Team
<!-- /ANCHOR: summary -->

---

<!-- ANCHOR:metadata -->
## 1. PROBLEM STATEMENT

### Current State

Skill documentation under `.opencode/skill/` lacks structured semantic anchors for retrieval operations. When skills need to be referenced, loaded, or analyzed by memory systems or AI agents, there's no standardized way to extract specific sections (overview, usage patterns, examples, rules, etc.) without parsing the entire document.

This creates several issues:

1. **Inefficient context loading**: Agents must read entire skill files even when only specific sections are needed
2. **No semantic retrieval**: Cannot query "show me all skill usage rules" or "extract examples from skills"
3. **Inconsistent memory indexing**: Skill content indexed without structural metadata
4. **Poor context budgeting**: Large skill files consume excessive tokens when only summaries needed

### Business Impact

- **Developer productivity**: Slower skill discovery and comprehension
- **Token efficiency**: Wasted context capacity on unnecessary content
- **Knowledge management**: Difficulty maintaining skill knowledge graph
- **System scalability**: Cannot efficiently scale to hundreds of skills

### Root Cause

Skills were designed before the anchor-based retrieval system (ANCHOR tags) was implemented for memory files. The current memory system's 5-state model and ANCHOR format provides structured extraction but was never extended to skill documentation.

---

<!-- /ANCHOR:metadata -->
## 2. SCOPE

### In Scope

**Core Deliverables**:
1. Update three skill template files in `.opencode/skill/sk-doc/assets/opencode/`:
   - `skill_md_template.md` (main SKILL.md structure)
   - `skill_reference_template.md` (references folder docs)
   - `skill_asset_template.md` (assets folder docs)

2. Define anchor taxonomy for skill documents:
   - Summary anchors (overview, purpose)
   - Structural anchors (when-to-use, how-it-works, rules)
   - Operational anchors (examples, workflows, troubleshooting)
   - Metadata anchors (resources, dependencies, version-info)

3. Crawl and update all existing skill markdown files:
   - 9 SKILL.md files in `.opencode/skill/*/SKILL.md`
   - All `references/*.md` files per skill
   - All `assets/*.md` files per skill
   - Constitutional docs (`constitutional/*.md`)

4. Validation tooling:
   - Anchor format validation script
   - Coverage verification (% of sections anchored)
   - Syntax checker for anchor tags

**Constraints**:
- **NO memory indexing**: Skill docs remain outside memory system scope
- **NO schema changes**: Memory MCP server unchanged
- **Backward compatibility**: Existing skill loading mechanisms continue working
- **Template-first approach**: Templates updated before bulk migration

### Out of Scope

- Memory indexing of skill documentation (intentionally excluded)
- Changes to memory MCP server or database schema
- Agent routing logic modifications
- Skill invocation workflow changes
- Non-markdown files (scripts, configs)
- Legacy skill folders marked for deprecation

### Affected Systems

| System | Impact | Risk |
|--------|--------|------|
| Skill templates | High - foundation for all new skills | Medium |
| Existing skills (9 folders) | High - content structure change | Medium |
| Memory retrieval (read-only) | Low - new capability, no breaking changes | Low |
| Agent workflows | Low - transparent enhancement | Low |
| Documentation tooling | Medium - validation scripts added | Low |

### Dependencies

- `.opencode/skill/sk-doc/` templates (source of truth)
- Memory ANCHOR format specification (reference implementation)
- Python validation scripts (anchor format checking)

---

## 3. REQUIREMENTS

### Functional Requirements

#### FR-1: Anchor Taxonomy
**Priority**: P0  
**Description**: Define standardized anchor names for skill documentation sections.

**Anchor Categories**:

| Anchor | Purpose | Applies To | Example Usage |
|--------|---------|------------|---------------|
| `summary` | Brief skill overview (1-3 paragraphs) | SKILL.md, references, assets | Quick skill discovery |
| `when-to-use` | Trigger conditions and use cases | SKILL.md | Agent routing decisions |
| `how-it-works` | Operational flow and mechanics | SKILL.md | Implementation understanding |
| `rules` | Constraints, ALWAYS/NEVER directives | SKILL.md, references | Compliance checking |
| `examples` | Usage examples and code samples | SKILL.md, references, assets | Learning and debugging |
| `workflows` | Step-by-step procedures | SKILL.md, references | Execution guidance |
| `resources` | Bundled files, dependencies | SKILL.md | Resource discovery |
| `troubleshooting` | Common issues and solutions | SKILL.md, references | Debugging support |
| `decisions` | Design decisions and rationale | SKILL.md, references | Context and history |
| `validation` | Quality gates and checks | SKILL.md, references, assets | Verification procedures |

**Acceptance Criteria**:
- ✅ All anchor names lowercase, hyphenated
- ✅ Maximum 20 unique anchor types defined
- ✅ Each anchor documented with purpose and scope
- ✅ Taxonomy approved by documentation lead

#### FR-2: Template Updates
**Priority**: P0  
**Description**: Update skill templates with anchor examples and usage guidelines.

**Changes per template**:

1. **skill_md_template.md**:
   - Add ANCHOR syntax examples to each major section
   - Include "Anchor Usage Guidelines" subsection
   - Provide before/after examples
   - Add validation instructions

2. **skill_reference_template.md**:
   - Demonstrate anchor placement in reference docs
   - Show multi-anchor patterns (one doc, multiple sections)
   - Include cross-reference examples

3. **skill_asset_template.md**:
   - Anchor examples for checklists, workflows, patterns
   - Explain when assets need anchors vs when to skip

**Acceptance Criteria**:
- ✅ Each template includes ≥3 anchor examples
- ✅ "How to use anchors" section added to each template
- ✅ Validation commands documented
- ✅ Templates render correctly in Markdown preview

#### FR-3: Bulk Migration Script
**Priority**: P0  
**Description**: Automated script to add anchors to existing skill documentation.

**Script Capabilities**:
- **Dry-run mode**: Preview changes without modification
- **Interactive mode**: Confirm each file before updating
- **Batch mode**: Fully automated with logging
- **Section detection**: Identify major sections via heading hierarchy
- **Anchor insertion**: Add opening and closing ANCHOR tags
- **Backup creation**: Preserve originals before modification
- **Rollback support**: Restore from backups if validation fails

**Script Arguments**:
```bash
python3 scripts/add-anchors-to-skills.py \
  --skill-path .opencode/skill/system-spec-kit \
  --mode [dry-run|interactive|batch] \
  --anchor-types summary,rules,examples \
  --backup-dir backups/$(date +%Y%m%d_%H%M%S) \
  --log-file migration.log
```

**Acceptance Criteria**:
- ✅ Dry-run shows all proposed changes
- ✅ Interactive mode requires confirmation per file
- ✅ Batch mode processes all skills with progress bar
- ✅ Backups created before any modification
- ✅ Rollback restores exact original state
- ✅ Migration log includes timestamps and file counts

#### FR-4: Validation Tooling
**Priority**: P1  
**Description**: Scripts to verify anchor format correctness and coverage.

**Validation Checks**:
1. **Format validation**: Opening/closing tags match, no orphans
2. **Naming validation**: Anchor names conform to taxonomy
3. **Coverage validation**: % of sections anchored
4. **Nesting validation**: No nested anchors (flat structure only)
5. **Content validation**: Anchor blocks non-empty

**Coverage Targets**:
- SKILL.md: ≥80% of H2 sections anchored
- Reference docs: ≥60% of major sections anchored
- Asset docs: ≥40% (many assets don't need anchors)

**Acceptance Criteria**:
- ✅ Validator returns exit codes (0=pass, 1=warnings, 2=errors)
- ✅ JSON report generated with file-level details
- ✅ Terminal output shows colored pass/fail indicators
- ✅ Can validate single file or entire skill directory

### Non-Functional Requirements

#### NFR-1: Performance
**Priority**: P1  
- Bulk migration script processes 100 files in <30 seconds
- Validation script runs in <5 seconds per skill folder
- No performance degradation to skill loading (<1ms overhead)

#### NFR-2: Maintainability
**Priority**: P0  
- Anchor syntax identical to memory ANCHOR format
- Template examples self-documenting
- Migration script output includes remediation guidance
- Rollback procedure documented and tested

#### NFR-3: Backward Compatibility
**Priority**: P0  
- Skills without anchors continue to function normally
- Existing agent workflows unaffected
- No changes to skill invocation API
- Templates remain compatible with existing content

#### NFR-4: Documentation
**Priority**: P1  
- Migration guide in spec folder
- Anchor usage guidelines in sk-doc skill
- Troubleshooting section for common issues
- Before/after examples for each skill type

---

## 4. USER STORIES

### Epic: Anchor Infrastructure

**US-1: As a template maintainer, I need anchor examples in skill templates so new skills include anchors from creation.**

**Acceptance Criteria**:
- Templates show anchor syntax with comments
- "When to use anchors" guidelines included
- Validation commands documented in templates

**Priority**: P0  
**Estimate**: 3 hours

---

**US-2: As a developer, I need a migration script to add anchors to existing skills so I don't manually edit 100+ files.**

**Acceptance Criteria**:
- Script runs in dry-run mode showing proposed changes
- Interactive confirmation available per file
- Batch mode completes migration with logging
- Rollback available if issues discovered

**Priority**: P0  
**Estimate**: 8 hours

---

**US-3: As a QA engineer, I need validation tooling to verify anchor correctness so broken anchors are caught before merge.**

**Acceptance Criteria**:
- Validator checks format, naming, coverage
- JSON report generated for CI integration
- Exit codes enable automated testing
- Remediation guidance provided for failures

**Priority**: P1  
**Estimate**: 5 hours

---

### Epic: Skill Migration

**US-4: As an AI agent, I need anchored skill sections so I can load only relevant portions to save tokens.**

**Acceptance Criteria**:
- SKILL.md files have `summary`, `rules`, `examples` anchors
- Reference docs have `workflows`, `troubleshooting` anchors
- Anchor blocks contain complete, self-contained content
- No nested anchors (flat structure)

**Priority**: P0  
**Estimate**: 12 hours (bulk migration)

---

**US-5: As a documentation lead, I need anchor coverage reports so I can prioritize which skills need improvement.**

**Acceptance Criteria**:
- Coverage report shows % anchored per skill
- Report identifies missing anchors by section type
- Sortable by coverage percentage
- Exportable as CSV for tracking

**Priority**: P2  
**Estimate**: 3 hours

---

## 5. SUCCESS CRITERIA

### Quantitative Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Template anchor examples | ≥3 per template | Manual count |
| SKILL.md anchor coverage | ≥80% of H2 sections | Validation script |
| Reference doc coverage | ≥60% of major sections | Validation script |
| Migration success rate | 100% (no data loss) | Automated tests + backup verification |
| Validation pass rate | 100% post-migration | CI integration |
| Rollback success rate | 100% (identical to original) | Diff comparison |

### Qualitative Criteria

- ✅ Templates self-documenting for anchor usage
- ✅ Migration process documented with runbook
- ✅ Zero breaking changes to existing skill workflows
- ✅ Positive feedback from documentation team on usability
- ✅ Anchor taxonomy extensible for future needs

### Acceptance Gates

**Gate 1: Template Review** (before migration)
- ✅ All three templates updated with anchors
- ✅ Anchor guidelines section added
- ✅ Documentation lead approval

**Gate 2: Migration Dry-Run** (before batch processing)
- ✅ Dry-run completes without errors on all skills
- ✅ Backup strategy tested and verified
- ✅ Rollback procedure tested on sample skill

**Gate 3: Validation** (post-migration)
- ✅ 100% of skills pass format validation
- ✅ Coverage targets met (≥80% SKILL.md, ≥60% references)
- ✅ No functional regressions in skill loading

**Gate 4: Documentation** (before handover)
- ✅ Migration guide published in spec folder
- ✅ Troubleshooting section complete
- ✅ Before/after examples documented

---

## 6. RISKS & MITIGATION

### Risk Matrix

| Risk | Probability | Impact | Severity | Mitigation |
|------|------------|--------|----------|------------|
| **R1**: Anchor syntax breaks Markdown rendering | Low | High | Medium | Use HTML comments format, test in preview |
| **R2**: Migration script corrupts skill files | Low | Critical | High | Mandatory backups, dry-run first, validation gates |
| **R3**: Inconsistent anchor naming across skills | Medium | Medium | Medium | Define taxonomy first, validation enforces naming |
| **R4**: Low adoption of anchors in new skills | Medium | Medium | Medium | Template examples, documentation, training |
| **R5**: Performance degradation from large anchor blocks | Low | Medium | Low | Content guidelines (max size per anchor), monitoring |
| **R6**: Rollback fails to restore original state | Low | Critical | High | Test rollback on sample, verify with diff, keep backups for 30 days |

### Mitigation Details

**R1: Anchor Syntax Breaks Markdown Rendering**
- **Strategy**: Use HTML comment format identical to memory ANCHOR tags
- **Validation**: Test in VS Code, GitHub preview, Markdown lint tools
- **Fallback**: If rendering issues found, switch to metadata blocks

**R2: Migration Script Corrupts Skill Files**
- **Strategy**: Multi-layered safety:
  1. Mandatory backup before any modification
  2. Dry-run mode shows all changes without writing
  3. Interactive mode requires per-file confirmation
  4. Validation gate after migration (rollback if fails)
- **Testing**: Corrupt file detection, diff verification, rollback dry-run

**R3: Inconsistent Anchor Naming**
- **Strategy**: 
  1. Define taxonomy first (FR-1)
  2. Validation script enforces naming conventions
  3. Migration script uses taxonomy as source of truth
- **Enforcement**: Pre-commit hook validates anchor names

**R4: Low Adoption in New Skills**
- **Strategy**:
  1. Templates include anchor examples with comments
  2. "How to use anchors" section in each template
  3. Validation script runs in CI (warnings for missing anchors)
- **Tracking**: Monthly coverage reports, trend analysis

**R5: Performance Degradation**
- **Strategy**:
  1. Content guidelines: max 500 lines per anchor block
  2. Encourage splitting large sections into multiple anchors
  3. Monitor skill load times (baseline vs post-anchor)
- **Alert threshold**: >10ms increase in load time

**R6: Rollback Fails**
- **Strategy**:
  1. Test rollback procedure on sample skill before bulk migration
  2. Verify restored files byte-identical to originals (diff)
  3. Keep backups for 30 days post-migration
  4. Document rollback procedure in runbook
- **Testing**: Automated rollback test in migration script

---

## 7. CONSTRAINTS

### Technical Constraints

- **Anchor format**: Must match memory ANCHOR syntax exactly (HTML comments)
- **No breaking changes**: Skills without anchors must continue working
- **No memory indexing**: Skill docs remain outside memory system
- **File encoding**: UTF-8 only, no BOM
- **Line endings**: LF (Unix style), not CRLF

### Operational Constraints

- **Migration timing**: Off-hours or low-traffic period (minimize disruption)
- **Rollback window**: Must be able to rollback within 1 hour if issues detected
- **Backup retention**: 30 days minimum
- **Approval required**: Documentation lead sign-off before batch migration

### Resource Constraints

- **Development time**: 1 developer, 40 hours allocated
- **Review time**: Documentation lead, 8 hours allocated
- **Testing**: QA engineer, 4 hours allocated
- **No infrastructure changes**: Use existing tools and scripts

---

## 8. ASSUMPTIONS

1. **Anchor format stability**: Memory ANCHOR format will not change during implementation
2. **Template usage**: New skills are created from templates (not ad-hoc)
3. **Markdown compatibility**: Anchor HTML comments render invisibly in all Markdown viewers
4. **Skill stability**: No major skill refactoring planned during migration window
5. **Backup storage**: Sufficient disk space for 30-day backup retention (~10MB estimated)
6. **Python availability**: Python 3.8+ available in development environment
7. **Git tracking**: All skill files tracked in Git (no uncommitted changes before migration)

---

## 9. DEPENDENCIES

### Upstream Dependencies
- Memory ANCHOR format specification (reference implementation in memory/*.md files)
- sk-doc skill structure (template source of truth)

### Downstream Dependencies
- None (this is infrastructure work, no dependencies on this feature)

### External Dependencies
- Python 3.8+ (migration and validation scripts)
- Git (backup and rollback mechanism)
- Markdown rendering tools (validation testing)

---

## 10. RELATED WORK

### Prior Art
- **Memory system ANCHOR format**: Implemented in `.opencode/specs/02--system-spec-kit` memory files
- **5-state memory model**: Provides reference for anchor usage patterns
- **Template system**: `.opencode/skill/sk-doc/` templates as foundation

### Related Initiatives
- **Spec Kit Memory MCP**: Will benefit from anchored skills (better context retrieval)
- **Documentation quality initiative**: Anchors enable structural quality checks
- **Agent routing improvements**: Anchored "when-to-use" sections improve routing accuracy

### Future Work
- **Semantic skill search**: Query skills by anchor content ("show all validation rules")
- **Skill composition**: Dynamically compose new skills from anchored sections
- **Quality metrics**: Measure skill documentation quality via anchor coverage
- **Auto-generated skill indexes**: Extract anchored summaries for skill catalog

---

## 11. OUT OF SCOPE (EXPLICIT)

The following are **explicitly excluded** from this initiative:

1. **Memory indexing**: Skill docs will NOT be indexed in memory MCP database
2. **Schema changes**: No modifications to memory database schema
3. **Agent routing**: No changes to how agents discover or invoke skills
4. **Skill invocation**: No API changes to skill loading mechanisms
5. **Non-markdown files**: Scripts, configs, JSON files remain unchanged
6. **Deprecated skills**: Legacy folders marked for removal are skipped
7. **Skill content**: No refactoring or improvement of skill content itself
8. **Performance optimization**: No skill loading performance improvements (beyond avoiding regressions)

---

## 12. APPROVAL

### Stakeholders

| Role | Name | Responsibility | Approval Required |
|------|------|----------------|-------------------|
| Product Owner | TBD | Requirements validation | ✅ Yes |
| Tech Lead | TBD | Technical approach | ✅ Yes |
| Documentation Lead | TBD | Template updates, taxonomy | ✅ Yes |
| QA Lead | TBD | Testing strategy | ⭐ Recommended |

### Approval Status

- [ ] Requirements reviewed and approved
- [ ] Technical approach validated
- [ ] Risk mitigation strategy accepted
- [ ] Resource allocation confirmed
- [ ] Ready to proceed to planning phase

**Approval Date**: _Pending_  
**Approved By**: _Pending_

---

## 13. REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-17 | System | Initial spec creation |
