---
title: "Plan: Make Debug Command Stack-Agnostic [006-debug-stack-agnostic/plan]"
description: "Make /spec_kit:debug inherently universal - it just works for any debugging task (frontend, backend, infrastructure) without asking or detecting what stack is being debugged."
trigger_phrases:
  - "plan"
  - "make"
  - "debug"
  - "command"
  - "stack"
  - "006"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Plan: Make Debug Command Stack-Agnostic

<!-- ANCHOR:summary -->
## Overview

Make `/spec_kit:debug` inherently universal - it just works for any debugging task (frontend, backend, infrastructure) without asking or detecting what stack is being debugged.

**Approach:** Remove frontend-specific references, create universal methodology.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phases -->
## Implementation Phases

### Phase 1: Create Universal Debugging Methodology

**Goal:** Provide stack-agnostic debugging reference.

**Tasks:**
1. Create file: `.opencode/skill/system-spec-kit/references/universal_debugging_methodology.md`
2. Document 4-phase approach (Observe → Analyze → Hypothesize → Fix)
3. Align with `skill_reference_template.md` format (emoji section headers)
4. Keep content applicable to ANY technology
5. Include verification checklist
6. Add to system-spec-kit SKILL.md resource inventory

**Output:** ~150 lines

---

### Phase 2: Update debug.md

**Goal:** Remove frontend-specific references.

**Tasks:**

#### 2.1 Update Error Category Indicators (Line ~554)
```
Before: lint_error | ESLint, Prettier, style violations
After:  lint_error | Linter errors, code style violations
```

#### 2.2 Update Related Templates Section (Lines ~561-565)
```
Before: References debugging_workflows.md (frontend-focused)
After:  References universal_debugging_methodology.md
```

#### 2.3 Update Integration Section (Lines ~619-630)
Generalize language to not imply frontend-only debugging.

**Output:** ~8 lines changed

---

### Phase 3: Validation

**Goal:** Verify stack-agnostic behavior.

**Tasks:**
1. Verify error categories are technology-neutral
2. Verify references point to universal methodology
3. Mental test: Works for Python debugging?
4. Mental test: Works for Go debugging?
5. Mental test: Works for Docker debugging?
6. Mental test: Still works for frontend debugging?
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:dependencies -->
## File Change Summary

| File | Action | Lines |
|------|--------|-------|
| `.opencode/skill/system-spec-kit/references/universal_debugging_methodology.md` | Create | ~150 |
| `.opencode/command/spec_kit/debug.md` | Modify | ~8 |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | ~2 |
| **Total** | | **~160** |
<!-- /ANCHOR:dependencies -->

---

## What's NOT Changing

- Sub-agent prompt template (already generic)
- debug-delegation.md template (no Technology Stack field)
- Workflow phases (no stack detection)
- YAML assets (already neutral)
- No user questions about stack

---

## Key Design Decision

**No Stack Awareness**

The debug command doesn't ask or detect what stack is being debugged. The sub-agent naturally adapts because:
- Error messages reveal the technology (traceback format, error codes)
- File extensions reveal the language
- Code snippets reveal syntax
- The LLM applies appropriate debugging strategies automatically

This is simpler and works just as well.

---

<!-- ANCHOR:effort -->
## Timeline Estimate

| Phase | Effort |
|-------|--------|
| Phase 1: Universal methodology | 15 min |
| Phase 2: debug.md updates | 5 min |
| Phase 3: Validation | 5 min |
| **Total** | **~25 min** |
<!-- /ANCHOR:effort -->
