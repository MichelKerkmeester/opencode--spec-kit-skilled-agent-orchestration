---
title: "Decision Record: Retrieval Anchors for Skill Documentation [006-anchor-implementation/decision-record]"
description: "Spec Folder: .opencode/specs/03--commands-and-skills/sk-doc/006-anchor-implementation"
trigger_phrases:
  - "decision"
  - "record"
  - "retrieval"
  - "anchors"
  - "for"
  - "decision record"
  - "033"
  - "anchor"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

<!-- ANCHOR:summary -->
# Decision Record: Retrieval Anchors for Skill Documentation

**Spec Folder**: `.opencode/specs/03--commands-and-skills/sk-doc/006-anchor-implementation`  
**Level**: 3+ (Governance + Architecture)  
**Status**: Planning  
**Created**: 2026-02-17
<!-- /ANCHOR:summary -->

---

## DECISION LOG

### D001: Anchor Format - HTML Comments vs Metadata Blocks

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Architecture Team

**Context**:
Need to choose anchor tag format that is:
- Invisible in Markdown renderers
- Standard and widely supported
- Easy to parse programmatically
- Non-intrusive to content

**Options Considered**:

| Option | Syntax | Pros | Cons |
|--------|--------|------|------|
| **HTML Comments** | `<!-- ANCHOR: name -->` | Invisible, standard, widely supported | Slightly verbose |
| **Metadata Blocks** | `---anchor: name---` | Shorter, more visible | Not standard, may break renderers |
| **Section IDs** | `## Heading {#id}` | Native Markdown feature | Only works for headings, limited support |
| **Separate Files** | `.anchor.json` | No content modification | Fragile (line number coupling), high maintenance |

**Decision**: Use **HTML Comment format** (`<!-- ANCHOR: name -->`)

**Rationale**:
1. **Standard**: HTML comments are part of HTML spec, supported by all Markdown renderers
2. **Invisible**: Renders invisibly in VS Code, GitHub, GitLab (no visual clutter)
3. **Proven**: Identical to memory ANCHOR format (consistency across system)
4. **Flexible**: Works for arbitrary content blocks, not just headings
5. **Low Risk**: Won't break existing Markdown rendering

**Consequences**:
- ✅ Zero risk to Markdown rendering
- ✅ Consistency with memory system
- ⚠️ Slightly more verbose than alternatives
- ⚠️ Requires HTML comment parsing (not native Markdown)

**Alternatives Rejected**:
- Metadata blocks: Not standard, may break renderers
- Section IDs: Insufficient flexibility (heading-only)
- Separate files: Too fragile, high maintenance

**Validation**:
- [x] Tested in VS Code Markdown preview (renders invisibly)
- [x] Tested in GitHub preview (renders invisibly)
- [ ] Test in GitLab (if used)

---

### D002: Migration Strategy - Automated vs Manual

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Tech Lead

**Context**:
~100 skill Markdown files need anchors added. Options: fully automated script, fully manual, or hybrid approach.

**Options Considered**:

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| **Fully Automated** | Script adds all anchors | Fast, consistent | May miss edge cases, less accurate |
| **Fully Manual** | Humans add all anchors | Highest accuracy | Slow (40+ hours), inconsistent |
| **Hybrid (Chosen)** | Script + manual review | Balance of speed and quality | Requires 2-step process |

**Decision**: Use **Hybrid approach** (automated migration + manual refinement)

**Rationale**:
1. **Efficiency**: Script handles 80% of cases correctly (saves ~30 hours)
2. **Quality**: Manual review catches edge cases and improves key skills
3. **Safety**: Dry-run mode allows review before changes
4. **Flexibility**: Interactive mode for uncertain files
5. **Rollback**: Automated backup/rollback if issues found

**Implementation**:
- **Phase 1**: Automated script with anchor mapping patterns (section detection)
- **Phase 2**: Dry-run review to identify edge cases
- **Phase 3**: Batch migration with backups
- **Phase 4**: Manual refinement of key skills (system-spec-kit, sk-doc)

**Consequences**:
- ✅ 80% time savings vs fully manual
- ✅ Higher quality than fully automated
- ✅ Rollback safety net
- ⚠️ Requires script development time (11 hours)
- ⚠️ Still needs manual review (5 hours)

**Alternatives Rejected**:
- Fully automated: Too risky, lower quality
- Fully manual: Too slow (40+ hours)

**Success Criteria**:
- [ ] ≥80% of anchors placed correctly by script
- [ ] Manual review improves key skills to ≥90% coverage
- [ ] Zero data loss (verified with backups)

---

### D003: Anchor Taxonomy Scope - Minimal vs Comprehensive

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Documentation Lead

**Context**:
Need to define how many anchor types to support. Balance between flexibility and simplicity.

**Options Considered**:

| Option | Anchor Count | Pros | Cons |
|--------|--------------|------|------|
| **Minimal** | 3-5 anchors | Simple, easy to remember | Insufficient granularity |
| **Comprehensive (Chosen)** | 10-15 anchors | Flexible, precise retrieval | More to learn, validate |
| **Extensive** | 20+ anchors | Maximum flexibility | Complex, hard to maintain |

**Decision**: Use **Comprehensive taxonomy** (10-15 anchor types)

**Anchor Categories**:
1. **Summary anchors**: `summary` (overview)
2. **Structural anchors**: `when-to-use`, `how-it-works`, `rules`
3. **Operational anchors**: `examples`, `workflows`, `troubleshooting`
4. **Metadata anchors**: `resources`, `decisions`, `validation`

**Rationale**:
1. **Sufficient granularity**: Covers all major skill documentation sections
2. **Semantic clarity**: Each anchor has clear purpose
3. **Extensible**: Can add more types later without breaking existing
4. **Manageable**: Not too many to overwhelm users (10-15 is sweet spot)
5. **Alignment**: Matches memory system's semantic structure

**Consequences**:
- ✅ Precise retrieval (can target specific sections)
- ✅ Semantic clarity (anchor names self-documenting)
- ✅ Room for growth (can add more types)
- ⚠️ Requires documentation (taxonomy guide needed)
- ⚠️ Validation complexity (more anchor types to check)

**Alternatives Rejected**:
- Minimal: Too coarse, insufficient for precise retrieval
- Extensive: Overkill, hard to maintain

**Validation**:
- [ ] Taxonomy covers ≥80% of skill sections
- [ ] Anchor names intuitive (user testing)
- [ ] Taxonomy approved by documentation lead

---

### D004: Coverage Targets - Strict vs Flexible

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: QA Lead

**Context**:
Need to define quality targets for % of sections anchored. Balance between thoroughness and practicality.

**Options Considered**:

| Option | SKILL.md | References | Assets | Pros | Cons |
|--------|----------|------------|--------|------|------|
| **Strict** | 100% | 100% | 100% | Comprehensive | Unrealistic, excessive overhead |
| **Flexible (Chosen)** | 80% | 60% | 40% | Achievable, pragmatic | Some sections may lack anchors |
| **Minimal** | 50% | 30% | 0% | Easy to hit | Insufficient coverage |

**Decision**: Use **Flexible targets** (80/60/40)

**Target Breakdown**:
- **SKILL.md**: 80% (main file, highest priority)
- **References**: 60% (detailed docs, medium priority)
- **Assets**: 40% (checklists/patterns, many don't need anchors)

**Rationale**:
1. **Pragmatic**: Not all sections benefit from anchors (some too small or specialized)
2. **Prioritized**: Highest coverage for most important file (SKILL.md)
3. **Achievable**: Targets reachable with automated migration + manual refinement
4. **Flexible**: Allows skipping trivial sections (e.g., single-paragraph sections)
5. **Extensible**: Can increase targets later as system matures

**Consequences**:
- ✅ Achievable within project timeline
- ✅ Focuses effort on high-value content
- ✅ Allows practical exemptions (trivial sections)
- ⚠️ Some sections won't have anchors (acceptable trade-off)
- ⚠️ Requires validation to enforce targets

**Alternatives Rejected**:
- Strict: Unrealistic, would require 100% manual work
- Minimal: Insufficient coverage for effective retrieval

**Success Criteria**:
- [ ] ≥80% SKILL.md sections anchored (validation script confirms)
- [ ] ≥60% reference doc sections anchored
- [ ] ≥40% asset doc sections anchored (where applicable)
- [ ] Key skills (system-spec-kit, sk-doc) at ≥90%

---

### D005: Validation Enforcement - Warning vs Blocking

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Tech Lead

**Context**:
When validation script detects issues, should it block deployment (CI failure) or just warn?

**Options Considered**:

| Option | Behavior | Pros | Cons |
|--------|----------|------|------|
| **Blocking** | CI fails on any error | Enforces quality | May block legitimate work |
| **Warning Only** | CI warns, doesn't fail | Flexible, non-intrusive | Quality may degrade over time |
| **Hybrid (Chosen)** | Block on format errors, warn on coverage | Balance of quality and flexibility | More complex logic |

**Decision**: Use **Hybrid approach**
- **Block** on format errors (orphaned tags, mismatched tags, nested anchors)
- **Warn** on coverage issues (low coverage, missing anchors)

**Rationale**:
1. **Format errors are bugs**: Orphaned/mismatched tags break parsing → must be fixed
2. **Coverage is aspirational**: Low coverage is suboptimal but not broken → can be improved later
3. **Avoids false blocks**: Won't block PRs for legitimate reasons (e.g., asset doesn't need anchors)
4. **Encourages improvement**: Warnings still visible, prompts action without blocking
5. **Flexibility**: Allows emergency fixes without anchor updates

**Implementation**:
```bash
# Exit codes:
# 0 = pass (no errors, no warnings)
# 1 = warnings only (low coverage, minor issues) → CI passes
# 2 = errors (format issues) → CI fails
```

**Consequences**:
- ✅ Format correctness enforced (no broken anchors)
- ✅ Flexibility for legitimate edge cases
- ✅ Visible warnings encourage improvement
- ⚠️ Coverage may degrade if warnings ignored
- ⚠️ Requires discipline to address warnings

**Alternatives Rejected**:
- Blocking: Too strict, would block legitimate work
- Warning Only: Risk of quality degradation

**Monitoring**:
- [ ] Track warning trends monthly (alert if increasing)
- [ ] Quarterly review of ignored warnings
- [ ] Escalate to blocking if warnings consistently ignored

---

### D006: Memory Indexing - Include Skills vs Exclude

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Architecture Team

**Context**:
Should skill documentation be indexed in memory MCP database, now that it has anchors?

**Options Considered**:

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| **Include Skills** | Index skills in memory DB | Unified search, cross-skill queries | Database bloat, skills != memories |
| **Exclude Skills (Chosen)** | Skills stay outside memory system | Clean separation, focused memory | No cross-skill semantic search |
| **Hybrid** | Index SKILL.md only | Partial benefits | Inconsistent, complex logic |

**Decision**: **Exclude skills from memory indexing**

**Rationale**:
1. **Different purposes**: Skills are static capabilities, memories are dynamic context
2. **Separation of concerns**: Skills are loaded on-demand, memories are retrieved semantically
3. **Database focus**: Memory DB optimized for conversation context, not documentation
4. **No breaking changes**: Maintains existing skill loading mechanisms
5. **Future flexibility**: Can revisit decision later if use case emerges

**Implementation**:
- Anchors added to skills (enables structured extraction)
- Memory MCP tools do NOT index skill docs
- Skill loader remains unchanged (reads from filesystem)
- Future: If semantic skill search needed, build separate skill index

**Consequences**:
- ✅ Clean separation of concerns (skills vs memories)
- ✅ No memory DB bloat
- ✅ No breaking changes to existing systems
- ⚠️ No cross-skill semantic search (acceptable for now)
- ⚠️ Two separate retrieval systems (skills vs memories)

**Alternatives Rejected**:
- Include skills: Database bloat, purpose confusion
- Hybrid: Inconsistent, added complexity

**Future Considerations**:
- If semantic skill search becomes valuable → Build separate skill search index
- If skills need version history → Memory system could track skill evolution
- If skills need memory-like features (staleness, importance) → Revisit decision

**Review Date**: 2026-Q3 (reassess after 6 months of usage)

---

### D007: Rollback Strategy - Backup Directory vs Git

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Tech Lead

**Context**:
Migration modifies 100+ files. Need rollback strategy if issues found. Options: backup directory vs Git revert.

**Options Considered**:

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| **Backup Directory (Chosen)** | Copy files before migration | Fast, independent of Git | Requires disk space, manual cleanup |
| **Git Revert** | Commit migration, revert if needed | Integrated with version control | Requires clean working directory, slower |
| **Both** | Backup + Git commit | Maximum safety | Overkill, redundant |

**Decision**: Use **Backup Directory** as primary rollback, Git as secondary

**Rationale**:
1. **Speed**: Backup/restore is faster than Git operations (seconds vs minutes)
2. **Independence**: Works even if Git is in inconsistent state
3. **Verification**: Easy to diff backup vs current (byte-level comparison)
4. **Simplicity**: Single script handles backup + rollback
5. **Git as backup**: Can still use Git revert if backup fails

**Implementation**:
```bash
# Before migration:
mkdir -p backups/20260217_1430_anchor_migration
cp -r .opencode/skill backups/20260217_1430_anchor_migration/

# Rollback if needed:
rm -rf .opencode/skill
cp -r backups/20260217_1430_anchor_migration/skill .opencode/skill
```

**Consequences**:
- ✅ Fast rollback (<1 minute)
- ✅ Independent of Git state
- ✅ Byte-level verification possible
- ⚠️ Requires disk space (~10MB per backup)
- ⚠️ Manual backup cleanup after 30 days

**Alternatives Rejected**:
- Git Revert only: Slower, requires clean working directory
- Both: Overkill, redundant effort

**Backup Retention**:
- Keep backups for 30 days post-migration
- After 30 days: Delete backup if no issues reported
- Store backup path in migration log for reference

**Rollback SLA**: <1 hour from decision to rollback completion

---

### D008: Template Update Timing - Before vs After Migration

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Documentation Lead

**Context**:
Should templates be updated before or after bulk migration? Order affects new skill creation during migration period.

**Options Considered**:

| Option | Sequence | Pros | Cons |
|--------|----------|------|------|
| **Templates First (Chosen)** | Update templates → Migrate existing | New skills start with anchors | Temporary inconsistency during migration |
| **Migration First** | Migrate existing → Update templates | Consistent state during migration | New skills miss anchors during migration |
| **Simultaneous** | Templates + migration together | No inconsistency | Higher complexity, riskier |

**Decision**: **Update templates first** (before bulk migration)

**Rationale**:
1. **New skills benefit immediately**: Any skill created during migration gets anchors
2. **Template as reference**: Migrated skills can reference templates for anchor patterns
3. **Validation**: Templates can be validated independently before bulk migration
4. **Risk isolation**: Template issues discovered early, not mixed with migration issues
5. **Documentation**: Template updates serve as migration guide for manual refinement

**Implementation**:
- **Phase 1**: Update all three templates (skill_md, skill_reference, skill_asset)
- **Gate 1**: Template review and approval
- **Phase 2**: Develop migration script (can reference templates for patterns)
- **Phase 3**: Bulk migration (templates already updated)

**Consequences**:
- ✅ New skills get anchors immediately
- ✅ Templates serve as migration reference
- ✅ Risk isolation (template issues found early)
- ⚠️ Temporary inconsistency (new skills have anchors, old skills don't)
- ⚠️ 1-2 day window of inconsistency during migration

**Alternatives Rejected**:
- Migration first: New skills during migration would miss anchors
- Simultaneous: Too risky, harder to debug issues

**Communication**:
- [ ] Notify team: "Templates updated, existing skills will be migrated soon"
- [ ] Document temporary inconsistency in migration guide
- [ ] Estimate migration completion date

---

## RISK ASSESSMENT DECISIONS

### D009: Risk Mitigation - Depth of Testing

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: QA Lead

**Context**:
How thorough should testing be before bulk migration? Balance between safety and speed.

**Options Considered**:

| Option | Testing Scope | Pros | Cons |
|--------|---------------|------|------|
| **Minimal** | Script unit tests only | Fast, low effort | Higher risk in production |
| **Standard (Chosen)** | Unit + integration + dry-run | Balanced risk/effort | Still possible edge cases |
| **Comprehensive** | Unit + integration + full manual review | Lowest risk | Slow, high effort |

**Decision**: Use **Standard testing** (unit + integration + dry-run review)

**Testing Levels**:
1. **Unit tests**: Core functions (detect, insert, validate) → pytest
2. **Integration tests**: Full workflow (dry-run, backup, rollback) → pytest
3. **Dry-run review**: Manual review of proposed changes on all skills
4. **Rollback test**: Verify rollback restores exact originals (diff check)

**Rationale**:
1. **Risk-appropriate**: Migration is reversible (backups), so exhaustive testing not critical
2. **Time-boxed**: Standard testing fits within project timeline (40 hours)
3. **Dry-run safety net**: Manual review of dry-run output catches edge cases
4. **Rollback tested**: Confidence in rollback reduces need for perfect migration
5. **Incremental validation**: Post-migration validation catches any issues

**Consequences**:
- ✅ Balanced risk/effort
- ✅ Rollback safety net reduces risk
- ✅ Fits within timeline
- ⚠️ Edge cases may slip through (acceptable with rollback)
- ⚠️ Some manual validation needed post-migration

**Alternatives Rejected**:
- Minimal: Too risky, could miss major issues
- Comprehensive: Overkill, doesn't fit timeline

**Testing Budget**:
- Unit tests: 2 hours
- Integration tests: 2 hours
- Dry-run review: 2 hours
- Manual testing: 1 hour
- **Total**: 7 hours (18% of project time)

---

### D010: Failure Threshold - When to Halt Migration

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Tech Lead

**Context**:
At what error rate should batch migration halt automatically? Need threshold that balances stopping bad migrations vs false alarms.

**Options Considered**:

| Option | Threshold | Pros | Cons |
|--------|-----------|------|------|
| **Zero Tolerance** | Halt on any error | Maximum safety | Too strict, may halt on trivial issues |
| **5% Threshold (Chosen)** | Halt if >5% files fail | Balanced | May allow some bad migrations |
| **10% Threshold** | Halt if >10% files fail | Flexible | Risk of more damage before halt |
| **Manual Only** | Never halt automatically | Maximum control | Risk of missing systemic issues |

**Decision**: **Halt if error rate >5%** (>5 files out of 100 fail)

**Rationale**:
1. **Signal detection**: >5% errors likely indicates systemic issue, not edge cases
2. **Damage limitation**: Stops migration before affecting majority of files
3. **Manual override**: Operator can continue after review if errors are acceptable
4. **Historical data**: Similar migrations show <2% edge case failure rate (5% has margin)
5. **Rollback available**: Can rollback even if more files affected

**Implementation**:
```python
def should_halt_migration(total_files, failed_files):
    error_rate = failed_files / total_files
    if error_rate > 0.05:
        logger.error(f"Error rate {error_rate:.1%} exceeds 5% threshold. Halting migration.")
        return True
    return False
```

**Consequences**:
- ✅ Early detection of systemic issues
- ✅ Limits damage if script has bugs
- ✅ Manual override available
- ⚠️ May halt on clustered edge cases (e.g., one skill has many malformed files)
- ⚠️ Requires monitoring during migration

**Alternatives Rejected**:
- Zero tolerance: Too strict, would halt on trivial issues
- 10% threshold: Too permissive, more damage possible
- Manual only: Risk of missing issues during unattended migration

**Monitoring**:
- [ ] Real-time progress display (files processed, errors, error rate)
- [ ] Alert if error rate approaches 5%
- [ ] Pause for review at 4% error rate

---

## GOVERNANCE DECISIONS

### D011: Approval Requirements - Who Must Sign Off

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Product Owner

**Context**:
Migration affects all skill documentation (foundation of agent system). Need approval process balancing thoroughness vs speed.

**Options Considered**:

| Option | Approvers | Pros | Cons |
|--------|-----------|------|------|
| **Minimal** | Tech Lead only | Fast | Missing domain expertise |
| **Standard (Chosen)** | Tech Lead + Doc Lead + QA Lead | Balanced, covers all concerns | 3 approvals needed |
| **Extensive** | + Product Owner + Security | Comprehensive | Slow, bureaucratic |

**Decision**: **Standard approvals** (Tech Lead, Documentation Lead, QA Lead)

**Approval Matrix**:

| Gate | Required Approvers | Approval Type |
|------|-------------------|---------------|
| **Gate 1: Template Review** | Documentation Lead | ✅ HARD BLOCK |
| **Gate 2: Migration Dry-Run** | Tech Lead | ✅ HARD BLOCK |
| **Gate 3: Validation** | QA Lead | ✅ HARD BLOCK |
| **Gate 4: Documentation** | Documentation Lead | ✅ HARD BLOCK |

**Rationale**:
1. **Expertise coverage**: Each approver brings domain expertise
   - Tech Lead: Architecture, technical approach
   - Doc Lead: Template quality, anchor taxonomy, guidelines
   - QA Lead: Testing strategy, validation approach
2. **Appropriate rigor**: Matches initiative complexity (Level 3+)
3. **Parallel approvals**: Gates can be reviewed in parallel (not sequential)
4. **Clear accountability**: Each gate has single approver (no ambiguity)

**Consequences**:
- ✅ Domain expertise at each gate
- ✅ Clear accountability
- ✅ Parallel approvals possible
- ⚠️ 3 approvals needed (coordination overhead)
- ⚠️ Approval delays if approver unavailable

**Alternatives Rejected**:
- Minimal: Missing documentation and QA expertise
- Extensive: Overkill for documentation initiative

**Approval SLA**: 24 hours per gate (expedited if urgent)

---

### D012: Rollback Authority - Who Can Trigger Rollback

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Tech Lead

**Context**:
If issues found post-migration, who has authority to trigger rollback? Need clear decision chain.

**Options Considered**:

| Option | Authority | Pros | Cons |
|--------|-----------|------|------|
| **Anyone** | Any team member | Fast response | Risk of unnecessary rollbacks |
| **Tech Lead Only** | Tech Lead approval required | Controlled | Bottleneck, slow response |
| **Tiered (Chosen)** | Automatic (severe) + Tech Lead (moderate) | Balanced | More complex logic |

**Decision**: **Tiered rollback authority**

**Rollback Triggers**:

| Severity | Trigger Condition | Authority | Response Time |
|----------|-------------------|-----------|---------------|
| **Automatic** | Validation errors >5% files | Script auto-rollback | Immediate |
| **Automatic** | Skill loading breaks | Script auto-rollback | Immediate |
| **Manual - Tech Lead** | Markdown rendering issues | Tech Lead approval | <1 hour |
| **Manual - Tech Lead** | Performance degradation >10ms | Tech Lead approval | <2 hours |
| **Manual - Team Request** | Team requests rollback | Tech Lead approval | <4 hours |

**Rationale**:
1. **Severe issues auto-rollback**: No human delay for critical failures
2. **Moderate issues need judgment**: Tech Lead assesses if rollback necessary
3. **Clear escalation path**: Team reports issues → Tech Lead decides
4. **Time-boxed**: Each level has response time SLA

**Implementation**:
```python
def check_rollback_triggers():
    if validation_error_rate > 0.05:
        return RollbackDecision.AUTOMATIC, "Validation error rate >5%"
    if skill_loading_broken():
        return RollbackDecision.AUTOMATIC, "Skill loading regression"
    # Manual triggers require Tech Lead approval
    return RollbackDecision.NO_ROLLBACK, ""
```

**Consequences**:
- ✅ Fast response to critical issues (automatic)
- ✅ Human judgment for moderate issues
- ✅ Clear escalation path
- ⚠️ Requires monitoring to detect automatic triggers
- ⚠️ Tech Lead must be available for manual triggers

**Alternatives Rejected**:
- Anyone: Risk of unnecessary rollbacks
- Tech Lead Only: Bottleneck, slow response

**Communication**:
- [ ] Document rollback procedure in migration guide
- [ ] Create rollback decision flowchart
- [ ] Ensure Tech Lead available during migration window

---

## ARCHITECTURAL DECISIONS

### D013: Anchor Parsing - Runtime vs Preprocessing

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Tech Lead

**Context**:
How should anchored content be extracted? Parse at runtime when skill loaded, or preprocess into index?

**Options Considered**:

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| **Runtime Parsing (Chosen)** | Parse anchors when skill loaded | Simple, no preprocessing | Slight runtime overhead |
| **Preprocessing** | Extract anchors to index at build time | Faster retrieval | Build step complexity |
| **Hybrid** | Cache parsed anchors in memory | Fast after first load | Memory overhead, cache invalidation |

**Decision**: **Runtime parsing** (parse anchors when skill loaded)

**Rationale**:
1. **Simplicity**: No build step, no cache invalidation logic
2. **Low overhead**: Parsing HTML comments is fast (<1ms per file)
3. **Single source of truth**: Markdown files are canonical (no separate index)
4. **Flexibility**: Easy to change anchor format or add new anchor types
5. **Observability**: Can inspect raw Markdown to see anchors

**Implementation**:
```python
def extract_anchor(markdown_content: str, anchor_name: str) -> str:
    """Extract content between anchor tags."""
    pattern = f"<!-- ANCHOR: {anchor_name} -->(.*?)<!-- /ANCHOR: {anchor_name} -->"
    match = re.search(pattern, markdown_content, re.DOTALL)
    return match.group(1).strip() if match else None
```

**Performance**:
- Parsing overhead: <1ms per file
- Acceptable for skill loading (skills loaded infrequently, not hot path)
- If performance becomes issue: Add caching layer later

**Consequences**:
- ✅ Simple implementation (no build step)
- ✅ Single source of truth (Markdown files)
- ✅ Easy to change anchor format
- ⚠️ Slight runtime overhead (<1ms per file, acceptable)
- ⚠️ Must parse on every skill load (not cached)

**Alternatives Rejected**:
- Preprocessing: Adds build complexity, cache invalidation issues
- Hybrid: Overkill for infrequent skill loading

**Future Optimization** (if needed):
- Add LRU cache for parsed anchors (if performance becomes issue)
- Preprocess anchors if skills loaded frequently in hot path

---

### D014: Anchor Naming Convention - Hyphenated vs Underscored

**Date**: 2026-02-17  
**Status**: ✅ DECIDED  
**Decision Maker**: Documentation Lead

**Context**:
Anchor names need consistent naming convention. Options: hyphens, underscores, camelCase.

**Options Considered**:

| Option | Example | Pros | Cons |
|--------|---------|------|------|
| **Hyphenated (Chosen)** | `when-to-use` | Readable, Markdown-friendly | Slightly longer |
| **Underscored** | `when_to_use` | Common in code | Less readable in Markdown |
| **camelCase** | `whenToUse` | Compact | Inconsistent with Markdown style |
| **lowercase** | `whentouse` | Shortest | Unreadable for multi-word |

**Decision**: **Hyphenated lowercase** (e.g., `when-to-use`, `how-it-works`)

**Rationale**:
1. **Markdown convention**: Hyphens common in Markdown IDs and URLs
2. **Readability**: Hyphens visually separate words clearly
3. **Consistency**: Matches memory ANCHOR format (already uses hyphens)
4. **No case sensitivity**: All lowercase avoids case mismatch bugs
5. **URL-friendly**: Hyphens work in URLs (useful if anchors become linkable)

**Rules**:
- All lowercase (e.g., `summary`, not `Summary`)
- Hyphens for multi-word (e.g., `when-to-use`, not `whentouse`)
- No underscores (reserved for private/internal use if needed)
- No camelCase or PascalCase
- Alphabetic characters only (no numbers, unless necessary)

**Consequences**:
- ✅ Clear readability
- ✅ Consistency with memory system
- ✅ URL-friendly
- ⚠️ Slightly longer than underscores
- ⚠️ Requires documentation (users must know convention)

**Alternatives Rejected**:
- Underscored: Less readable in Markdown context
- camelCase: Inconsistent with Markdown style
- lowercase: Unreadable for multi-word anchors

**Validation**:
- [ ] Validation script enforces hyphenated lowercase pattern
- [ ] Error if anchor name contains uppercase, underscores, or spaces

---

## DECISION REVIEW SCHEDULE

| Decision | Review Date | Status | Action |
|----------|-------------|--------|--------|
| D001: Anchor Format | 2026-08-17 (6 months) | Pending | Re-evaluate if rendering issues reported |
| D002: Migration Strategy | N/A (one-time) | Final | No review needed |
| D003: Anchor Taxonomy | 2026-05-17 (3 months) | Pending | Assess if more anchor types needed |
| D004: Coverage Targets | 2026-08-17 (6 months) | Pending | Increase targets if adoption high |
| D005: Validation Enforcement | 2026-05-17 (3 months) | Pending | Re-evaluate if warnings consistently ignored |
| D006: Memory Indexing | 2026-08-17 (6 months) | Pending | Revisit if semantic skill search requested |
| D007: Rollback Strategy | N/A (one-time) | Final | No review needed |
| D008: Template Update Timing | N/A (one-time) | Final | No review needed |
| D009: Risk Mitigation | N/A (one-time) | Final | No review needed |
| D010: Failure Threshold | N/A (one-time) | Final | No review needed |
| D011: Approval Requirements | 2026-08-17 (6 months) | Pending | Assess if approval process effective |
| D012: Rollback Authority | N/A (one-time) | Final | No review needed |
| D013: Anchor Parsing | 2027-02-17 (1 year) | Pending | Re-evaluate if performance issues |
| D014: Anchor Naming | N/A (long-term) | Final | Only change if major migration needed |

---

## SUMMARY

**Total Decisions**: 14  
**Status**:
- ✅ DECIDED: 14
- 🔄 In Review: 0
- ⏸️ Deferred: 0

**Key Strategic Decisions**:
1. HTML comment format (consistent with memory system)
2. Hybrid migration strategy (automated + manual refinement)
3. Comprehensive anchor taxonomy (10-15 types)
4. Flexible coverage targets (80/60/40)
5. Skills excluded from memory indexing (separate concerns)

**Risk-Related Decisions**:
1. Backup directory primary rollback mechanism
2. 5% error threshold for halting migration
3. Tiered rollback authority (automatic + manual)
4. Standard testing depth (unit + integration + dry-run)

**Governance Decisions**:
1. Standard approval requirements (3 leads)
2. Template-first implementation order
3. Hybrid validation enforcement (block on errors, warn on coverage)

---

**Next Steps**:
1. Share decision record with stakeholders for review
2. Incorporate decisions into implementation plan
3. Schedule decision review dates (quarterly/semi-annual)
4. Begin Phase 1 implementation with approved decisions
