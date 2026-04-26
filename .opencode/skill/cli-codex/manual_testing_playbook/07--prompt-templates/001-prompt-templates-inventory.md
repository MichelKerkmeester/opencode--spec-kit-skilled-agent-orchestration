---
title: "CX-021 -- Use prompt_templates.md inventory"
description: "This scenario validates the prompt_templates.md inventory for `CX-021`. It focuses on confirming the documented templates produce a successful Codex dispatch when placeholders are filled."
---

# CX-021 -- Use prompt_templates.md inventory

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-021`.

---

## 1. OVERVIEW

This scenario validates the `prompt_templates.md` inventory for `CX-021`. It focuses on confirming the documented prompt templates (`assets/prompt_templates.md` §2-§10) are real, copy-paste ready and produce a successful Codex dispatch when placeholders are filled in.

### Why This Matters

`assets/prompt_templates.md` is the operator's go-to copy-paste asset for routine dispatches. SKILL.md §4 ALWAYS rule 10 mandates that operators load `assets/prompt_quality_card.md` before building dispatch prompts. The templates in `prompt_templates.md` are the high-volume reuse surface. If the templates regress (placeholders broken, examples don't compile, asset path wrong), every operator-facing recommendation in the skill loses fidelity.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-021` and confirm the expected signals without contradictory evidence.

- Objective: Verify the documented prompt templates are real, copy-paste ready and produce a successful dispatch when placeholders are filled.
- Real user request: `Pick a copy-paste template from the cli-codex prompt_templates asset, fill it in for a tiny health-check server, and run it.`
- Prompt: `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator picking a documented template, copy the "Single-File Application" template from assets/prompt_templates.md §2, fill placeholders for a tiny TypeScript health-check HTTP server, and dispatch the resulting prompt verbatim with --model gpt-5.5 --sandbox workspace-write -c model_reasoning_effort="medium" -c service_tier="fast" against /tmp/cli-codex-playbook-cx021/. Verify Codex exits 0, the generated file matches the template requirements (single complete file, all imports, error handling, comments, /healthz endpoint), and the operator can identify the template line from prompt_templates.md that was used. Return a verdict naming the template anchor (e.g., "§2 Single-File Application") and confirming the generated file works.`
- Expected execution process: Operator opens `assets/prompt_templates.md` §2 -> copies the "Single-File Application" template -> fills placeholders ([description] = health-check HTTP server, [language] = TypeScript, [requirements] = Express + /healthz endpoint + minimal logging) -> dispatches the resulting prompt -> verifies the generated file meets the template requirements.
- Expected signals: Generated file exists at `/tmp/cli-codex-playbook-cx021/server.ts`. File contains imports, error handling, comments and a `/healthz` endpoint. Operator records the template's anchor (e.g., `<!-- ANCHOR:code_generation -->` from `prompt_templates.md`). `codex exec` exits 0.
- Desired user-visible outcome: A real working health-check server generated from the documented template inventory, demonstrating that the template asset is operationally trustworthy.
- Pass/fail: PASS if exit 0 AND generated file exists with imports/error handling/comments/healthz endpoint AND the operator records the template anchor from prompt_templates.md. FAIL if exit non-zero, file missing required elements or the operator cannot identify the source template line.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `assets/prompt_templates.md` §2 and copy the "Single-File Application" template verbatim.
2. Fill placeholders for a TypeScript health-check HTTP server.
3. Dispatch the resulting prompt with the documented flags.
4. Verify the generated file matches the template requirements.
5. Record the template anchor in evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-021 | Use prompt_templates.md inventory | Verify a documented template is copy-paste ready and produces a working file | `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator picking a documented template, copy the "Single-File Application" template from assets/prompt_templates.md §2, fill placeholders for a tiny TypeScript health-check HTTP server, and dispatch the resulting prompt verbatim with --model gpt-5.5 --sandbox workspace-write -c model_reasoning_effort="medium" -c service_tier="fast" against /tmp/cli-codex-playbook-cx021/. Verify Codex exits 0, the generated file matches the template requirements (single complete file, all imports, error handling, comments, /healthz endpoint), and the operator can identify the template line from prompt_templates.md that was used. Return a verdict naming the template anchor (e.g., "§2 Single-File Application") and confirming the generated file works.` | 1. `bash: grep -A 10 "Single-File Application" .opencode/skill/cli-codex/assets/prompt_templates.md > /tmp/cli-codex-cx021-template.txt && grep -nE "<!-- ANCHOR:" .opencode/skill/cli-codex/assets/prompt_templates.md \| head -5 > /tmp/cli-codex-cx021-anchors.txt` -> 2. `bash: rm -rf /tmp/cli-codex-playbook-cx021 && mkdir -p /tmp/cli-codex-playbook-cx021` -> 3. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "Create a health-check HTTP server application in TypeScript. Requirements: Express framework, /healthz endpoint that returns {status: 'ok'}, error middleware, minimal request logging, written to /tmp/cli-codex-playbook-cx021/server.ts. Output a single complete file with all imports, error handling, and comments. Start immediately." > /tmp/cli-codex-cx021-stdout.txt 2>&1` -> 4. `bash: ls /tmp/cli-codex-playbook-cx021/server.ts && grep -E "import\|express\|/healthz\|try\|catch\|//" /tmp/cli-codex-playbook-cx021/server.ts > /tmp/cli-codex-cx021-checks.txt` -> 5. `bash: printf 'TEMPLATE ANCHOR: assets/prompt_templates.md §2 Single-File Application (<!-- ANCHOR:code_generation -->)\n' > /tmp/cli-codex-cx021-anchor-evidence.txt` | Step 1: template snippet captured AND anchor list shows `<!-- ANCHOR:code_generation -->`; Step 2: temp dir empty; Step 3: exit 0; Step 4: server.ts exists with imports, express reference, `/healthz` endpoint, try/catch error handling, and at least one `//` comment; Step 5: anchor evidence recorded | Template snippet, anchor list, captured stdout, generated server.ts, checks file, anchor evidence file, dispatched command line, exit code | PASS if Steps 1-5 all succeed, server.ts has all required template elements, AND the anchor evidence is recorded; FAIL if exit non-zero, file missing any required element, or anchor cannot be identified | (1) Re-read `assets/prompt_templates.md` §2 if the template snippet capture is empty; (2) re-run with `2>&1 \| tee` for stderr inline; (3) compile with `npx tsc --noEmit /tmp/cli-codex-playbook-cx021/server.ts` if syntax issues are suspected |

### Optional Supplemental Checks

- Repeat with a different template (e.g., §5 Test Generation - "Unit Tests" template) to confirm at least two templates from the inventory are operationally valid.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt_templates.md` (§2 Code Generation - Single-File Application) | Source template |
| `../../assets/prompt_quality_card.md` | Companion quality-card asset |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_templates.md` | §2 Single-File Application (RCAF framework) |
| `../../SKILL.md` | §4 ALWAYS rule 10 - load prompt_quality_card.md before building dispatch prompts |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CX-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--prompt-templates/001-prompt-templates-inventory.md`
