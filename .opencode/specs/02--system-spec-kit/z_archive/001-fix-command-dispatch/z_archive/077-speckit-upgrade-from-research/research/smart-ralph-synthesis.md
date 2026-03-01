# Smart-Ralph Pattern Synthesis

---

**Source Repository:** https://github.com/tzachbon/smart-ralph
**Original Analysis:** Archived during consolidation (source folder not present in this repository snapshot)
**Analysis Date:** 2026-01-15
**Synthesis Date:** 2026-01-22
**Confidence Score:** 92%

---

## Executive Summary

Smart-Ralph is a Claude Code plugin that transforms vague feature requests into structured specifications with automated execution. Its core philosophy—"Ralph doesn't overthink. Ralph just does the next task"—yields practical patterns for failure recovery, state management, and iterative development. This synthesis extracts the patterns most applicable to system-spec-kit upgrade, filtering out architectural elements that conflict with our existing skills-based approach.

---

## Key Patterns Identified

| Pattern | Smart-Ralph Implementation | Applicability | Priority |
|---------|---------------------------|---------------|----------|
| **State File Tracking** | `.ralph-state.json` with phase/task/retry fields | High - Missing from system-spec-kit | P0 |
| **5-Attempt Bounded Retry** | Hard block after 5 failed attempts | High - Currently 3 attempts (soft) | P0 |
| **POC-First Workflow** | Make It Work → Refactor → Test → Quality | High - Tests currently P0 | P1 |
| **4-Phase Task Cycle** | Quality checkpoints every 2-3 tasks | Medium - Aligns with existing checklist | P1 |
| **Progress Dashboard** | `/status` command with phase/completion % | Medium - Manual inspection currently | P2 |
| **Quick Mode** | `--quick` bypasses verbose phases | Low - Similar to `:auto` mode | P2 |

---

## Detailed Pattern Analysis

### 1. State File Tracking (`.ralph-state.json`)

**Schema:**
```json
{
  "source": "spec|plan|direct",
  "name": "kebab-case-name",
  "phase": "research|requirements|design|tasks|execution",
  "taskIndex": 0,
  "totalTasks": 10,
  "taskIteration": 1,
  "maxTaskIterations": 5,
  "globalIteration": 1,
  "maxGlobalIterations": 100,
  "awaitingApproval": true,
  "relatedSpecs": [...]
}
```

**Key Benefits:**
- **Reliable Resume Detection**: Explicit state vs inferring from memory files
- **Persistent Phase Tracking**: Survives context compaction
- **Recovery History**: `taskIteration` tracks failed attempts per task
- **Global Safety Limit**: `maxGlobalIterations` prevents runaway execution

**Lifecycle:**
1. Created at spec initialization
2. Updated on every task completion/failure
3. Deleted on successful completion (Smart-Ralph approach)
4. **Our adaptation**: Archive to `memory/` instead of delete

### 2. 5-Attempt Bounded Retry

**Smart-Ralph Decision Logic:**
```
if (task_iteration >= 5) → BLOCK + suggest manual fix
if (no "TASK_COMPLETE" signal) → BLOCK + increment retry
if (task complete) → ALLOW + advance to next task
```

**Enforcement Message:**
```markdown
⛔ MAXIMUM RECOVERY ATTEMPTS REACHED (5/5)

Previous attempts documented in debug-delegation.md
Manual intervention required.

Options:
A) Fix manually and run /spec_kit:resume
B) Try /spec_kit:debug with different model
C) Break problem into smaller tasks
D) Escalate to team
```

**Why 5?** Empirically optimal—enough for transient failures, not enough for infinite loops. The 3-attempt soft suggestion in current system-spec-kit often ignored.

### 3. POC-First Workflow

**4-Phase Structure:**

| Phase | Focus | Tests? | Quality? |
|-------|-------|--------|----------|
| **Phase 1: Make It Work** | Core functionality | Skip | Accept shortcuts |
| **Phase 2: Refactoring** | Clean code, patterns | Skip | Structure properly |
| **Phase 3: Testing** | Coverage | Add | Unit/integration/E2E |
| **Phase 4: Quality Gates** | Final validation | Pass | Lint, types, CI |

**Philosophy:**
> "Validate ideas fast before investing in quality."

**Contrast with Current System:**
- Current: Tests are P0 (required before completion)
- Proposed: Tests are Phase 3 (after POC validated)

**Why It Works:** Prevents premature optimization and test debt on features that may change significantly during POC validation.

### 4. 4-Phase Task Cycle

**Task Format:**
```markdown
- [ ] 1.2 [Task label]
  - **Do**: [specific steps]
  - **Files**: [exact paths]
  - **Done when**: [success criteria]
  - **Verify**: [verification command]
  - **Commit**: `type(scope): description`
  - _Requirements: FR-#, AC-#_
  - _Design: Section reference_
```

**Quality Checkpoints:** Inserted every 2-3 tasks to prevent debt accumulation.

**Commit Message Pre-Planning:** Each task includes its commit message, ensuring conventional commit compliance without post-hoc crafting.

### 5. Progress Dashboard (`/status`)

**Output Format:**
```
📊 Specification Status

Active: 007-auth-feature

Specs:
┌────────────────────┬───────────┬──────────┬─────────────────────┐
│ Name               │ Phase     │ Progress │ Files               │
├────────────────────┼───────────┼──────────┼─────────────────────┤
│ 007-auth-feature * │ Implement │ 3/8 (38%)│ [✓] [✓] [✓] [✓]    │
│ 006-user-profile   │ Planning  │ -        │ [✓] [✓] [ ] [ ]    │
└────────────────────┴───────────┴──────────┴─────────────────────┘
```

**Multi-Spec Support:** Enables switching between active specs without losing context.

### 6. Quick Mode (`--quick`)

**Purpose:** Bypass verbose phases for simple, well-understood tasks.

**Equivalent:** Similar to `:auto` mode but skips planning phases entirely for trivial changes.

---

## Applicability Assessment

### High Applicability (Adopt)

| Pattern | Reason | Integration Point |
|---------|--------|-------------------|
| State File | Missing capability, low effort, high value | New `.spec-state.json` |
| 5-Attempt Block | Current soft limit ineffective | `debug.md` enforcement |
| POC-First | Reduces premature test debt | `tasks.md` template |
| Task Checkpoints | Aligns with existing checklist | `checklist.md` phases |

### Medium Applicability (Adapt)

| Pattern | Adaptation Needed | Integration Point |
|---------|-------------------|-------------------|
| Progress Dashboard | Simpler than Smart-Ralph version | New `status.md` command |
| Quick Mode | Merge with existing `:auto` mode | Mode parameter |

### Low Applicability (Skip)

| Pattern | Reason to Skip |
|---------|----------------|
| 5-Agent Architecture | Skills system provides equivalent specialization |
| Delete State on Completion | Memory preservation more valuable than cleanup |
| Character-Based Branding | Professional tone required for enterprise |
| Stop Handler Hook | OpenCode architecture differs from Claude Code |

---

## Implementation Recommendations

### Priority 0: State File + Bounded Retry

**Files to Create/Modify:**
1. New: `scripts/state-manager.js` - CRUD for `.spec-state.json`
2. Modify: `resume.md` - Check state file before memory
3. Modify: `debug.md` - Enforce 5-attempt hard block
4. New: `templates/spec-state.json` - Schema template

**Estimated Effort:** 2-3 days

### Priority 1: POC-First + Task Phases

**Files to Create/Modify:**
1. Modify: `templates/tasks.md` - Add 4-phase structure
2. Modify: `templates/checklist.md` - Phase-aware items
3. Modify: `phase_checklists.md` - Map to 4-phase cycle

**Estimated Effort:** 1-2 days

### Priority 2: Progress Dashboard

**Files to Create:**
1. New: `status.md` - Command definition
2. New: `scripts/generate-status.js` - Dashboard generator

**Estimated Effort:** 1 day

---

## References

| Document | Purpose |
|----------|---------|
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/smart-ralph-synthesis.md` | Full Smart-Ralph synthesis |
| https://github.com/tzachbon/smart-ralph | Source repository |
| `003-memory-and-spec-kit/` | Parent spec folder |
| `.opencode/skill/system-spec-kit/` | Current implementation |

---

## Synthesis Notes

1. **State file is the highest-value adoption** - Provides reliable resume without memory inference
2. **5-attempt hard block prevents infinite debugging loops** - Current 3-attempt soft suggestion often ignored
3. **POC-first reduces wasted effort** - Tests written for validated functionality only
4. **Progress dashboard aids multi-spec workflows** - Visibility without manual folder inspection
5. **Archive state vs delete** - Memory preservation aligns with system-spec-kit philosophy
