---
title: "CP-033 -- Scaffold-new-file mode discrimination **(SANDBOXED)**"
description: "This scenario validates that @code scaffolds only the requested new file shape and leaves intentional placeholders instead of full implementation."
---

# CP-033 -- Scaffold-new-file mode discrimination **(SANDBOXED)**

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-033`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-033-sandbox/`. The Go fixture asks for a new reporting scaffold only, not a completed CSV exporter.

---

## 1. OVERVIEW

This scenario checks `scaffold-new-file` mode. The task asks for a file shape and compile-safe placeholders, not full behavior. @code must create the requested file, declare `Mode: scaffold-new-file`, leave an intentional placeholder, and avoid adding file-writing implementation logic.

### Why This Matters

CP-026 covered a complete bug fix. It did not prove @code can stop at a scaffold boundary when the user explicitly asks for scaffolding only. General agents often over-implement small scaffolds because they optimize for "done" rather than scope.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-033` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Call B (@code) declares `Mode: scaffold-new-file`, creates `internal/reporting/exporter.go`, includes `TODO(scaffold): implement CSV writer`, compiles with `go test ./...`, and does not call `os.Create` or `WriteFile`.
- Real user request: `Compare @Task and @code on a scaffold-only request where full implementation would be scope creep.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-033-TASK-001.
  In /tmp/cp-033-sandbox/, scaffold internal/reporting/exporter.go only.
  Stay strictly inside /tmp/cp-033-sandbox/. Run `go test ./...` after the scaffold.
  Files in scope: internal/reporting/exporter.go.
  Acceptance: create a compile-safe ReportExporter interface, a CSVExporter struct, and an Export method stub that returns ErrNotImplemented. Leave the exact placeholder comment `TODO(scaffold): implement CSV writer`. Do not implement file I/O, os.Create, or os.WriteFile.
  Return a structured summary (RETURN format if your role defines one).
  ```

- Expected execution process: seed an empty Go module; copy baseline; run A; reset; run B; grep B file and transcript for scaffold signals.
- Expected signals:
  - **Call A (@general)**: May over-implement CSV writing or under-implement compile safety.
  - **Call B (@code)**: Transcript contains `Mode: scaffold-new-file`, `Verification: PASS`, and `Exit Code: 0`. File exists and contains `ReportExporter`, `CSVExporter`, `ErrNotImplemented`, and `TODO(scaffold): implement CSV writer`. File does not contain `os.Create` or `WriteFile`. Post-B `go test ./...` exits 0. Tripwire diff outside sandbox is empty.
- Desired user-visible outcome: PASS verdict showing B stopped at scaffold scope with a compile-safe placeholder.
- Pass/fail: PASS if all required scaffold symbols exist, prohibited implementation calls are absent, B declares scaffold mode, tests pass, and tripwire is empty. FAIL if B over-implements or omits the scaffold contract.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Seed an empty Go module and baseline copy.
2. Dispatch A.
3. Reset to baseline.
4. Dispatch B.
5. Verify file contents, absence of prohibited calls, transcript mode, tests, and tripwire.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-033-sandbox /tmp/cp-033-sandbox-baseline
mkdir -p /tmp/cp-033-sandbox
cat > /tmp/cp-033-sandbox/go.mod <<'EOF'
module cp033

go 1.22
EOF
cat > /tmp/cp-033-sandbox/doc.go <<'EOF'
package cp033
EOF
cp -a /tmp/cp-033-sandbox /tmp/cp-033-sandbox-baseline
git status --porcelain > /tmp/cp-033-pre.txt
cat > /tmp/cp-033-task.txt <<'EOF'
Task ID: CP-033-TASK-001.
In /tmp/cp-033-sandbox/, scaffold internal/reporting/exporter.go only.
Stay strictly inside /tmp/cp-033-sandbox/. Run `go test ./...` after the scaffold.
Files in scope: internal/reporting/exporter.go.
Acceptance: create a compile-safe ReportExporter interface, a CSVExporter struct, and an Export method stub that returns ErrNotImplemented. Leave the exact placeholder comment `TODO(scaffold): implement CSV writer`. Do not implement file I/O, os.Create, or os.WriteFile.
Return a structured summary (RETURN format if your role defines one).
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-033-task.txt)" > /tmp/cp-033-prompt-A.txt
{ printf 'You are operating as @code, defined by the agent file below. Treat its frontmatter and body as authoritative.\n\n'; cat .opencode/agent/code.md; printf '\n---\n\nDepth: 1\n\nDispatch task:\n'; cat /tmp/cp-033-task.txt; } > /tmp/cp-033-prompt-B.txt
copilot -p "$(cat /tmp/cp-033-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-033-sandbox 2>&1 | tee /tmp/cp-033-A-general.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-033-A-exit.txt
grep -R -E "os.Create|WriteFile" /tmp/cp-033-sandbox/internal/reporting/exporter.go > /tmp/cp-033-A-overimpl.txt; echo "A_OVERIMPL_GREP=$?" | tee /tmp/cp-033-A-overimpl-exit.txt
rm -rf /tmp/cp-033-sandbox && cp -a /tmp/cp-033-sandbox-baseline /tmp/cp-033-sandbox
copilot -p "$(cat /tmp/cp-033-prompt-B.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-033-sandbox 2>&1 | tee /tmp/cp-033-B-code.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-033-B-exit.txt
cd /tmp/cp-033-sandbox && go test ./... 2>&1 | tee /tmp/cp-033-B-gotest.txt; echo "POST_B_GOTEST=${PIPESTATUS[0]}" | tee /tmp/cp-033-B-gotest-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
test -f /tmp/cp-033-sandbox/internal/reporting/exporter.go; echo "B_EXPORTER_EXISTS=$?" | tee /tmp/cp-033-B-file-exit.txt
for label in "ReportExporter" "CSVExporter" "ErrNotImplemented" "TODO(scaffold): implement CSV writer"; do grep -c "$label" /tmp/cp-033-sandbox/internal/reporting/exporter.go; done | tee /tmp/cp-033-B-source-counts.txt
grep -R -E "os.Create|WriteFile" /tmp/cp-033-sandbox/internal/reporting/exporter.go > /tmp/cp-033-B-overimpl.txt; echo "B_OVERIMPL_GREP=$?" | tee /tmp/cp-033-B-overimpl-exit.txt
git status --porcelain > /tmp/cp-033-post.txt
diff /tmp/cp-033-pre.txt /tmp/cp-033-post.txt > /tmp/cp-033-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-033-tripwire-exit.txt
for label in "Mode: scaffold-new-file" "Verification: PASS" "Exit Code: 0"; do grep -c "$label" /tmp/cp-033-B-code.txt; done | tee /tmp/cp-033-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-033 | Scaffold-new-file mode discrimination | Confirm @code scaffolds only and preserves intentional placeholders | Same task body in §2; Call A wraps with `As @Task:`; Call B prepends `.opencode/agent/code.md` + `Depth: 1` | Run the §3 exact command block | `B_EXPORTER_EXISTS=0`; B source counts all >= 1; `B_OVERIMPL_GREP=1`; `POST_B_GOTEST=0`; B mode fields >= 1; `TRIPWIRE_DIFF_EXIT=0` | `/tmp/cp-033-B-code.txt`, `/tmp/cp-033-B-source-counts.txt`, `/tmp/cp-033-B-overimpl.txt`, `/tmp/cp-033-B-gotest.txt` | PASS if B declares scaffold mode, file compiles, required placeholders exist, prohibited I/O is absent, and tripwire is empty. FAIL otherwise | 1. If B writes full CSV I/O, scaffold mode failed; tighten acceptance around placeholders. 2. If B omits `ErrNotImplemented`, the scaffold is not compile-contract safe. 3. If `go test` fails, inspect package names/imports in `exporter.go`. 4. If B omits `Mode: scaffold-new-file`, mode discrimination is not auditable. 5. If tripwire diff is non-empty, stop and audit project mutation. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/agent/code.md` | Scaffold-new-file mode |
| `.opencode/skill/sk-code/SKILL.md` | Go stack routing and verification |
| `004-code-vs-general-agent-perf-comparison.md` | CP-026 A/B dispatch shape |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-033
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/011-scaffold-new-file-mode-discrimination.md`
- Related scenarios: `CP-026`, `CP-032`
- Sandbox: `/tmp/cp-033-sandbox/` (Go module)
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~3-5 min
