---
title: "CX-027 -- @write profile (documentation-only edits)"
description: "This scenario validates the codex exec -p write profile for `CX-027`. It focuses on confirming the write profile generates a structured README to a temp path under workspace-write sandbox."
---

# CX-027 -- @write profile (documentation-only edits)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-027`.

---

## 1. OVERVIEW

This scenario validates the `codex exec -p write` profile for `CX-027`. It focuses on confirming the `write` profile (workspace-write sandbox) generates a structured README at a requested temp path with at least 3 H2 section headers and a non-empty body, demonstrating documentation-only edit behavior end-to-end.

### Why This Matters

`agent_delegation.md` §3 defines the `write` profile as the documentation specialist with workspace-write sandbox access. The cli-codex routing matrix points operators at `-p write` for README and guide generation as the documentation-only counterpart to general workspace-write code generation. If the write profile silently writes outside the requested target path, omits H2 structure or produces empty output, the documentation-quality contract for cross-AI Codex dispatches is broken.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-027` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex exec -p write` writes a README to a requested temp path with at least 3 H2 headers and a non-empty body, AND no files are touched outside the temp directory.
- Real user request: `Use Codex to generate a README for a small demo skill. Write it to a temp path so I can review before committing.`
- Prompt: `As a cross-AI orchestrator delegating documentation generation, dispatch codex exec -p write --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "Generate /tmp/cli-codex-playbook-cx027/README.md for a fictional Demo Skill. Include OVERVIEW, USAGE, and TROUBLESHOOTING H2 sections plus a one-paragraph description. Do not modify any files outside /tmp/cli-codex-playbook-cx027/." Verify the dispatch routes via -p write, the README is written at the requested path, the file contains at least 3 H2 headers, the body is non-empty, and no files outside the temp directory are touched. Return a verdict naming the file path, the H2 header count, and confirming the sandbox boundary.`
- Expected execution process: Cross-AI orchestrator pre-creates the temp directory, dispatches `-p write --sandbox workspace-write` with the README request, then verifies the file exists with >= 3 H2 headers and a non-empty body and confirms the working tree outside `/tmp/` is unchanged.
- Expected signals: `codex exec -p write` exits 0. README file exists at `/tmp/cli-codex-playbook-cx027/README.md`. README contains at least 3 H2 headers (`^## `). Body line count > 5. `git status --porcelain` reports no working-tree changes. Dispatched command line includes `-p write`.
- Desired user-visible outcome: A working README file the operator can review and commit, with provable evidence the sandbox boundary held.
- Pass/fail: PASS if exit 0 AND README exists AND H2 count >= 3 AND body line count > 5 AND working tree clean AND `-p write` in dispatch. FAIL if any check misses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create `/tmp/cli-codex-playbook-cx027/`.
2. Snapshot working tree status before dispatch.
3. Dispatch `-p write --sandbox workspace-write` with the README request.
4. Verify the README exists with >= 3 H2 headers.
5. Verify body line count > 5.
6. Verify working tree status after dispatch matches before (no unintended writes).

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-027 | @write profile (documentation-only edits) | Verify -p write generates a structured README at a temp path with >= 3 H2 headers under workspace-write sandbox | `As a cross-AI orchestrator delegating documentation generation, dispatch codex exec -p write --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "Generate /tmp/cli-codex-playbook-cx027/README.md for a fictional Demo Skill. Include OVERVIEW, USAGE, and TROUBLESHOOTING H2 sections plus a one-paragraph description. Do not modify any files outside /tmp/cli-codex-playbook-cx027/." Verify the dispatch routes via -p write, the README is written at the requested path, the file contains at least 3 H2 headers, the body is non-empty, and no files outside the temp directory are touched. Return a verdict naming the file path, the H2 header count, and confirming the sandbox boundary.` | 1. `bash: rm -rf /tmp/cli-codex-playbook-cx027 && mkdir -p /tmp/cli-codex-playbook-cx027` -> 2. `bash: git status --porcelain > /tmp/cli-codex-cx027-pre.txt` -> 3. `codex exec -p write --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "Generate /tmp/cli-codex-playbook-cx027/README.md for a fictional Demo Skill. Include OVERVIEW, USAGE, and TROUBLESHOOTING H2 sections plus a one-paragraph description. Do not modify any files outside /tmp/cli-codex-playbook-cx027/." </dev/null > /tmp/cli-codex-cx027.txt 2>&1` -> 4. `bash: echo "Exit: $?"` -> 5. `bash: ls -la /tmp/cli-codex-playbook-cx027/README.md && wc -l /tmp/cli-codex-playbook-cx027/README.md` -> 6. `bash: grep -cE '^## ' /tmp/cli-codex-playbook-cx027/README.md` -> 7. `bash: git status --porcelain > /tmp/cli-codex-cx027-post.txt && diff /tmp/cli-codex-cx027-pre.txt /tmp/cli-codex-cx027-post.txt && echo OK_TREE_CLEAN` | Step 1: temp dir created; Step 2: pre-snapshot captured; Step 3: dispatch captured; Step 4: exit 0; Step 5: README exists with line count > 5; Step 6: H2 header count >= 3; Step 7: `OK_TREE_CLEAN` printed | `/tmp/cli-codex-playbook-cx027/README.md`, `/tmp/cli-codex-cx027.txt`, pre and post tree-status diff | PASS if exit 0 AND README exists AND H2 count >= 3 AND line count > 5 AND working tree clean AND `-p write` in dispatch; FAIL if any check misses | (1) Define `[profiles.write]` in config.toml if missing per agent_delegation.md §2 (sandbox_mode = "workspace-write"); (2) if README is missing, the write profile may have routed to a different path, inspect stdout for the actual write target; (3) if working tree changed, the sandbox boundary failed, file a high-severity bug |

### Optional Supplemental Checks

Run `python3 .opencode/skill/sk-doc/scripts/validate_document.py /tmp/cli-codex-playbook-cx027/README.md` to validate the generated README passes the project's strict format validator. The write profile is not bound to sk-doc templates, so validator failures are expected unless the prompt explicitly invokes sk-doc.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 @write) | Documents the write profile contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent_delegation.md` | §3 @write, Documentation Writer |
| `.codex/config.toml` (or `~/.codex/config.toml`) | `[profiles.write]` section |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CX-027
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/006-write-profile.md`
