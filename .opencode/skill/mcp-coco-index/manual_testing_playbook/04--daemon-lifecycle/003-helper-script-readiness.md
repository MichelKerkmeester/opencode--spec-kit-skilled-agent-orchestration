---
title: "DMN-003 -- Helper-script readiness (doctor.sh + ensure_ready.sh)"
description: "This scenario validates the `doctor.sh` and `ensure_ready.sh` helper scripts for `DMN-003`. It focuses on confirming that the SKILL.md §4 ALWAYS rule #7 readiness contract is enforceable: doctor reports health read-only, ensure_ready bootstraps the daemon idempotently, and `--strict --require-config` flags fail loudly on missing configuration."
---

# DMN-003 -- Helper-script readiness (doctor.sh + ensure_ready.sh)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DMN-003`.

---

## 1. OVERVIEW

This scenario validates the two operator-facing helper scripts shipped with the `mcp-coco-index` skill for `DMN-003`. SKILL.md §4 ALWAYS rule #7 mandates `doctor.sh --strict --require-config` and `ensure_ready.sh --strict --require-config` whenever readiness is unclear, but no existing scenario exercises either script.

### Why This Matters

`doctor.sh` is the canonical read-only health check; `ensure_ready.sh` is the canonical idempotent bootstrap. If either script silently passes when the daemon is unhealthy, or silently fails when the project is healthy, the SKILL.md §4 contract is broken and the entire skill's preflight story collapses. Operators relying on the helper-script gate (including Gate 2 routings that recommend the scripts) need this scenario to keep them honest.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DMN-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `doctor.sh --strict --require-config` exits 0 with healthy JSON in a healthy project; verify `ensure_ready.sh --strict --require-config` is idempotent and brings the daemon to running on first invocation; verify both scripts exit non-zero with explicit reason when `--require-config` is set against a project that lacks the config file.
- Real user request: `"Tell me whether this project is ready to run CocoIndex commands and bootstrap the daemon if it's not."`
- Prompt: `As a manual-testing orchestrator, run doctor.sh --json --strict --require-config followed by ensure_ready.sh --json --strict --require-config against the current CocoIndex install in this repository. Verify both scripts exit 0 with healthy JSON; rerun ensure_ready.sh and confirm idempotency; then run both scripts from a temp directory with no .cocoindex_code/ to confirm --require-config makes them exit non-zero with an explicit reason. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: invoke `doctor.sh` from project root with the JSON + strict flags; invoke `ensure_ready.sh` with the same flags; rerun `ensure_ready.sh` immediately and confirm the second invocation does not duplicate work; cd into a temp directory and rerun both with `--require-config` to confirm the negative-path contract.
- Expected signals: doctor exits 0, prints valid JSON containing health summary; ensure_ready exits 0 and reports daemon running; second ensure_ready invocation also exits 0 without error noise; in the temp directory both scripts exit non-zero with a clear "config not found" or equivalent message.
- Desired user-visible outcome: A short verdict listing exit codes for all four invocations and a PASS confirming both the positive (healthy project) and negative (missing config) paths work as documented.
- Pass/fail: PASS if all four invocations match the expected exit codes AND JSON outputs are well-formed; PARTIAL if positive-path passes but negative-path is silent (script exits 0 despite missing config); FAIL if positive-path errors against a healthy project.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, run doctor.sh --json --strict --require-config followed by ensure_ready.sh --json --strict --require-config against the current CocoIndex install in this repository. Verify both scripts exit 0 with healthy JSON; rerun ensure_ready.sh and confirm idempotency; then run both scripts from a temp directory with no .cocoindex_code/ to confirm --require-config makes them exit non-zero with an explicit reason. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: bash .opencode/skill/mcp-coco-index/scripts/doctor.sh --json --strict --require-config; echo "exit=$?"` — capture exit code + JSON
2. `bash: bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --json --strict --require-config; echo "exit=$?"` — first invocation; capture exit + JSON
3. `bash: bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --json --strict --require-config; echo "exit=$?"` — second invocation back-to-back to verify idempotency
4. `bash: ccc daemon status` — confirm daemon is running after step 2
5. `bash: TMP=$(mktemp -d) && cd "$TMP" && bash <project_root>/.opencode/skill/mcp-coco-index/scripts/doctor.sh --json --strict --require-config; echo "exit=$?"` — negative path: no config in cwd
6. `bash: cd "$TMP" && bash <project_root>/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --json --strict --require-config; echo "exit=$?"` — negative path: no config in cwd
7. `bash: rm -rf "$TMP"` — cleanup

### Expected

- Step 1: exit code 0; stdout is valid JSON containing a health/status field; no `--strict` violations
- Step 2: exit code 0; stdout is valid JSON; daemon transitions to or remains in running state
- Step 3: exit code 0; second invocation is fast and does not duplicate bootstrap work (idempotent)
- Step 4: daemon status reports running with PID + uptime
- Step 5: exit code non-zero; stderr OR JSON contains an explicit "config not found" / "missing required config" / equivalent reason string
- Step 6: exit code non-zero with the same kind of explicit message; daemon is NOT bootstrapped against the temp directory

### Evidence

Capture verbatim stdout, stderr, and exit code for steps 1, 2, 3, 5, 6. Capture `ccc daemon status` output from step 4. Diff the JSON from step 2 vs step 3 to demonstrate idempotency (or document any expected per-invocation diffs like timestamps).

### Pass / Fail

- **Pass**: All exit codes match expected (0 for steps 1-3, 5+ non-zero for steps 5-6); all JSON parses; daemon is running after step 2; second invocation in step 3 is clean.
- **Partial**: Positive-path (steps 1-4) all pass but negative-path (steps 5-6) returns exit 0 despite missing config — `--require-config` is not enforced.
- **Fail**: Step 1 or step 2 errors against a healthy project, OR step 3 produces unexpected error noise (idempotency broken), OR step 4 reports daemon stopped after step 2.

### Failure Triage

1. If step 1 or 2 errors against a healthy project: re-run without `--strict` to isolate which check is failing; capture the JSON `errors` or `warnings` field; check `~/.cocoindex_code/daemon.log` for daemon-side context; verify the project has been initialized with `ccc init` (precondition for `--require-config`).
2. If step 3 (idempotency) is noisy: confirm the script is actually re-checking state instead of re-bootstrapping; if it tries to re-init the daemon every call, this is an idempotency regression in `ensure_ready.sh` — capture both invocations' JSON for diff and escalate.
3. If steps 5 or 6 silently exit 0: `--require-config` is not enforced — the script must surface a non-zero exit when its preconditions are unmet; capture both invocations' JSON and escalate as a SKILL.md §4 contract regression.

### Optional Supplemental Checks

- Run step 1 with `--require-daemon` after intentionally stopping the daemon (`ccc daemon stop`) to confirm doctor distinguishes "daemon stopped" from "config missing".
- Run step 2 with `--refresh-index` and confirm the JSON reports an index-refresh action separately from bootstrap actions.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `04--daemon-lifecycle/001-daemon-auto-start.md` | Sibling scenario covering daemon auto-start on first command |
| `04--daemon-lifecycle/002-daemon-status-inspection.md` | Sibling scenario covering daemon PID + socket file health |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-coco-index/SKILL.md` | §4 ALWAYS rule #7 mandates the helper scripts; §8 RELATED RESOURCES documents script flags |
| `.opencode/skill/mcp-coco-index/scripts/doctor.sh` | Read-only health check script |
| `.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh` | Idempotent bootstrap script |

---

## 5. SOURCE METADATA

- Group: Daemon Lifecycle
- Playbook ID: DMN-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--daemon-lifecycle/003-helper-script-readiness.md`
