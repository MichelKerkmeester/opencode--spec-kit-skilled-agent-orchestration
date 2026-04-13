---
title: "Implementation Plan: Playbook Template Alignment"
description: "Plan for rewriting 16 playbook snippets and root playbook to sk-doc template format."
trigger_phrases:
  - "002-manual-testing-playbook"
  - "plan"
  - "playbook plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook"
    last_updated_at: "2026-04-13T21:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created plan"
    next_safe_action: "Implement playbook rewrites"
    key_files: ["plan.md"]
---
# Implementation Plan: Playbook Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (documentation) |
| **Template** | sk-doc playbook snippet template |
| **Prompt Pattern** | RCAF (Role, Context, Action, Format) |
| **Reference** | `01--routing-accuracy/001-git-routing.md` |

### Overview

Rewrite 16 minimal playbook stubs into full sk-doc template-aligned snippets with RCAF prompts, and rewrite the root playbook to match the system-spec-kit root format. Use `001-git-routing.md` as the gold standard pattern.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] sk-doc snippet template reviewed
- [x] Reference example (001-git-routing.md) analyzed
- [x] All 16 stub files identified on disk
- [x] Root playbook current state assessed
- [x] system-spec-kit root playbook pattern reviewed

### Definition of Done
- [ ] All 16 snippets follow 5-section template
- [ ] All contain RCAF prompts
- [ ] Root playbook rewritten
- [ ] Zero `scripts/` path references remain

---

## 3. APPROACH

### Phase 1: Graph Boosts Category (7 files)

For each file in `02--graph-boosts/`:

1. Read current stub content (command, expected, pass/fail)
2. Preserve the test logic (command, expected behavior)
3. Expand to 5-section template:
   - Section 1: OVERVIEW with "Why This Matters" explaining graph boost importance
   - Section 2: CURRENT REALITY with RCAF prompt targeting graph boost behavior
   - Section 3: TEST EXECUTION with full command list, evidence capture, failure triage
   - Section 4: SOURCE FILES linking to `skill_advisor.py` graph functions and `skill-graph.json`
   - Section 5: SOURCE METADATA with GB-NNN IDs

**Files:**
| ID | File | Scenario |
|----|------|----------|
| GB-001 | `001-dependency-pullup.md` | depends_on edge pulls up prerequisites |
| GB-002 | `002-enhances-overlay.md` | enhances edge overlays related skills |
| GB-003 | `003-ghost-prevention.md` | Ghost candidate guard blocks zero-evidence |
| GB-004 | `004-family-affinity.md` | Family boost with ghost guard active |
| GB-005 | `005-evidence-separation.md` | Graph-heavy results get confidence penalty |
| GB-006 | `006-hub-skill-edges.md` | Hub skills surface via edge connections |
| GB-007 | `007-prerequisite-for.md` | prerequisite_for compiled into runtime |

### Phase 2: Compiler Category (5 files)

Same expansion for `03--compiler/`:

| ID | File | Scenario |
|----|------|----------|
| CP-001 | `001-schema-validation.md` | All 20 metadata files pass validation |
| CP-002 | `002-zero-edge-warnings.md` | Compiler warns on orphan skills |
| CP-003 | `003-compiled-signals.md` | intent_signals present in compiled output |
| CP-004 | `004-size-target.md` | Compiled output under 4KB |
| CP-005 | `005-health-check.md` | Health check reports graph status |

### Phase 3: Regression Safety Category (4 files)

Same expansion for `04--regression-safety/`:

| ID | File | Scenario |
|----|------|----------|
| RS-001 | `001-full-regression.md` | 44/44 cases pass, all gates green |
| RS-002 | `002-p0-cases.md` | 12/12 P0 cases pass |
| RS-003 | `003-graph-cases.md` | P1-GRAPH cases pass |
| RS-004 | `004-abstain-noise.md` | Noise queries produce no result |

### Phase 4: Root Playbook Rewrite

Rewrite `manual_testing_playbook.md`:
- Fix all `scripts/` → `skill-advisor/` paths
- Add execution policy block at top
- Ensure TOC links match file paths
- Match system-spec-kit root playbook section format

---

## 4. RISKS

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| RCAF prompts don't match actual skill_advisor.py behavior | Low | Prompts derived from existing test commands that are verified working |
| Inconsistency between snippet and root playbook | Low | Root playbook rewritten last, referencing final snippet state |
| Stale `scripts/` paths missed | Low | Grep sweep after all writes |
