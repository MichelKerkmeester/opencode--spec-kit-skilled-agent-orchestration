---
title: "CO-016 -- Write agent documentation generation"
description: "This scenario validates the write agent for `CO-016`. It focuses on confirming `--agent write` loads the sk-doc skill, applies the appropriate template, and writes documentation files with workspace-write permission."
---

# CO-016 -- Write agent documentation generation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-016`.

---

## 1. OVERVIEW

This scenario validates the Write agent documentation generation for `CO-016`. It focuses on confirming `--agent write` loads the sk-doc skill, applies the appropriate template (e.g., `readme_template.md`), runs the DQI score and produces a documentation file at the requested path within its workspace-write permission.

### Why This Matters

The `write` agent is the canonical documentation generator for cli-opencode dispatches that need template-driven, DQI-scored output. It is the bridge between external runtime requests like "generate a README" and the project's sk-doc quality enforcement. If the write agent silently bypasses sk-doc or produces freeform output, the entire template-first quality story for cli-opencode-routed documentation collapses. This test proves the write agent loads sk-doc, applies a template and writes the output.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-016` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent write` loads the sk-doc skill, applies the appropriate template and writes a documentation file to the requested path under workspace-write sandbox.
- Real user request: `Use opencode run with --agent write to generate a README for a small temporary folder. Confirm the README file is written, contains the sk-doc template structure (TOC + emoji headers), and the JSON event stream shows sk-doc was loaded.`
- Prompt: `As an external-AI conductor wanting a template-driven README for a small documentation skill, dispatch --agent write to generate /tmp/co-016-readme/README.md for a fictional skill called "Demo Skill" with one paragraph of description. Verify the dispatch loads sk-doc, applies readme_template.md, writes the README file, and the file contains a TABLE OF CONTENTS plus emoji-prefixed H2 sections. Return a concise pass/fail verdict naming the file path written and the H2 emoji count.`
- Expected execution process: External-AI orchestrator pre-creates the temp directory, dispatches with `--agent write`, captures the JSON event stream, validates a sk-doc-related skill load and a Write tool.call appear, then validates the resulting file exists with TOC and emoji-prefixed H2 sections.
- Expected signals: Dispatch exits 0. JSON event stream includes a Write tool.call for the README path. The README file exists at the expected path. The README contains a `TABLE OF CONTENTS` section. H2 headers include emojis (per sk-doc template enforcement).
- Desired user-visible outcome: Verdict naming the README path, the H2 emoji count and the line count of the generated file.
- Pass/fail: PASS if exit 0 AND README exists AND README has `TABLE OF CONTENTS` AND H2 emoji count >= 3. FAIL if any check fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pre-create `/tmp/co-016-readme/`.
3. Dispatch with `--agent write` and the README generation request.
4. Validate the JSON event stream shows a Write tool.call for the README path.
5. Validate the README file exists with TOC and emoji-prefixed H2 sections.
6. Return a verdict naming the file path and the H2 emoji count.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-016 | Write agent documentation generation | Confirm `--agent write` loads sk-doc, applies readme_template.md, and writes a TOC + emoji-H2 README | `As an external-AI conductor wanting a template-driven README for a small documentation skill, dispatch --agent write to generate /tmp/co-016-readme/README.md for a fictional skill called "Demo Skill" with one paragraph of description. Verify the dispatch loads sk-doc, applies readme_template.md, writes the README file, and the file contains a TABLE OF CONTENTS plus emoji-prefixed H2 sections. Return a concise pass/fail verdict naming the file path written and the H2 emoji count.` | 1. `bash: rm -rf /tmp/co-016-readme && mkdir -p /tmp/co-016-readme` -> 2. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent write --variant high --format json --dir "$(pwd)" "Generate a README at /tmp/co-016-readme/README.md for a fictional skill called Demo Skill. Use sk-doc readme_template.md. The README should describe a hypothetical hello-world utility in one short paragraph and include sk-doc's standard sections (OVERVIEW, QUICK START, etc.) with emoji-prefixed H2 headers and a TABLE OF CONTENTS." > /tmp/co-016-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "tool.call") \| .payload.name' /tmp/co-016-events.jsonl \| grep -ciE 'Write'` -> 5. `bash: ls -la /tmp/co-016-readme/README.md && wc -l /tmp/co-016-readme/README.md` -> 6. `bash: grep -ciE 'TABLE OF CONTENTS' /tmp/co-016-readme/README.md` -> 7. `bash: grep -E '^## [0-9]+\.' /tmp/co-016-readme/README.md \| python3 -c "import sys, re; lines = sys.stdin.read().splitlines(); emoji_re = re.compile(r'[\U0001F300-\U0001F9FF☀-➿]'); count = sum(1 for line in lines if emoji_re.search(line)); print(count)"` | Step 1: temp dir created; Step 2: events captured; Step 3: exit 0; Step 4: count of Write tool.calls >= 1; Step 5: README exists with line count > 0; Step 6: TABLE OF CONTENTS mention count >= 1; Step 7: H2 emoji count >= 3 | `/tmp/co-016-readme/README.md`, `/tmp/co-016-events.jsonl`, terminal grep counts | PASS if exit 0 AND README exists AND TOC present AND H2 emoji count >= 3; FAIL if any check fails | 1. If README is missing, the write agent may have refused or hit a path restriction — verify the temp dir is writable and re-dispatch; 2. If TOC is missing, sk-doc template was bypassed — re-prompt explicitly invoking sk-doc; 3. If H2 emoji count is 0, sk-doc template enforcement was bypassed — file a regression bug; 4. If `--agent write` is not found, run `opencode agent list` |

### Optional Supplemental Checks

For full sk-doc validation, run `python3 .opencode/skill/sk-doc/scripts/validate_document.py /tmp/co-016-readme/README.md` and confirm exit 0. This proves the generated README passes the project's strict format validator, not just the lightweight TOC + emoji checks above.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 write agent property table + §4 routing matrix) | Write agent documentation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 agent routing table (`write` row) |
| `../../assets/prompt_templates.md` (TEMPLATE 11: Doc generation via @WRITE) | Canonical write-agent prompt shape |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CO-016
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/004-write-agent-doc-generation.md`
