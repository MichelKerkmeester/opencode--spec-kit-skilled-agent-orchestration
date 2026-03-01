---
title: "Decision Record: Post-Merge Refinement Final [043-post-merge-refinement-final/decision-record]"
description: "This document records architecture decisions made during the post-merge refinement phase, including accepted technical debt and deferred improvements."
trigger_phrases:
  - "decision"
  - "record"
  - "post"
  - "merge"
  - "refinement"
  - "decision record"
  - "043"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Post-Merge Refinement Final

This document records architecture decisions made during the post-merge refinement phase, including accepted technical debt and deferred improvements.

---

## DR-009: SKILL.md/YAML Parity Gap (P2-007)

### Context
There is a structural "parity gap" between SKILL.md documentation and the YAML execution files. Changes to one require manual updates to the other.

### Decision
**ACCEPTED AS TECHNICAL DEBT** - Document the gap rather than fix it now.

### Rationale
- Fixing requires significant architecture change
- Current system works, just requires discipline
- Future solution: Generate docs from YAML or vice versa

### Mitigation
- Add checklist item: "Update both SKILL.md and YAML when changing workflows"
- Document which files need to stay in sync

### Files Affected
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/command/spec_kit/assets/*.yaml`

---

## DR-010: Maintenance Tax (P2-008)

### Context
Changes to SpecKit workflows require updating 3 locations:
1. SKILL.md (documentation)
2. AGENTS.md (gate definitions)
3. Command YAML files (execution)

### Decision
**ACCEPTED AS TECHNICAL DEBT** - Document the maintenance requirements.

### Rationale
- Single source of truth would require major refactoring
- Current approach provides flexibility
- Trade-off: More maintenance for more control

### Mitigation
- Create maintenance checklist in SKILL.md
- Add cross-reference comments in each file

### Maintenance Checklist
When changing SpecKit workflows:
- [ ] Update SKILL.md workflow section
- [ ] Update AGENTS.md if gates affected
- [ ] Update relevant command .md files
- [ ] Update YAML assets if execution changes
- [ ] Run validation on affected spec folders

---

## DR-011: Level 0 Protocol (P2-009)

### Context
Currently, even trivial changes (<10 LOC) require a full spec folder with spec.md, plan.md, tasks.md.

### Decision
**DEFERRED** - Document the need but don't implement now.

### Rationale
- Implementing Level 0 requires careful design
- Risk of abuse (everything becomes "trivial")
- Current Level 1 is lightweight enough for most cases

### Future Proposal
Level 0 could include:
- Single `hotfix.md` file
- No plan or tasks required
- Auto-archive after 24 hours
- Limited to <10 LOC changes

### When to Revisit
- If users frequently complain about overhead for small fixes
- If we see patterns of skipping documentation for small changes

---

## DR-012: YAML Quote Escaping Fix (P3-002)

### Context
Three YAML files in `.opencode/command/create/assets/` had invalid syntax due to nested double quotes in `command:` values. The pattern `"Read(".opencode/...")"` caused YAML parse errors.

### Decision
**FIXED** - Changed outer quotes from double to single quotes.

### Files Fixed
- `create_folder_readme.yaml` (line 413)
- `create_skill_asset.yaml` (line 318)
- `create_skill_reference.yaml` (line 430)

### Change Applied
```yaml
# Before (invalid):
command: "Read(".opencode/skill/system-memory/SKILL.md")"

# After (valid):
command: 'Read(".opencode/skill/system-memory/SKILL.md")'
```

### Verification
All YAML files now pass `python3 -c "import yaml; yaml.safe_load(...)"`

---

## DR-013: P3 Code Issues Assessment

### P3-001: Deprecated substr() Call
**Status:** NOT FOUND - No `substr()` calls exist in `.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.js`. The file uses `substring()` and `slice()` correctly.

### P3-003, P3-004, P3-005: Search Result Enrichment
**Status:** ALREADY IMPLEMENTED - The `memory_stats` handler at `context-server.js:1134-1135` already includes:
- `sqliteVecAvailable: vectorIndex.isVectorSearchAvailable()`
- `vectorSearchEnabled: vectorIndex.isVectorSearchAvailable()`

The `formatSearchResults` function already includes `importanceTier` in results. No changes needed.

---

## Summary

| Issue | Status | Action |
|-------|--------|--------|
| P2-007 | Accepted as debt | Document parity gap |
| P2-008 | Accepted as debt | Document maintenance tax |
| P2-009 | Deferred | Level 0 not implemented |
| P3-001 | Not applicable | No substr() found |
| P3-002 | Fixed | YAML quote escaping |
| P3-003 | Already done | sqlite-vec status in stats |
| P3-004 | Already done | importanceTier in results |
| P3-005 | Partial | embedding_status not tracked |
