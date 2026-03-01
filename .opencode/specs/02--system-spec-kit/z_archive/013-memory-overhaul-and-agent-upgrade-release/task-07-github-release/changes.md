# Changes — Task 07: Tagged Release

<!-- SPECKIT_LEVEL: 3+ -->

> Release preparation notes for v2.1.0.0 GitHub release

---

## Release Configuration

| Field | Value |
|-------|-------|
| **Tag** | v2.1.0.0 |
| **Title** | v2.1.0 - Memory Overhaul & Agent Upgrade Release |
| **Target Branch** | main |
| **Type** | Minor release (documentation alignment) |
| **Date** | 2026-02-16 |

---

## Release Notes (Final Draft)

### v2.1.0 - Memory Overhaul & Agent Upgrade Release

Cross-system documentation alignment following 11 source specs (014-016 agent system, 122-129 spec-kit system) across 3 tracks.

#### Agent Updates

- **Handover agent model verified** - Confirmed Haiku usage across OpenCode, Claude Code, and Codex platforms per spec 016
- **Review agent model-agnostic** - Verified removal of hardcoded model references across all 3 platforms per spec 015
- **Codex agent frontmatter conversion** - Verified Codex-native YAML frontmatter in 8 agent files per spec 016
- **Agent routing rules current** - Verified AGENTS.md routing table reflects spec 014 additions (speckit, context, review sub-agent dispatch)
- **Cross-platform parity achieved** - Confirmed body content synchronized across OpenCode/Claude/Codex agent definitions

#### Spec-Kit Updates

- **5-source indexing language** - All READMEs updated to reflect post-spec126 5-source pipeline (memory, constitutional, skill, project, spec docs)
- **7 intent coverage** - Documentation updated for expanded intent set (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision)
- **Schema v13 terminology** - References updated for document_type and spec_level fields throughout system-spec-kit docs
- **SKILL.md hardening notes** - Added post-spec126 hardening documentation (import fixes, specFolder filtering, metadata preservation)
- **Script inventory current** - References updated for upgrade-level.sh (spec 124), check-placeholders.sh (spec 128)
- **Template architecture v2.2** - References updated for CORE + ADDENDUM template structure

#### Documentation Updates

- **Command configs aligned** - Memory and spec_kit command docs updated for current parameter naming and agent routing behavior
- **Root README statistics** - Updated feature descriptions and technical statistics to match current system state
- **Install guide accuracy** - Corrected component counts and wording in install guide documentation
- **Skill catalog refreshed** - Updated .opencode/skill/README.md and workflow skill READMEs
- **3 changelog entries created** - Environment v2.1.0.0, Spec-Kit v2.2.19.0, Agent Orchestration v2.0.4.0

#### Breaking Changes

None. All changes are documentation alignment - no functional behavior modified, no API changes, no breaking configuration changes.

---

## Release Execution Blockers

### BLOCKED: Clean Release Commit Required

**Current State**: Working tree has uncommitted changes
**Required Before Publication**:
1. Final release commit cleaning up any remaining prep artifacts
2. Clean working tree verification (git status shows no changes)
3. Commit hash for tagging

**Evidence**: Publication steps in checklist.md items CHK-004 through CHK-009 marked blocked pending clean commit

### BLOCKED: GitHub Release URL

**Current State**: Release not yet published
**Required After Publication**:
- GitHub release URL for documentation references
- Release publication confirmation

**Evidence**: Checklist items CHK-005 and changes.md final documentation pending actual publication

---

## Release Command Template

Once clean commit is verified:

```bash
# Create and push tag
git tag -a v2.1.0.0 -m "v2.1.0 - Memory Overhaul & Agent Upgrade Release"
git push origin v2.1.0.0

# Create GitHub release (copy release notes above to RELEASE_NOTES.md first)
gh release create v2.1.0.0 \
  --title "v2.1.0 - Memory Overhaul & Agent Upgrade Release" \
  --notes-file RELEASE_NOTES.md \
  --target main
```

---

## Verification Evidence

| Item | Status | Evidence |
|------|--------|----------|
| Release notes drafted | Complete | This file, Release Notes section above |
| All task dependencies resolved | Complete | Tasks 01-06 complete per root tasks.md |
| 3 changelogs created | Complete | Task 05 changes.md lists all 3 files |
| Root README updated | Complete | Task 06 changes.md documents 11 changes (commit ff21d305) |
| Clean commit | BLOCKED | Pending final release commit |
| Tag creation | BLOCKED | Pending clean commit |
| GitHub release URL | BLOCKED | Pending publication |
