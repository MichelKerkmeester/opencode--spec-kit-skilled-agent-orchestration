---
title: "Spec: Make Debug Command Stack-Agnostic [006-debug-stack-agnostic/spec]"
description: "The /spec_kit:debug command has implicit frontend bias in its references, limiting its effectiveness for backend, infrastructure, and other debugging scenarios."
trigger_phrases:
  - "spec"
  - "make"
  - "debug"
  - "command"
  - "stack"
  - "006"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Spec: Make Debug Command Stack-Agnostic

<!-- ANCHOR:problem -->
## 1. Problem Statement

The `/spec_kit:debug` command has **implicit frontend bias** in its references, limiting its effectiveness for backend, infrastructure, and other debugging scenarios.

### Current Issues

| Component | Issue |
|-----------|-------|
| `debug.md` line 554 | Error indicators mention "ESLint, Prettier" (JS-specific tools) |
| `debug.md` lines 561-565 | References `debugging_workflows.md` (frontend-focused, 50+ DevTools mentions) |
| `debug.md` lines 619-630 | Integration section implies workflows-code = frontend debugging |

### Impact

- References point to frontend-specific debugging methodology
- Backend/infrastructure debugging gets irrelevant guidance
- The command works, but referenced materials don't apply universally
<!-- /ANCHOR:problem -->

---

## 2. Proposed Solution

Make the debug command **inherently universal** by:

1. **Removing** frontend-specific tool names from error categories
2. **Replacing** frontend-specific references with universal methodology
3. **Creating** a stack-agnostic debugging methodology document

### Design Principles

- **No stack detection** - Don't ask or detect what stack the user is debugging
- **No stack fields** - Don't add Technology Stack to templates
- **Inherently universal** - The command just works for any debugging task
- **Sub-agent adapts** - It sees error messages, file extensions, and code; it figures out the stack

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

| File | Change Type | Lines |
|------|-------------|-------|
| `.opencode/command/spec_kit/debug.md` | Modify | ~8 |
| `.opencode/skill/system-spec-kit/references/universal_debugging_methodology.md` | Create | ~150 |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | ~2 |
| **Total** | | **~160** |

### Out of Scope

- Stack detection logic
- Stack selection questions
- Technology Stack template fields
- Modifications to debug-delegation.md template
- Modifications to YAML assets
- Changes to other commands
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## 4. Success Criteria

- [ ] Error category indicators are technology-neutral (no tool-specific names)
- [ ] Related Templates section references universal methodology
- [ ] Integration section language is stack-agnostic
- [ ] Universal debugging methodology document exists
- [ ] Command works for frontend, backend, and infrastructure debugging without changes
<!-- /ANCHOR:success-criteria -->

---

## 5. Technical Approach

### 5.1 Universal Debugging Methodology

Stack-agnostic 4-phase approach applicable to ANY technology:

```
Phase 1: OBSERVE
├── Capture full error output
├── Document reproduction steps
├── Identify affected code locations
└── Note versions and environment

Phase 2: ANALYZE
├── Find similar working code
├── Read relevant documentation
├── List differences between working and broken
└── Map dependency chain

Phase 3: HYPOTHESIZE
├── Form specific hypothesis: "X causes Y because Z"
├── Make minimal change to test
├── Verify result
└── Iterate or conclude

Phase 4: FIX
├── Implement root cause fix (not symptom)
├── Verify across relevant contexts
├── Document why fix works
└── If 3+ fails → question architecture
```

### 5.2 Why No Stack Awareness Is Needed

The sub-agent naturally adapts because it receives:
- **Error messages** - Python tracebacks, JS errors, Go panics have distinct formats
- **File extensions** - *.py, *.js, *.go, *.rs reveal the language
- **Code snippets** - Syntax reveals the technology
- **Context** - The problem description reveals the domain

The LLM is smart enough to apply appropriate debugging strategies from this context.

---

<!-- ANCHOR:risks -->
## 6. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Universal methodology too generic | Low | Low | 4-phase approach is proven; stack-specific details come from LLM knowledge |
| Frontend debugging quality degrades | Very Low | Low | Only removing tool names, not methodology |
<!-- /ANCHOR:risks -->

---

## 7. Documentation Level

**Level 2** (100-499 LOC)

Required files:
- [x] spec.md (this file)
- [x] plan.md
- [x] checklist.md
- [x] decision-record.md
