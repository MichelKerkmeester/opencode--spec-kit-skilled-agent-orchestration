---
title: "Implementation Plan: workflows-code Barter Alignment [003-barter-alignment/plan]"
description: "Align anobel.com's workflows-code skill with organizational patterns from the Barter system using selective adoption of priority-based loading, sub-folder organization, and veri..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "workflows"
  - "code"
  - "barter"
  - "022"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Implementation Plan: workflows-code Barter Alignment

<!-- ANCHOR:summary -->
## Overview

Align anobel.com's workflows-code skill with organizational patterns from the Barter system using selective adoption of priority-based loading, sub-folder organization, and verification templates.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:phases -->
## Phases

### Phase 1: Research - Barter Analysis ✅ COMPLETE
**Duration**: Analysis session
**Objective**: Document Barter's workflows-code skill structure and patterns

**Findings**:
- Stack-agnostic design with 6+ technology stack detection
- Priority-based loading (P1/P2/P3) with token budgets
- Sub-folder organization by repository/domain
- Python-based router with keyword triggers
- Verification statement templates with evidence fields

**Output**: See decision-record.md "Barter Patterns to Adopt"

---

### Phase 2: Research - Current Skill Analysis ✅ COMPLETE
**Duration**: Analysis session
**Objective**: Document current anobel.com skill structure

**Findings**:
- 6 assets in flat folder (checklists + JS patterns)
- 14 references in flat folder (workflows + patterns + deployment)
- Good 3-phase workflow (Implementation → Debugging → Verification)
- Python router missing routes for observer_patterns, third_party_integrations, performance_patterns
- "The Iron Law" unique to anobel.com - mandatory browser verification

**Output**: See decision-record.md "anobel.com Patterns to Preserve"

---

### Phase 3: Compare and Design ✅ COMPLETE
**Duration**: Design session
**Objective**: Identify improvements and design new structure

**Design Decisions**:

1. **Adopt from Barter**: P1/P2/P3 loading, token budgets, verification template
2. **Preserve from anobel.com**: 3-phase workflow, Iron Law, browser testing matrix
3. **Sub-folder structure**: Phase-based (not repository-based like Barter)

**Output**: See tasks.md for complete file move list

---

### Phase 4: Implement SKILL.md Updates ✅ COMPLETE
**Duration**: Implementation session
**Objective**: Update router logic and add new sections

**Tasks**:

1. **Add Priority Loading Section (new Section 2.5)**
```markdown
### Priority Loading System

| Priority | Token Budget | Resources | Load Trigger |
|----------|-------------|-----------|--------------|
| **P1** Core | ~1,500 | SKILL.md sections 1-3 | Always on skill invocation |
| **P2** Phase | ~4,000 | Phase-specific workflows + checklists | Phase detection |
| **P3** Deep | ~10,000 | Domain-specific patterns | Keyword triggers |

**P2 Resources by Phase:**
- Phase 1: implementation_workflows.md, wait_patterns.js, validation_patterns.js
- Phase 2: debugging_workflows.md, debugging_checklist.md
- Phase 3: verification_workflows.md, verification_checklist.md

**P3 Resources by Keyword:**
- animation/motion/scroll → animation_workflows.md
- webflow/collection/CMS → webflow_patterns.md
- security/XSS/CSRF → security_patterns.md
- optimize/performance → performance_patterns.md
- minify/terser → minification_guide.md
- CDN/deploy/R2 → cdn_deployment.md
- HLS/Lenis/library → third_party_integrations.md
- observer/intersection → observer_patterns.md
```

2. **Add Missing Routes to Python Router**
```python
# Add to implementation section:
if task.has_observers:
    return load("references/phase1-implementation/observer_patterns.md")
if task.has_third_party:
    return load("references/phase1-implementation/third_party_integrations.md")
if task.needs_performance:
    return load("references/phase1-implementation/performance_patterns.md")
```

3. **Add Verification Statement Template (Section 5.4)**
```markdown
### Verification Statement Template

When claiming completion, use this format:

**Claim:** [WHAT IS BEING CLAIMED]

**Evidence:**
- [ ] Browser tested at 1920px: [URL or screenshot]
- [ ] Browser tested at 375px: [URL or screenshot]
- [ ] Console errors: [None / List of errors]
- [ ] Interactions tested: [List of interactions verified]
- [ ] Animation timing verified: [Yes/No/N/A]

**Limitations:** [Any known issues or edge cases]
**Tested by:** [Human / AI / Automated]
**Date:** [YYYY-MM-DD]
```

**Output**: Updated SKILL.md with new sections

---

### Phase 5: Reorganize Files ✅ COMPLETE
**Duration**: Implementation session
**Objective**: Move files to new sub-folder structure

**Final Structure:**

```
assets/
├── checklists/
│   ├── debugging_checklist.md
│   └── verification_checklist.md
├── patterns/
│   ├── wait_patterns.js
│   └── validation_patterns.js
└── integrations/
    ├── hls_patterns.js
    └── lenis_patterns.js

references/
├── phase1-implementation/
│   ├── implementation_workflows.md
│   ├── animation_workflows.md
│   ├── webflow_patterns.md
│   ├── observer_patterns.md
│   ├── third_party_integrations.md
│   ├── security_patterns.md
│   └── performance_patterns.md
├── phase2-debugging/
│   └── debugging_workflows.md
├── phase3-verification/
│   └── verification_workflows.md
├── deployment/
│   ├── minification_guide.md
│   └── cdn_deployment.md
└── standards/
    ├── code_quality_standards.md
    ├── quick_reference.md
    └── shared_patterns.md
```

**Output**: Reorganized folder structure (20 files moved)

---

### Phase 6: Verification ✅ COMPLETE
**Duration**: Testing session
**Objective**: Ensure everything works correctly

**Tasks**:
- Run verification commands from checklist.md
- Verify all file references are valid
- Test skill invocation via OpenCode
- Check resource loading paths
- Create implementation-summary.md

**Output**: Verified, working skill with documentation

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:rollback -->
## Timeline

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 | ✅ Complete | Barter analysis documented in decision-record.md |
| Phase 2 | ✅ Complete | anobel.com analysis documented in decision-record.md |
| Phase 3 | ✅ Complete | Design finalized, file moves listed in tasks.md |
| Phase 4 | ✅ Complete | SKILL.md updated with priority loading, keywords, verification template |
| Phase 5 | ✅ Complete | 20 files moved to sub-folders |
| Phase 6 | ✅ Complete | All verification commands passed |

---

## Rollback Plan

If reorganization causes issues:
1. Restore SKILL.md from SKILL.md.bak
2. Move files back to original locations using inverse of tasks.md operations
3. Document what went wrong in decision-record.md

<!-- /ANCHOR:rollback -->

---

## Implementation Order (IMPORTANT)

The implementation agent MUST follow this order:
1. Create backup: `cp SKILL.md SKILL.md.bak`
2. Create ALL sub-folders first
3. Move ALL files to new locations
4. THEN update SKILL.md paths (avoids broken references during transition)
5. Add new sections (Priority Loading, Verification Template)
6. Add missing routes to Python router
7. Run verification commands
