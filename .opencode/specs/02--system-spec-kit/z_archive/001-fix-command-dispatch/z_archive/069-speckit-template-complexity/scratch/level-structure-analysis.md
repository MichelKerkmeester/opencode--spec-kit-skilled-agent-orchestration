# SpecKit Template Level Structure Analysis

Analysis of current templates and design for new level-based folder structure.

---

## 1. Current Template Analysis

### 1.1 Template Inventory

The current template system consists of:

| Template | Path | LOC | COMPLEXITY_GATE Markers |
|----------|------|-----|------------------------|
| spec.md | `/templates/spec.md` | 483 | 3 |
| plan.md | `/templates/plan.md` | 502 | 5 |
| tasks.md | `/templates/tasks.md` | 413 | 1 |
| checklist.md | `/templates/checklist.md` | 279 | 4 |
| decision-record.md | `/templates/decision-record.md` | 299 | 0 |
| implementation-summary.md | `/templates/implementation-summary.md` | 103 | 0 |
| research.md | `/templates/research.md` | 892 | 0 |

**Complexity Block Files** (in `/templates/complexity/`):
| File | Purpose | Min Level |
|------|---------|-----------|
| ai-protocol.md | AI execution rules for agents | Level 3 |
| effort-estimation.md | Effort estimation tables | Level 2 |
| extended-checklist.md | Extended verification items | Level 3+ |
| dependency-graph.md | Phase dependency visualization | Level 2+ |

### 1.2 COMPLEXITY_GATE Markers Identified

#### spec.md (3 gates)
```
1. <!-- COMPLEXITY_GATE: level>=2 -->
   Section: Complexity Assessment (lines 24-37)
   Content: Complexity scoring table with auto-populated values

2. <!-- COMPLEXITY_GATE: level>=3, feature=executive-summary -->
   Section: Executive Summary (lines 39-50)
   Content: High-level overview + key decisions + critical dependencies

(Gate 2 is nested inside Gate 1 closing)
```

#### plan.md (5 gates)
```
1. <!-- COMPLEXITY_GATE: level>=2, feature=dependency-graph -->
   Section: 4.1 PHASE DEPENDENCIES (lines 203-256)
   Content: Phase dependency tracking

2. <!-- COMPLEXITY_GATE: level>=2, level<=2 -->
   Nested: Table format for Level 2 only (lines 209-217)
   Content: Simple dependency table

3. <!-- COMPLEXITY_GATE: level>=3 -->
   Nested: ASCII diagram for Level 3+ (lines 220-255)
   Content: ASCII flowchart + Critical Path + Milestones

4. <!-- COMPLEXITY_GATE: level>=2, feature=effort-estimation -->
   Section: 4.2 EFFORT ESTIMATION (lines 258-273)
   Content: Phase effort breakdown table

5. <!-- COMPLEXITY_GATE: level>=3, feature=ai-protocol -->
   Section: 4.3 AI EXECUTION FRAMEWORK (lines 275-310)
   Content: Pre-task checklist, execution rules, status format
```

#### tasks.md (1 gate)
```
1. <!-- COMPLEXITY_GATE: level>=3, feature=ai-protocol -->
   Section: 3-Tier Task Format (lines 104-155)
   Content: Tier 1/2/3 task formats for Level 3+
```

#### checklist.md (4 gates)
```
1. <!-- COMPLEXITY_GATE: level>=2, specType=research -->
   Section: Research Completeness (lines 106-115)
   Content: Research-specific checklist items

2. <!-- COMPLEXITY_GATE: level>=2, specType=bugfix -->
   Section: Bug Fix Verification (lines 117-126)
   Content: Bug fix-specific checklist items

3. <!-- COMPLEXITY_GATE: level>=2, specType=refactoring -->
   Section: Refactoring Safety (lines 128-136)
   Content: Refactoring-specific checklist items

4. <!-- COMPLEXITY_GATE: level>=3+ -->
   Section: Extended Verification (lines 138-155)
   Content: Level 3+ verification + Sign-Off Section
```

---

## 2. Level Requirements Matrix

### 2.1 File Requirements by Level

| File | Level 1 | Level 2 | Level 3 | Level 3+ |
|------|---------|---------|---------|----------|
| spec.md | REQUIRED | REQUIRED | REQUIRED | REQUIRED |
| plan.md | REQUIRED | REQUIRED | REQUIRED | REQUIRED |
| tasks.md | REQUIRED | REQUIRED | REQUIRED | REQUIRED |
| implementation-summary.md | REQUIRED* | REQUIRED* | REQUIRED* | REQUIRED* |
| checklist.md | - | REQUIRED | REQUIRED | REQUIRED |
| decision-record.md | - | - | REQUIRED | REQUIRED |
| research.md | OPTIONAL | OPTIONAL | OPTIONAL | OPTIONAL |

*Note: implementation-summary.md is created AFTER implementation completes, not at spec folder creation.

### 2.2 Level Definitions (from complexity-config.jsonc)

| Level | Score Range | Name | Description |
|-------|-------------|------|-------------|
| Level 1 | 0-25 | Baseline | Simple changes, <100 LOC |
| Level 2 | 26-55 | Verification | Moderate complexity, 100-499 LOC |
| Level 3 | 56-79 | Full | Complex changes, >=500 LOC |
| Level 3+ | 80-100 | Extended | Enterprise-scale, multi-agent |

### 2.3 Section Scaling Guidelines (from complexity-config.jsonc)

| Aspect | Level 1 | Level 2 | Level 3 | Level 3+ |
|--------|---------|---------|---------|----------|
| User Stories | 1-2 | 2-4 | 4-8 | 8-15 |
| Phases | 2-3 | 3-5 | 5-8 | 8-12 |
| Tasks | 5-15 | 15-50 | 50-100 | 100-200 |
| Checklist Items | 10-20 | 30-50 | 60-100 | 100-150 |

---

## 3. Section Differences by Level

### 3.1 spec.md

| Section | Level 1 | Level 2 | Level 3 | Level 3+ |
|---------|---------|---------|---------|----------|
| OBJECTIVE (basic) | YES | YES | YES | YES |
| Metadata | YES | YES | YES | YES |
| Stakeholders | YES | YES | YES | YES |
| **Complexity Assessment** | NO | YES | YES | YES |
| **Executive Summary** | NO | NO | YES | YES |
| Problem Statement | YES | YES | YES | YES |
| Purpose | YES | YES | YES | YES |
| Assumptions | YES | YES | YES | YES |
| SCOPE | YES | YES | YES | YES |
| USERS & STORIES | YES | YES | YES | YES |
| FUNCTIONAL REQUIREMENTS | YES | YES | YES | YES |
| NON-FUNCTIONAL REQUIREMENTS | YES | YES | YES | YES |
| EDGE CASES | YES | YES | YES | YES |
| SUCCESS CRITERIA | YES | YES | YES | YES |
| DEPENDENCIES & RISKS | YES | YES | YES | YES |
| OUT OF SCOPE | YES | YES | YES | YES |
| OPEN QUESTIONS | YES | YES | YES | YES |
| APPENDIX | YES | YES | YES | YES |
| WORKING FILES | YES | YES | YES | YES |
| CHANGELOG | YES | YES | YES | YES |

### 3.2 plan.md

| Section | Level 1 | Level 2 | Level 3 | Level 3+ |
|---------|---------|---------|---------|----------|
| OBJECTIVE | YES | YES | YES | YES |
| QUALITY GATES | YES | YES | YES | YES |
| PROJECT STRUCTURE | YES | YES | YES | YES |
| IMPLEMENTATION PHASES (basic) | YES | YES | YES | YES |
| **4.1 PHASE DEPENDENCIES** | NO | YES (table) | YES (ASCII) | YES (DAG) |
| **4.2 EFFORT ESTIMATION** | NO | YES | YES | YES |
| **4.3 AI EXECUTION FRAMEWORK** | NO | NO | YES | YES |
| TESTING STRATEGY | YES | YES | YES | YES |
| SUCCESS METRICS | YES | YES | YES | YES |
| RISKS & MITIGATIONS | YES | YES | YES | YES |
| DEPENDENCIES | YES | YES | YES | YES |
| COMMUNICATION & REVIEW | YES | YES | YES | YES |
| REFERENCES | YES | YES | YES | YES |

### 3.3 tasks.md

| Section | Level 1 | Level 2 | Level 3 | Level 3+ |
|---------|---------|---------|---------|----------|
| Task Notation | YES | YES | YES | YES |
| OBJECTIVE | YES | YES | YES | YES |
| CONVENTIONS (basic) | YES | YES | YES | YES |
| **3-Tier Task Format** | NO | NO | YES | YES |
| WORKING FILES LOCATION | YES | YES | YES | YES |
| Task Completion Criteria | YES | YES | YES | YES |
| Task-Requirement Linking | YES | YES | YES | YES |
| TASK GROUPS BY PHASE | YES | YES | YES | YES |
| VALIDATION CHECKLIST | YES | YES | YES | YES |
| OPTIONAL TESTS GUIDANCE | YES | YES | YES | YES |

### 3.4 checklist.md

| Section | Level 1 | Level 2 | Level 3 | Level 3+ |
|---------|---------|---------|---------|----------|
| OBJECTIVE | - | YES | YES | YES |
| LINKS | - | YES | YES | YES |
| Pre-Implementation Readiness | - | YES | YES | YES |
| Code Quality | - | YES | YES | YES |
| Testing & Validation | - | YES | YES | YES |
| Security Review | - | YES | YES | YES |
| Performance Review | - | YES | YES | YES |
| Documentation | - | YES | YES | YES |
| Deployment Readiness | - | YES | YES | YES |
| File Organization | - | YES | YES | YES |
| **Research Completeness*** | - | CONDITIONAL | CONDITIONAL | CONDITIONAL |
| **Bug Fix Verification*** | - | CONDITIONAL | CONDITIONAL | CONDITIONAL |
| **Refactoring Safety*** | - | CONDITIONAL | CONDITIONAL | CONDITIONAL |
| **Extended Verification** | - | NO | NO | YES |
| **Sign-Off Section** | - | NO | NO | YES |
| VERIFICATION PROTOCOL | - | YES | YES | YES |
| USAGE NOTES | - | YES | YES | YES |

*These are specType-conditional, not level-conditional

### 3.5 decision-record.md

| Section | Level 1 | Level 2 | Level 3 | Level 3+ |
|---------|---------|---------|---------|----------|
| All sections | - | - | YES | YES |

Note: decision-record.md has NO COMPLEXITY_GATE markers - it's only used at Level 3+.

---

## 4. Recommended Approach

### 4.1 Design Philosophy

**Recommendation: Pre-expanded standalone templates**

**Rationale:**
1. **Simplicity** - No runtime parsing of COMPLEXITY_GATE markers needed
2. **Clarity** - Users see exactly what they get at each level
3. **Maintainability** - Each template is self-contained and testable
4. **Performance** - No conditional processing during template expansion

### 4.2 Template Generation Strategy

**Option A: Clean Standalone (RECOMMENDED)**
- Create fully independent templates for each level
- Copy shared content where needed
- Accept some duplication for clarity
- Easier to customize per level

**Option B: Derived Templates**
- Keep a "master" template with all content
- Generate level-specific templates via build script
- Better DRY compliance
- Harder to customize per level

**Recommendation: Option A (Clean Standalone)** for the following reasons:
- Each level has genuinely different content needs
- Level 1 should be minimal, not stripped-down Level 3
- Allows natural evolution of templates per level
- Simpler mental model for users

### 4.3 Inheritance Model

```
Level 1 (Baseline)
    |
    +-- Level 2 adds: Complexity Assessment, Phase Dependencies,
    |               Effort Estimation, checklist.md
    |
    +-- Level 3 adds: Executive Summary, AI Protocol, 3-Tier Tasks,
    |               decision-record.md, ASCII diagrams
    |
    +-- Level 3+ adds: Extended Checklist, DAG diagrams, Sign-Off,
                      Multi-agent coordination
```

### 4.4 Template Optimization by Level

**Level 1 Optimizations:**
- Remove all "[YOUR_VALUE_HERE: ...]" for optional sections
- Simplify tables to minimum columns
- Remove advanced examples
- Focus on "just enough" documentation
- Target: <200 lines per template

**Level 2 Optimizations:**
- Include verification-focused content
- Add effort estimation
- Include dependency tracking (table format)
- Target: 200-350 lines per template

**Level 3 Optimizations:**
- Full documentation
- ASCII diagrams
- AI execution protocol
- Target: 350-500 lines per template

**Level 3+ Optimizations:**
- Enterprise features
- DAG visualizations
- Multi-agent coordination
- Extended checklists
- Sign-off sections
- Target: 400-600 lines per template

---

## 5. File List for Each Level Folder

### 5.1 Level 1 Folder (`/templates/level_1/`)

```
level_1/
  spec.md                    # Minimal spec (no Complexity Assessment, no Executive Summary)
  plan.md                    # Minimal plan (no 4.1, 4.2, 4.3 sections)
  tasks.md                   # Minimal tasks (no 3-Tier format)
  implementation-summary.md  # Same as current (no level-specific content)
```

**Total files: 4**

### 5.2 Level 2 Folder (`/templates/level_2/`)

```
level_2/
  spec.md                    # Adds: Complexity Assessment
  plan.md                    # Adds: Phase Dependencies (table), Effort Estimation
  tasks.md                   # Same as Level 1
  checklist.md               # Standard checklist (no Extended Verification)
  implementation-summary.md  # Same as current
```

**Total files: 5**

### 5.3 Level 3 Folder (`/templates/level_3/`)

```
level_3/
  spec.md                    # Adds: Executive Summary
  plan.md                    # Adds: Phase Dependencies (ASCII), AI Execution Framework
  tasks.md                   # Adds: 3-Tier Task Format
  checklist.md               # Standard checklist (no Extended Verification)
  decision-record.md         # Full ADR template
  implementation-summary.md  # Same as current
```

**Total files: 6**

### 5.4 Level 3+ Folder (`/templates/level_3+/`)

```
level_3+/
  spec.md                    # Same as Level 3
  plan.md                    # Adds: Phase Dependencies (DAG)
  tasks.md                   # Same as Level 3
  checklist.md               # Adds: Extended Verification, Sign-Off Section
  decision-record.md         # Same as Level 3
  implementation-summary.md  # Same as current
```

**Total files: 6**

### 5.5 Shared Templates (remain in `/templates/`)

```
templates/
  research.md                # Optional at all levels
  context_template.md        # Memory context (not level-specific)
  debug-delegation.md        # Debug workflow (not level-specific)
  handover.md               # Handover workflow (not level-specific)
```

### 5.6 Deprecated After Migration

```
templates/complexity/        # DELETE - content merged into level folders
  ai-protocol.md            # -> Merged into level_3/plan.md and level_3+/plan.md
  effort-estimation.md      # -> Merged into level_2/plan.md, level_3/plan.md, level_3+/plan.md
  extended-checklist.md     # -> Merged into level_3+/checklist.md
  dependency-graph.md       # -> Split by format into respective level plan.md files
```

---

## 6. Implementation Checklist

### Phase 1: Create Folder Structure
- [ ] Create `/templates/level_1/`
- [ ] Create `/templates/level_2/`
- [ ] Create `/templates/level_3/`
- [ ] Create `/templates/level_3+/`

### Phase 2: Generate Level 1 Templates
- [ ] Create `level_1/spec.md` (strip Complexity Assessment, Executive Summary)
- [ ] Create `level_1/plan.md` (strip sections 4.1, 4.2, 4.3)
- [ ] Create `level_1/tasks.md` (strip 3-Tier format)
- [ ] Copy `implementation-summary.md` to `level_1/`

### Phase 3: Generate Level 2 Templates
- [ ] Create `level_2/spec.md` (add Complexity Assessment)
- [ ] Create `level_2/plan.md` (add table dependencies, effort estimation)
- [ ] Create `level_2/tasks.md` (same as level 1)
- [ ] Create `level_2/checklist.md` (standard checklist)
- [ ] Copy `implementation-summary.md` to `level_2/`

### Phase 4: Generate Level 3 Templates
- [ ] Create `level_3/spec.md` (add Executive Summary)
- [ ] Create `level_3/plan.md` (add ASCII dependencies, AI framework)
- [ ] Create `level_3/tasks.md` (add 3-Tier format)
- [ ] Create `level_3/checklist.md` (same as level 2)
- [ ] Copy `decision-record.md` to `level_3/`
- [ ] Copy `implementation-summary.md` to `level_3/`

### Phase 5: Generate Level 3+ Templates
- [ ] Create `level_3+/spec.md` (same as level 3)
- [ ] Create `level_3+/plan.md` (add DAG dependencies)
- [ ] Create `level_3+/tasks.md` (same as level 3)
- [ ] Create `level_3+/checklist.md` (add Extended Verification, Sign-Off)
- [ ] Copy `decision-record.md` to `level_3+/`
- [ ] Copy `implementation-summary.md` to `level_3+/`

### Phase 6: Update Scripts
- [ ] Update template selection logic to use level folders
- [ ] Remove COMPLEXITY_GATE parsing logic
- [ ] Update validation scripts
- [ ] Update generate-context.js if needed

### Phase 7: Cleanup
- [ ] Archive original templates (for reference)
- [ ] Delete `/templates/complexity/` folder
- [ ] Update SKILL.md documentation
- [ ] Update CLAUDE.md references

---

## 7. Migration Risk Assessment

### Low Risk
- Creating new folder structure
- Copying templates to level folders
- Removing unused complexity blocks

### Medium Risk
- Ensuring all COMPLEXITY_GATE content is properly merged
- Updating scripts that reference template paths
- Maintaining backward compatibility during transition

### High Risk
- Breaking existing spec folder creation workflows
- Missing content during manual merge
- Regression in template quality

### Mitigation Strategies
1. **Parallel operation**: Keep old templates during transition
2. **Automated validation**: Script to verify new templates have all required content
3. **Testing**: Create test spec folders at each level before deploying
4. **Rollback plan**: Revert to old templates if issues discovered

---

## 8. Summary

### Current State
- 7 main templates with 13 COMPLEXITY_GATE markers
- 4 separate complexity block files
- Runtime conditional expansion
- Complex parsing logic required

### Target State
- 4 level-specific folders
- Pre-expanded templates (no gates)
- 4-6 files per level
- Simpler selection logic

### Benefits
1. **Clarity**: Users know exactly what they get per level
2. **Simplicity**: No runtime parsing needed
3. **Maintainability**: Each level can evolve independently
4. **Performance**: Direct file selection vs. conditional processing
5. **Testing**: Each level template is independently testable

---

*Analysis completed: 2026-01-16*
*Based on: system-spec-kit templates v1.0*
