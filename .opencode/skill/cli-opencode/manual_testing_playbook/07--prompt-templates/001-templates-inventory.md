---
title: "CO-023 -- Prompt templates inventory (13 templates)"
description: "This scenario validates the prompt templates inventory for `CO-023`. It focuses on confirming the canonical 13 templates documented in assets/prompt_templates.md are loadable and structurally complete."
---

# CO-023 -- Prompt templates inventory (13 templates)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-023`.

---

## 1. OVERVIEW

This scenario validates the Prompt templates inventory for `CO-023`. It focuses on confirming the cli-opencode `assets/prompt_templates.md` ships exactly the documented 13 templates (per the file's overview and SKILL.md §5) and each template includes the documented framework tag, target use case, prompt body and invocation shape.

### Why This Matters

The 13 templates are the operator's first stop for routine cli-opencode dispatches. They cover the three documented use cases plus specialized agent dispatches, parallel detached, ablation, worker farm and Memory Epilogue. If any template is missing or structurally degraded (no framework tag, no invocation shape), the calling AI loses its canonical copy-paste source for cli-opencode prompts. This test validates the inventory completeness and structure.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CO-023` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `assets/prompt_templates.md` contains exactly 13 numbered templates (TEMPLATE 1 through TEMPLATE 13), each with a framework tag and an invocation shape (or refusal-message body for Template 12).
- Real user request: `Open assets/prompt_templates.md and confirm we have all 13 templates: 1-3 for the three use cases, 4-11 for specialized agents and patterns, 12 for the refusal surface, 13 for the Memory Epilogue tail.`
- Prompt: `As an external-AI conductor wanting to verify the prompt template inventory before constructing a dispatch, load assets/prompt_templates.md and count the TEMPLATE N section headers. Verify all 13 templates are present, each named template includes a Framework tag, and each invocation template includes a bash code block (Templates 1-11). Template 12 is the refusal surface (no bash block). Template 13 is the Memory Epilogue (no bash block). Return a concise pass/fail verdict naming the template count and any missing templates.`
- Expected execution process: External-AI orchestrator greps the templates file for `## N. TEMPLATE` headers, counts to confirm 13, then validates each template has a Framework: line and Templates 1-11 each include a bash code block.
- Expected signals: 13 unique TEMPLATE headers (TEMPLATE 1 through TEMPLATE 13). Each template includes a `**Framework:**` line. Templates 1-11 each include a `bash` fenced code block. Templates 12 and 13 do NOT require a bash block.
- Desired user-visible outcome: Verdict naming the template count and confirming all 13 are present.
- Pass/fail: PASS if exactly 13 templates AND each has Framework tag AND Templates 1-11 each have bash block. FAIL if count != 13 or any template is structurally incomplete.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Grep template headers and count.
3. Grep Framework lines and count.
4. Count bash code blocks across the file.
5. Spot-check Templates 12 and 13 are present without bash blocks.
6. Return a verdict naming the template count and structural status.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-023 | Prompt templates inventory (13 templates) | Confirm assets/prompt_templates.md contains exactly 13 numbered templates with framework tags and invocation shapes where applicable | `As an external-AI conductor wanting to verify the prompt template inventory before constructing a dispatch, load assets/prompt_templates.md and count the TEMPLATE N section headers. Verify all 13 templates are present, each named template includes a Framework tag, and each invocation template includes a bash code block (Templates 1-11). Template 12 is the refusal surface (no bash block). Template 13 is the Memory Epilogue (no bash block). Return a concise pass/fail verdict naming the template count and any missing templates.` | 1. `bash: grep -c '^## .*TEMPLATE [0-9]' .opencode/skill/cli-opencode/assets/prompt_templates.md` -> 2. `bash: grep -E '^## .*TEMPLATE [0-9]' .opencode/skill/cli-opencode/assets/prompt_templates.md \| sort -t' ' -k4 -n` -> 3. `bash: grep -c '\*\*Framework:\*\*' .opencode/skill/cli-opencode/assets/prompt_templates.md` -> 4. `bash: grep -c '^\`\`\`bash' .opencode/skill/cli-opencode/assets/prompt_templates.md` -> 5. `bash: grep -nE 'TEMPLATE 12.*SELF-INVOCATION REFUSAL\|TEMPLATE 13.*MEMORY EPILOGUE' .opencode/skill/cli-opencode/assets/prompt_templates.md` | Step 1: header count = 13; Step 2: list shows all 13 templates in numerical order; Step 3: Framework count >= 12 (Template 12 may not have a Framework line — operator confirms manually); Step 4: bash code block count >= 11 (Templates 1-11); Step 5: matches show Template 12 (refusal) and Template 13 (epilogue) present | Terminal grep counts and template enumeration | PASS if exactly 13 templates AND >= 12 Framework lines AND >= 11 bash blocks AND Templates 12 + 13 present; FAIL if count is wrong or any template is structurally incomplete | 1. If count != 13, list which TEMPLATE numbers are missing (e.g., gap between 8 and 10 means 9 is missing) — file a documentation bug; 2. If a template is missing the Framework tag, surface it for manual patching; 3. If Template 12 or 13 are missing, the refusal surface or Memory Epilogue documentation has regressed — file a P0 bug; 4. If the count is higher than 13, a template was added without a corresponding numbered entry — clean up duplicates |

### Optional Supplemental Checks

For each template, optionally validate the Framework tag matches the prompt_quality_card framework selection table (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT). Mismatches between template Framework tags and the quality card's selection table indicate documentation drift.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../assets/prompt_templates.md` | The templates inventory under inspection |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §5 references list (`prompt_templates.md`, 13 templates) |
| `../../assets/prompt_templates.md` | §1 OVERVIEW + numbered templates 1-13 + §15 RELATED RESOURCES |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-023
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--prompt-templates/001-templates-inventory.md`
