---
title: "Implementation Plan: Post-Release Refinement 1 [046-post-release-refinement-1/plan]"
description: "Execute systematic bug fixes across the OpenCode infrastructure in priority order, ensuring stability at each phase before proceeding to the next. Each phase includes validation..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "post"
  - "release"
  - "refinement"
  - "046"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Post-Release Refinement 1

<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit/templates/plan.md -->

| Metadata | Value |
|----------|-------|
| **Level** | 3 |
| **Status** | Draft |
| **Created** | 2025-12-26 |
| **Phases** | 4 |
| **Estimated Duration** | 4 weeks |

---

## OBJECTIVE

Execute systematic bug fixes across the OpenCode infrastructure in priority order, ensuring stability at each phase before proceeding to the next. Each phase includes validation gates to prevent regressions.

---

## QUALITY GATES

| Gate | Criteria | Enforcement |
|------|----------|-------------|
| G1 | All critical bugs fixed and validated | Before Phase 2 |
| G2 | All high severity bugs fixed and validated | Before Phase 3 |
| G3 | No regressions introduced | Continuous |
| G4 | Documentation matches implementation | Before completion |

---

## PROJECT STRUCTURE

```
046-post-release-refinement-1/
├── spec.md                    # This specification
├── plan.md                    # Implementation plan (this file)
├── tasks.md                   # Detailed task breakdown
├── checklist.md               # Validation checklist
├── decision-record.md         # Architecture decisions
├── memory/                    # Session context
│   └── *.md                   # Memory files
└── scratch/                   # Temporary files
    ├── test-results/          # Validation outputs
    └── backups/               # Pre-fix backups
```

---

## IMPLEMENTATION PHASES

### Phase 1: Critical Bug Fixes (P0) - Week 1

**Objective:** Fix all 6 critical bugs that affect system reliability and data integrity.

#### 1.1 Memory System Critical Fixes

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| C1 | Fix duplicate entries on checkpoint restore | checkpoints.js | 2h |
| C2 | Add orphaned file detection | vector-index.js | 3h |
| C6 | Add transaction to recordValidation | confidence-tracker.js | 1h |

**Implementation Order:**
1. C6 (simplest, establishes transaction pattern)
2. C2 (builds on integrity checking)
3. C1 (most complex, affects checkpoint system)

**Validation:**
- [ ] Run memory_search, verify no duplicates
- [ ] Delete test file, run verifyIntegrity, confirm detection
- [ ] Run concurrent validation calls, verify counts

#### 1.2 Documentation & Config Critical Fixes

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| C3 | Fix broken skill references | create_*.yaml (3 files) | 30m |
| C4 | Standardize gate numbering | system-spec-kit/SKILL.md | 1h |
| C5 | Replace hardcoded paths | .utcp_config.json | 30m |

**Implementation Order:**
1. C3 (simple find-replace)
2. C5 (simple path replacement)
3. C4 (requires careful regex)

**Validation:**
- [ ] Commands execute without "skill not found" errors
- [ ] grep "Gate [4-9]" returns no results
- [ ] Configuration works after path replacement

#### 1.3 Phase 1 Completion Checklist
- [ ] All 6 critical bugs fixed
- [ ] No new errors in MCP server logs
- [ ] Memory search returns correct results
- [ ] Checkpoint save/restore works
- [ ] Create Phase 1 checkpoint backup

---

### Phase 2: High Severity Bug Fixes (P1) - Week 2

**Objective:** Fix all 10 high severity bugs affecting functionality and developer experience.

#### 2.1 Documentation Fixes

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| H1 | Create/remove missing validation scripts | SKILL.md, scripts/ | 2h |
| H2 | Fix anchor links in workflows-code | SKILL.md | 1h |
| H8 | Standardize LEANN tool naming | AGENTS.md, SKILL.md | 1h |

**Implementation Details:**

**H1 - Missing Validation Scripts:**
Decision: Create stub implementations (see decision-record.md DR-002)
```javascript
// validate-spec-folder.js - Stub implementation
// Validates spec folder structure against level requirements
module.exports = { validateSpecFolder: (path) => ({ valid: true, issues: [] }) };
```

**H2 - Anchor Links:**
Current (wrong):
```markdown
- [Condition-based Waiting](implementation_workflows.md#1-🕐-condition-based-waiting)
```
Fixed:
```markdown
- [Condition-based Waiting](implementation_workflows.md#2-⏱️-condition-based-waiting)
```

#### 2.2 Database Fixes

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| H5 | Add idx_history_timestamp migration | vector-index.js | 1h |
| H6 | Standardize timestamp format | vector-index.js | 2h |
| H7 | Implement cascade delete | vector-index.js | 1h |

**Implementation Details:**

**H5 - Missing Index Migration:**
```javascript
// Add to createSchema() migration section
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_history_timestamp 
  ON memory_history(timestamp DESC)
`);
```

**H6 - Timestamp Standardization:**
Decision: Use TEXT ISO format consistently (see decision-record.md DR-003)
```javascript
// Before: last_accessed stored as inconsistent type
// After: Always store as ISO string
const now = new Date().toISOString();
```

**H7 - Cascade Delete:**
```javascript
async deleteMemory(id) {
  return this.db.transaction(() => {
    // Delete history first
    this.db.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);
    // Then delete memory
    this.db.prepare('DELETE FROM memory_index WHERE id = ?').run(id);
    // Then delete vector
    this.db.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
  })();
}
```

#### 2.3 Error Handling Fixes

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| H4 | Rollback on embedding failure | context-server.js | 2h |
| H9 | Preserve error codes in response | context-server.js | 1h |
| H10 | Add Botpoison failure logging | form_submission.js | 30m |

#### 2.4 Phase 2 Completion Checklist
- [ ] All 10 high severity bugs fixed
- [ ] Documentation links all resolve
- [ ] Database operations maintain integrity
- [ ] Error messages include context
- [ ] Create Phase 2 checkpoint backup

---

### Phase 3: Medium Severity Bug Fixes (P1/P2) - Weeks 3-4

**Objective:** Fix 16+ of 20 medium severity bugs (80% target).

#### 3.1 Skill System Fixes

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| M2 | Fix allowed-tools in skill frontmatter | 2 SKILL.md files | 30m |
| M3 | Fix unreachable INTENT_BOOSTERS | skill_advisor.py | 1h |
| M8 | Remove outdated Docker requirement | sk-git/SKILL.md | 30m |
| M20 | Add Code Mode tools to mcp-narsil | mcp-narsil/SKILL.md | 30m |

**Implementation Details:**

**M3 - INTENT_BOOSTERS Fix:**
```python
# Option A: Add non-hyphenated variants
"deadcode": ("mcp-narsil", 0.8),
"callgraph": ("mcp-narsil", 0.8),

# Option B: Modify tokenization to preserve hyphens
all_tokens = re.findall(r'\b[\w-]+\b', prompt_lower)
```
Decision: Option A (simpler, maintains tokenization consistency)

#### 3.2 Script & Validation Fixes

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| M1 | Fix step count mismatch | implement.md | 15m |
| M4 | Add cross-platform stat commands | search/index.md | 1h |
| M6 | Add temp file cleanup | generate-context.js | 30m |
| M7 | Fix priority tags validation | check-priority-tags.sh | 1h |

**Implementation Details:**

**M4 - Cross-Platform Commands:**
```bash
# Before (macOS only)
stat -f '%m' "$file"

# After (cross-platform)
if [[ "$OSTYPE" == "darwin"* ]]; then
  stat -f '%m' "$file"
else
  stat -c '%Y' "$file"
fi
```

#### 3.3 Memory System Improvements

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| M5 | Optimize LRU cache eviction | vector-index.js | 2h |
| M9 | Handle partial embedding update | context-server.js | 1h |
| M10 | Clear constitutional cache on tier change | vector-index.js | 30m |
| M11 | Handle checkpoint creation failure | context-server.js | 30m |
| M12 | Delete memory_history on memory delete | vector-index.js | (done in H7) |
| M13 | Add JSON schema validation | generate-context.js | 2h |

**Implementation Details:**

**M5 - LRU Cache Optimization:**
```javascript
// Before: O(n) eviction via iteration
// After: O(1) eviction via doubly-linked list
class LRUCache {
  constructor(maxSize, ttlMs) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
    this.cache = new Map();
    this.head = null;
    this.tail = null;
  }
  // ... linked list implementation
}
```

#### 3.4 Validation & Documentation Fixes

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| M16 | Enforce implementation-summary.md for L1 | check-files.sh | 1h |
| M17 | Add sub-folder versioning automation | create-spec-folder.sh | 2h |
| M18 | Add template hash validation | validate-spec.sh | 1h |
| M19 | Add migration versioning | vector-index.js | 2h |

#### 3.5 Phase 3 Completion Checklist
- [ ] 16+ medium severity bugs fixed (80%)
- [ ] skill_advisor.py routes correctly
- [ ] Validation scripts work cross-platform
- [ ] LRU cache performance improved
- [ ] Create Phase 3 checkpoint backup

---

### Phase 4: Low Severity & Cleanup (Ongoing)

**Objective:** Address low severity issues and technical debt as time permits.

#### 4.1 Documentation Cleanup
- Standardize allowed-tools formatting (array notation)
- Add missing command index README
- Document scripts/lib/ contents
- Document scripts/rules/ contents

#### 4.2 Code Quality
- Add `// intentionally empty` comments to empty catch blocks
- Improve error messages with context
- Add TypeScript type hints (JSDoc)

#### 4.3 Testing
- Add integration tests for critical paths
- Add regression tests for each bug fix
- Document manual testing procedures

---

## DEPENDENCY GRAPH

```
Phase 1 (Critical)
├── C6: Transaction pattern ──┐
├── C2: Orphan detection ─────┼──► Phase 2 prerequisites
├── C1: Duplicate prevention ─┘
├── C3: Skill references
├── C4: Gate numbering
└── C5: Path configuration

Phase 2 (High) - Depends on Phase 1
├── H7: Cascade delete ───────┐
├── H5: Missing index ────────┼──► Database integrity
├── H6: Timestamp format ─────┘
├── H1: Validation scripts
├── H2: Anchor links
├── H4: Embedding rollback
├── H8: Tool naming
├── H9: Error codes
└── H10: Botpoison logging

Phase 3 (Medium) - Depends on Phase 2
├── M5: LRU optimization (depends on H7)
├── M19: Migration versioning (depends on H5, H6)
└── ... (other items have no dependencies)
```

---

## RISK ASSESSMENT

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Database corruption during migration | High | Low | Checkpoint before each phase, test on copy first |
| Transaction wrapping causes deadlock | Medium | Low | Set appropriate timeouts, use WAL mode |
| Path changes break existing workflows | Medium | Medium | Support both old and new paths during transition |
| Missing test coverage for edge cases | Low | High | Prioritize testing for critical paths |

---

## ROLLBACK PLAN

### Per-Phase Rollback
1. Each phase creates a checkpoint before starting
2. If validation fails, restore from checkpoint
3. Document what was changed before rollback

### Full Rollback
1. Database: Restore from `scratch/backups/pre-refinement.sqlite`
2. Files: `git checkout` to pre-refinement commit
3. Configuration: Restore `.utcp_config.json.backup`

---

## MONITORING & VALIDATION

### Continuous Monitoring
- MCP server logs for errors
- Database integrity checks (daily)
- Memory search result quality

### Post-Implementation Validation
1. Run full test suite
2. Manual testing of affected workflows
3. Performance benchmarking
4. Documentation review

---

## APPENDIX: File Change Summary

| File | Changes | Phase |
|------|---------|-------|
| `.utcp_config.json` | Path variables | 1 |
| `checkpoints.js` | Deduplication | 1 |
| `vector-index.js` | Orphan detection, cascade delete, indexes, timestamps, LRU | 1, 2, 3 |
| `confidence-tracker.js` | Transaction wrapping | 1 |
| `context-server.js` | Error codes, embedding rollback | 2 |
| `system-spec-kit/SKILL.md` | Gate numbering | 1 |
| `workflows-code/SKILL.md` | Anchor links | 2 |
| `AGENTS.md` | Tool naming | 2 |
| `skill_advisor.py` | INTENT_BOOSTERS | 3 |
| `create_*.yaml` | Skill references | 1 |
| `search/index.md` | Cross-platform commands | 3 |
| `generate-context.js` | Temp file cleanup, JSON validation | 3 |
| `check-files.sh` | L1 enforcement | 3 |
