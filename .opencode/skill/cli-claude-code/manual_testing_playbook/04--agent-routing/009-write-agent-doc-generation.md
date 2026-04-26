---
title: "CC-025 -- Write agent doc generation"
description: "This scenario validates Write agent doc generation for `CC-025`. It focuses on confirming `--agent write` produces a sk-doc template-driven README with TOC and emoji-prefixed H2 headers."
---

# CC-025 -- Write agent doc generation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-025`.

---

## 1. OVERVIEW

This scenario validates Write agent doc generation for `CC-025`. It focuses on confirming `--agent write` writes a sk-doc template-driven README to a temporary path with a TABLE OF CONTENTS and at least 3 emoji-prefixed H2 headers, demonstrating the documentation-quality contract end-to-end.

### Why This Matters

The `write` agent is the documented documentation-generation specialist per SKILL.md §3 Agent Routing Table. When an external orchestrator delegates README or guide creation to Claude Code, the write agent must apply sk-doc templates and DQI scoring rather than emitting freeform prose. If the output skips the template, the documentation-quality contract for cli-claude-code-routed docs collapses and downstream validators (validate_document.py) will reject the artifact.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-025` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent write` writes a README to a temp path that contains a TABLE OF CONTENTS and >= 3 emoji-prefixed H2 headers.
- Real user request: `Use Claude Code to generate a README for a small demo skill. Make sure it follows our doc standards.`
- Prompt: `As an external-AI conductor wanting a template-driven README for a small skill, dispatch claude -p --agent write to generate /tmp/cc-025-readme/README.md for a fictional skill called "Demo Skill" with one short description paragraph. Verify the file is written, contains a TABLE OF CONTENTS section, and has at least 3 emoji-prefixed H2 headers. Return a verdict naming the file path and the H2 emoji count.`
- Expected execution process: External-AI orchestrator pre-creates the temp directory, dispatches with `--agent write`, then verifies the file exists with TOC and emoji-prefixed H2 sections.
- Expected signals: Dispatch exits 0. README file exists at the requested path. README contains a `TABLE OF CONTENTS` section. H2 headers include emojis (per sk-doc template enforcement).
- Desired user-visible outcome: A working README the operator can use as the seed for a new skill, with documentation-quality discipline visible in the structure.
- Pass/fail: PASS if exit 0 AND README exists AND README has `TABLE OF CONTENTS` AND H2 emoji count >= 3. FAIL if any check fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pre-create `/tmp/cc-025-readme/`.
3. Dispatch with `--agent write` and the README generation request.
4. Verify the README file exists with TOC and emoji-prefixed H2 sections.
5. Return a verdict naming the file path and the H2 emoji count.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-025 | Write agent doc generation | Confirm `--agent write` writes a sk-doc template-driven README with TOC and emoji H2 headers | `As an external-AI conductor wanting a template-driven README for a small documentation skill, dispatch claude -p --agent write to generate /tmp/cc-025-readme/README.md for a fictional skill called "Demo Skill" with one short description paragraph. Verify the dispatch loads sk-doc, applies readme_template.md, writes the README file, and the file contains a TABLE OF CONTENTS plus emoji-prefixed H2 sections. Return a verdict naming the file path and the H2 emoji count.` | 1. `bash: rm -rf /tmp/cc-025-readme && mkdir -p /tmp/cc-025-readme` -> 2. `bash: claude -p "Generate a README at /tmp/cc-025-readme/README.md for a fictional skill called Demo Skill. Use the sk-doc readme_template.md. Describe a hypothetical hello-world utility in one short paragraph. Include the standard sk-doc sections (OVERVIEW, QUICK START, etc.) with emoji-prefixed H2 headers and a TABLE OF CONTENTS." --agent write --output-format text 2>&1 \| tee /tmp/cc-025-output.txt` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: ls -la /tmp/cc-025-readme/README.md && wc -l /tmp/cc-025-readme/README.md` -> 5. `bash: grep -ciE 'TABLE OF CONTENTS' /tmp/cc-025-readme/README.md` -> 6. `bash: grep -E '^## [0-9]+\.' /tmp/cc-025-readme/README.md \| python3 -c "import sys, re; lines = sys.stdin.read().splitlines(); emoji_re = re.compile(r'[\U0001F300-\U0001F9FF☀-➿]'); count = sum(1 for line in lines if emoji_re.search(line)); print(count)"` | Step 1: temp dir created; Step 2: dispatch captured; Step 3: exit 0; Step 4: README exists with line count > 0; Step 5: TABLE OF CONTENTS mention count >= 1; Step 6: H2 emoji count >= 3 | `/tmp/cc-025-readme/README.md`, `/tmp/cc-025-output.txt`, terminal grep counts | PASS if exit 0 AND README exists AND TOC present AND H2 emoji count >= 3; FAIL if any check fails | 1. If README is missing, the write agent may have refused or hit a path restriction, verify the temp dir is writable and re-dispatch; 2. If TOC is missing, sk-doc template was bypassed, re-prompt explicitly invoking sk-doc; 3. If H2 emoji count is 0, sk-doc template enforcement was bypassed, file a regression bug; 4. If `--agent write` is rejected, run `claude agents list` |

### Optional Supplemental Checks

For full sk-doc validation, run `python3 .opencode/skill/sk-doc/scripts/validate_document.py /tmp/cc-025-readme/README.md` and confirm exit 0. This proves the generated README passes the project's strict format validator, not just the lightweight TOC plus emoji checks above.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` | Write agent role per the documented roster |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 218) | Documents the write agent in the §3 Agent Routing Table |
| `../../references/agent_delegation.md` | Agent contract for documentation generation |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CC-025
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/009-write-agent-doc-generation.md`
