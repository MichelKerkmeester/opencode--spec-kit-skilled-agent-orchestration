---
title: "Plan: @write Agent Enforcement for /create Commands [002-write-agent-enforcement/plan]"
description: "For each command, make these changes"
trigger_phrases:
  - "plan"
  - "write"
  - "agent"
  - "enforcement"
  - "for"
  - "002"
importance_tier: "important"
contextType: "decision"
---
# Plan: @write Agent Enforcement for /create Commands

<!-- ANCHOR:implementation-strategy -->
## Implementation Strategy

### Phase A: Core Changes

For each command, make these changes:

#### 1. Add PHASE 0: WRITE AGENT VERIFICATION

**Location:** After `# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT` header, BEFORE existing phases

**Non-chained variant** (skill.md, install_guide.md, folder_readme.md):
- Insert ~50 lines of PHASE 0 block
- Proceeds to PHASE 1 if verified

**Chained variant** (skill_reference.md, skill_asset.md):
- Insert ~55 lines of PHASE 0 block with chained handling
- Skip PHASE 0 if `--chained` flag present
- Proceeds to PHASE C if verified or skipped

#### 2. Update Phase Status Verification Table

Add row for PHASE 0:
```
| PHASE 0: WRITE AGENT | ✅ PASSED [or ⏭️ N/A] | ______ | write_agent_verified: ______ |
```

#### 3. Update Violation Self-Detection

Add to Phase Violations list:
```
- Executed command without @write agent verification (Phase 0)
```

#### 4. Fix Emoji Inconsistencies

Per command_template.md Section 6:
- `## 2. 📋 CONTRACT` → `## 2. 📝 CONTRACT`
- `## 3. 📝 INSTRUCTIONS` → `## 3. ⚡ INSTRUCTIONS`
- `## 4. 📚 REFERENCE` → `## 4. 📌 REFERENCE`

### Phase B: Sync to Public Repo

Copy all 5 updated files to:
```
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/create/
```

<!-- /ANCHOR:implementation-strategy -->


<!-- ANCHOR:execution-order -->
## Execution Order

1. skill.md (most complex, 9-step workflow)
2. skill_reference.md (chained variant)
3. skill_asset.md (chained variant)
4. install_guide.md (non-chained)
5. folder_readme.md (non-chained)
6. Sync to public repo
7. Verify all changes

<!-- /ANCHOR:execution-order -->


<!-- ANCHOR:estimated-impact -->
## Estimated Impact

| File | Current Lines | Added Lines | New Total |
|------|---------------|-------------|-----------|
| skill.md | 399 | ~55 | ~454 |
| skill_reference.md | 373 | ~60 | ~433 |
| skill_asset.md | 377 | ~60 | ~437 |
| install_guide.md | 312 | ~55 | ~367 |
| folder_readme.md | 322 | ~55 | ~377 |

<!-- /ANCHOR:estimated-impact -->


<!-- ANCHOR:rollback-plan -->
## Rollback Plan

If issues arise:
1. Git revert changes in anobel.com repo
2. Git revert changes in public repo
3. Document issues in spec folder

<!-- /ANCHOR:rollback-plan -->
