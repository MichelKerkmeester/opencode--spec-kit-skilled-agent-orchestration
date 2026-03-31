---
title: "Implementation Plan [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/015-system-analysis/plan]"
description: "Inject a \"Command Pattern Reference Protocol\" into SKILL.md. This protocol instructs agents to use sub-agents to scan available commands, extract their underlying logic/sequenci..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "speckit"
  - "command"
  - "pattern"
  - "015"
  - "system"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: SpecKit Command Pattern Reference Upgrade

> Upgrade the `system-spec-kit` skill to implement a "Pattern Extraction" protocol, enabling agents to intelligently adapt Command logic rather than blindly simulating it.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.1 -->

---

<!-- ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Tags**: speckit, skill-update, pattern-extraction, smart-adaptation
- **Priority**: P0
- **Branch**: `015-system-analysis`
- **Spec**: `spec.md` (System Analysis)

### Summary
Inject a **"Command Pattern Reference Protocol"** into `SKILL.md`. This protocol instructs agents to use sub-agents to scan available commands, extract their underlying logic/sequencing as "Reference Patterns," and adapt them to the current task. It emphasizes intelligent adaptation over rigid compliance.

---

<!-- /ANCHOR:summary -->
## 2. TECHNICAL APPROACH

### The "Reference Pattern" Philosophy
Instead of forcing manual agents to "act like the command," we enable them to "learn from the command."

**New Logic:**
1.  **Scan**: Active search for relevant command YAMLs.
2.  **Extract**: Identify key checkpoints, sequences, and logic gates.
3.  **Adapt**: Tailor these patterns to the specific user request.
4.  **Report**: Cite the "prior art" used.

**Crucial Distinction**:
- **Manual Mode**: Command logic is a *Resource* (Adaptable).
- **Command Mode** (Slash Command): Command logic is a *Constraint* (Enforced).

### Structure Changes to `SKILL.md`
We will re-structure the document to insert the new protocol as **Section 3**.

**Target Structure:**
1. WHEN TO USE
2. SMART ROUTING
3. **COMMAND PATTERN REFERENCE PROTOCOL** (New)
4. SPEC FOLDER CHOICE ENFORCEMENT (Renumbered)
5. REFERENCES (Renumbered)
6. HOW IT WORKS (Renumbered)
7. RULES (Renumbered)
8. SUCCESS CRITERIA (Renumbered)
9. INTEGRATION POINTS (Renumbered)

### Content of New Section 3
```markdown
## 3. COMMAND PATTERN REFERENCE PROTOCOL

**Philosophy**: Commands (`.opencode/command/**/*.yaml`) are high-value "Reference Patterns" containing optimized logic, not rigid laws for manual execution.

> **SIDE NOTE**: If a command is *explicitly invoked* (e.g., `/spec_kit:complete`), its logic is **ENFORCED LAW**, not just a reference.

**Execution Protocol**:

1.  **🔍 Scan**: Before diving in, use a parallel sub-agent to scan available commands and identify which ones are relevant to the task.
    *   *Prompt*: "Scan .opencode/command/ for workflows relevant to [task]."

2.  **🧩 Extract**: Treat these commands as reference patterns. Extract their:
    *   **Logic**: Decision trees and confidence checkpoints.
    *   **Sequencing**: Order of operations (e.g., Plan → Verify → Implement).
    *   **Structure**: Required outputs and validation steps.

3.  **🛠️ Adapt**: Build an approach tailored to the specific task by adapting the extracted patterns.
    *   *Rule*: Only apply a command directly as-is when it is **>80% relevant**. Otherwise, modify it to fit.

4.  **📝 Report**: After completing the task, report in `implementation-summary.md`:
    *   Which commands were referenced.
    *   How they contributed to the outcome.
```

---

## 3. IMPLEMENTATION STEPS

### Phase 1: Execution (The "Insert & Renumber" Operation)
- [ ] **Step 1.1**: Insert Section 3 "COMMAND PATTERN REFERENCE PROTOCOL" after Section 2.
- [ ] **Step 1.2**: Renumber Sections 3-8 to 4-9.
- [ ] **Step 1.3**: Update Table of Contents (if present) and internal links.

### Phase 2: Verification
- [ ] Verify the new section includes the specific "80% relevance" rule.
- [ ] Verify the "Report" requirement is clear.

---

## 4. RISKS & MITIGATIONS

### Risk: Analysis Paralysis
**Risk**: Agents might spend too much time analyzing 5+ commands.
**Mitigation**: The protocol specifies "identify *relevant* ones" (filtering) and using a "parallel sub-agent" (efficiency).

### Risk: Broken References
**Risk**: Renumbering sections breaks internal links (e.g., "See Section 5").
**Mitigation**: Grep for "Section [0-9]" patterns and update all occurrences.

---

## 5. SUCCESS METRICS

- **Adaptive Behavior**: Manual agents explicitly mention "Adapting logic from spec_kit_plan.yaml" instead of just "Running planning."
- **Traceability**: Implementation summaries cite the Command patterns used as inspiration.
