---
title: "CFG-004 -- Root-path env-var override"
description: "This scenario validates `COCOINDEX_CODE_ROOT_PATH` precedence for `CFG-004`. It focuses on confirming that the env var explicitly overrides directory-marker discovery in the root-resolution chain documented in SKILL.md §3."
---

# CFG-004 -- Root-path env-var override

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CFG-004`.

---

## 1. OVERVIEW

This scenario validates the documented root-path resolution priority for `CFG-004`. SKILL.md §3 ("Root Path Discovery") declares the resolution order: (1) `COCOINDEX_CODE_ROOT_PATH` env var, (2) nearest parent with `.cocoindex_code/`, (3) nearest parent with project markers, (4) cwd fallback. This scenario verifies that priority (1) actually wins against priority (2) when both are present.

### Why This Matters

Operators running `ccc` from monorepo subtrees, worktrees, or CI runners rely on `COCOINDEX_CODE_ROOT_PATH` to pin the correct project root regardless of cwd. If the env var silently loses to a marker directory closer to cwd, indexing and search will target the wrong project and search results will be silently misleading. No existing scenario asserts this precedence.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CFG-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `COCOINDEX_CODE_ROOT_PATH` overrides the marker-directory discovery path; `ccc status` invoked from a child directory with the env var set reports stats for the env-var-pinned root, not the cwd-derived root.
- Real user request: `"I'm running ccc from inside a subfolder but I want it to act on a different project root — does the env var actually win?"`
- Prompt: `As a manual-testing orchestrator, set COCOINDEX_CODE_ROOT_PATH to an explicit project root path, then invoke ccc status from a subdirectory containing project markers (.git, package.json, etc.) and confirm the reported root matches the env var, not the subdirectory. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: identify the current project root with markers; cd into a subdirectory of the project (or any path containing `.git`); export `COCOINDEX_CODE_ROOT_PATH` pointing at the original project root; run `ccc status` and `ccc search` with `--limit 1`; verify the reported file count and result file paths trace back to the env-pinned root.
- Expected signals: `ccc status` invoked from the subdirectory with the env var set reports the same file/chunk counts as `ccc status` invoked at the env-var-pinned root; a one-result `ccc search` returns a path under the env-var-pinned root, not under cwd.
- Desired user-visible outcome: A short verdict naming the resolved root, the file count, and PASS confirming env-var precedence.
- Pass/fail: PASS if env-var-pinned root wins (counts match the root, search results live under the env-var path); FAIL if cwd-derived root wins (counts match the subdirectory, search results live under cwd-derived discovery).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, set COCOINDEX_CODE_ROOT_PATH to an explicit project root path, then invoke ccc status from a subdirectory containing project markers (.git, package.json, etc.) and confirm the reported root matches the env var, not the subdirectory. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: pwd` — record the project root (e.g., `/Users/.../Public`); confirm it has `.cocoindex_code/`
2. `bash: ccc status` — capture the baseline file/chunk counts at the env-var-pinned root (call this `BASELINE`)
3. `bash: cd .opencode && ls -la .git package.json 2>/dev/null` — pick a subdirectory; ensure it does NOT have its own `.cocoindex_code/`
4. `bash: cd .opencode && unset COCOINDEX_CODE_ROOT_PATH && ccc status` — capture the discovery-only behavior (`DISCOVERY`)
5. `bash: cd .opencode && export COCOINDEX_CODE_ROOT_PATH=/Users/.../Public && ccc status` — substitute the absolute path from step 1; capture the env-var-pinned behavior (`PINNED`)
6. `bash: cd .opencode && export COCOINDEX_CODE_ROOT_PATH=/Users/.../Public && ccc search "skill" --limit 1` — verify result path is under env-var-pinned root, not under `.opencode/`-relative cwd

### Expected

- Step 2: BASELINE shows non-zero file count
- Step 4: DISCOVERY either matches BASELINE (subdirectory walked up to the marker root) OR shows different counts indicating it picked a different root
- Step 5: PINNED file/chunk counts equal BASELINE — env var wins
- Step 6: returned file path begins with the absolute env-var-pinned root, not with a cwd-relative `./`
- Optional: if `ccc status` prints the resolved root path, it equals the env-var value

### Evidence

Capture verbatim outputs of all six steps with the env-var value visible (`echo $COCOINDEX_CODE_ROOT_PATH` between steps where state changes). Diff BASELINE vs PINNED counts to prove equivalence.

### Pass / Fail

- **Pass**: PINNED counts equal BASELINE AND the search result in step 6 traces to a file under the env-var-pinned root.
- **Fail**: PINNED counts differ from BASELINE (env var was ignored) OR search result in step 6 traces to a path outside the env-var-pinned root (env var was overridden by marker discovery).

### Failure Triage

1. If PINNED counts differ from BASELINE: confirm the env var is exported, not just set (use `bash: env | grep COCOINDEX_CODE_ROOT_PATH`); verify the path is absolute, not relative; rerun `ccc status` with `RUST_LOG=debug` or whatever logging flag the daemon honors and inspect for the resolved root.
2. If step 6 returns a path outside the env-var-pinned root: this is the dangerous failure mode — env var lost to marker discovery; capture the search response and escalate as a SKILL.md §3 contract regression.

### Optional Supplemental Checks

- Repeat steps 4-5 with a temporary directory created by `mktemp -d` (no project markers at all) to test the cwd fallback when the env var is unset and no markers exist.
- Repeat with the env var pointing at a NON-EXISTENT path to confirm the daemon errors loudly instead of silently falling back.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `03--configuration/001-default-model-verification.md` | Sibling configuration scenario |
| `03--configuration/003-status-verification.md` | Sibling scenario covering baseline `ccc status` shape |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-coco-index/SKILL.md` | §3 "Root Path Discovery" lists the 4-priority resolution order |
| `~/.cocoindex_code/global_settings.yml` | Global settings file consulted after root resolution |

---

## 5. SOURCE METADATA

- Group: Configuration
- Playbook ID: CFG-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--configuration/004-root-path-env-var-override.md`
