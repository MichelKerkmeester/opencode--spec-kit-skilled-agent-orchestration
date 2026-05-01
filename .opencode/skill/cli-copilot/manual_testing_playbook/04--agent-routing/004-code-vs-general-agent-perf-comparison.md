---
title: "CP-026 -- @code vs @general dispatch performance comparison **(SANDBOXED)**"
description: "This scenario validates the new @code agent's value-add over the built-in @general / @Task agent for `CP-026`. It dispatches the SAME implementation task twice through the Copilot orchestrator — once via @general (built-in default), once via @code (custom agent file loaded with `Depth: 1` marker) — and measures the differential against @code's §5 acceptance rubric (Correctness / Scope-Adherence / Verification-Evidence / Stack-Pattern-Compliance / Integration)."
---

# CP-026 -- @code vs @general dispatch performance comparison **(SANDBOXED)**

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-026`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-026-sandbox/`. Sk-code-supported stack seeded via `go.mod` so both agents can detect Go and run `go test` as verification.

---

## 1. OVERVIEW

This scenario validates the design value of the new `@code` agent (shipped in commit `12f4d9f2cc`, packet `059-agent-implement-code`) by running the SAME bug-fix task twice through Copilot's orchestrator and comparing the structured outputs. Call A uses the built-in `@Task` / `@general` implementation default. Call B loads `.opencode/agent/code.md` into the dispatch prompt with the `Depth: 1` marker required by §0 DISPATCH GATE.

### Why This Matters

The `@code` agent file is 522 lines of structured discipline (7 dispatch modes, 5-dim acceptance rubric, Builder/Critic/Verifier adversarial self-check, fail-closed verify, structured RETURN contract with 8 required fields, BLOCKED-count circuit breaker). The built-in `@general` / `@Task` agent has none of that — it just implements. If `@code` produces no measurable difference vs `@general` on a real task, the 522-line agent file is dead weight and should be retired or trimmed. If `@code` produces a structured RETURN, captures verification command + exit code, runs Builder/Critic/Verifier, and stays inside scope where `@general` drifts, the agent earns its line count.

This scenario is the cheapest objective check of that differential. It is NOT a benchmark of speed or token cost — it is a structural-quality comparison.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-026` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Call B (@code) returns a structured RETURN block conforming to `code.md` §8 RETURN Contract (compact first line + 8 required fields), AND Call A (@general) returns free-form narration without the same structure, AND BOTH calls produce a working fix (`go test` exits 0 after each).
- Real user request: `Run the same Go bug-fix task twice — once with Copilot's default @Task agent, once with our @code agent — and compare what came back.`
- RCAF Prompt (per call, see Test Execution for the dispatch wrappers):

  Same task body for both calls:
  ```
  In /tmp/cp-026-sandbox/, palindrome.go has an off-by-one bug in IsPalindrome that
  makes "racecar" return false. Fix the bug so palindrome_test.go passes.
  Stay strictly inside /tmp/cp-026-sandbox/. Run `go test ./...` after the fix.
  Files in scope: palindrome.go.
  Acceptance: all 4 test cases in palindrome_test.go pass; no other files modified.
  Return a structured summary (RETURN format if your role defines one).
  ```

- Expected execution process: orchestrator (Copilot) seeds the sandbox with a buggy Go module; dispatches Call A as `As @Task: <task body>` (built-in default); captures output; resets the sandbox to the buggy state; dispatches Call B as `As @code: <task body>` with `Depth: 1` orchestrator marker AND the agent definition file content prepended; captures output; runs `go test` independently after each call to confirm both fixes work; greps each transcript for the 8 required RETURN fields.
- Expected signals:
  - **Call A (@general)**: `EXIT_A=0`. After Call A, `cd /tmp/cp-026-sandbox && go test ./...` exits 0. Transcript is free-form narration; grep for `RETURN: PASS|FAIL|BLOCKED` finds 0 matches (built-in agent has no structured RETURN contract). Tripwire diff outside sandbox empty.
  - **Call B (@code)**: `EXIT_B=0`. After Call B, `cd /tmp/cp-026-sandbox && go test ./...` exits 0. Transcript contains: `RETURN: PASS` (or `DONE`), `Mode:`, `Files:`, `Verification: PASS`, `Command:` (with `go test` text), `Exit Code: 0`, `Rubric Score:` (numeric or breakdown), `Confidence:` (HIGH / MEDIUM / LOW), `Escalation: NONE`. Grep for these 8 field labels finds at least 7 matches. Tripwire diff outside sandbox empty.
- Desired user-visible outcome: PASS verdict + a side-by-side comparison table:
  ```
  | Field            | Call A (@general) | Call B (@code) |
  |------------------|-------------------|----------------|
  | go test exit     | 0                 | 0              |
  | RETURN: line     | absent            | present        |
  | Mode declared    | absent            | present        |
  | Command captured | absent            | present        |
  | Exit code in body| absent            | present        |
  | Confidence       | absent            | present        |
  | Rubric score     | absent            | present        |
  | Files outside    | 0                 | 0              |
  ```
  Plus the actual `go test` outputs from both runs.
- Pass/fail: PASS if `EXIT_A=0` AND `EXIT_B=0` AND post-A `go test` exits 0 AND post-B `go test` exits 0 AND Call B transcript matches >= 7 of the 8 required RETURN fields AND Call A transcript matches <= 2 of those fields (free-form expected) AND tripwire diff outside sandbox is empty for both calls. FAIL if either call errors, either fix is incomplete (`go test` non-zero), `@code` does not produce a structured RETURN (regressing on §8 contract), `@general` accidentally produces an identical structured RETURN (suggests prompt contamination), or either call writes outside the sandbox.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "prove @code produces structured, scoped, verified output that @general does not, on an identical task".
2. Stay local: this is two direct Copilot CLI dispatches in the same operator session. No third-party CLI.
3. Always sandbox under `/tmp/cp-026-sandbox/`. Reset the sandbox between Call A and Call B so each agent starts from the same buggy baseline.
4. The buggy Go fixture is deterministic — same content every reset (see Step 1 of the command sequence).
5. Capture pre-call tripwires before each dispatch and verify outside-sandbox diff is empty after each.
6. Surface the side-by-side field-presence table in the verdict so the operator sees the structural-quality differential at a glance.
7. Do NOT auto-compare the natural-language quality of the two narrations — only the structural fields. Field presence is objective; narration quality is not.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-026 | @code vs @general dispatch performance comparison | Confirm Call B (@code) returns structured RETURN with >= 7 of 8 required fields AND Call A (@general) returns free-form narration AND both fixes produce `go test` exit 0 in the sandbox | Same task body for both calls (see §2 RCAF Prompt block); Call A wraps with `As @Task: ...`; Call B prepends `.opencode/agent/code.md` content + `Depth: 1` marker before the task body | 1. `bash: rm -rf /tmp/cp-026-sandbox && mkdir -p /tmp/cp-026-sandbox && cd /tmp/cp-026-sandbox && cat > go.mod <<'EOF'\nmodule cp026\n\ngo 1.22\nEOF\ncat > palindrome.go <<'EOF'\npackage cp026\n\nfunc IsPalindrome(s string) bool {\n  for i := 0; i < len(s)-2; i++ {\n    if s[i] != s[len(s)-1-i] {\n      return false\n    }\n  }\n  return true\n}\nEOF\ncat > palindrome_test.go <<'EOF'\npackage cp026\n\nimport \"testing\"\n\nfunc TestIsPalindrome(t *testing.T) {\n  cases := []struct{ in string; want bool }{\n    {\"racecar\", true},\n    {\"hello\", false},\n    {\"a\", true},\n    {\"\", true},\n  }\n  for _, c := range cases {\n    if got := IsPalindrome(c.in); got != c.want {\n      t.Errorf(\"IsPalindrome(%q) = %v, want %v\", c.in, got, c.want)\n    }\n  }\n}\nEOF\ncp -r /tmp/cp-026-sandbox /tmp/cp-026-sandbox-baseline && git status --porcelain > /tmp/cp-026-pre.txt` -> 2. `bash: copilot -p "As @Task: In /tmp/cp-026-sandbox/, palindrome.go has an off-by-one bug in IsPalindrome that makes \"racecar\" return false. Fix the bug so palindrome_test.go passes. Stay strictly inside /tmp/cp-026-sandbox/. Run \`go test ./...\` after the fix. Files in scope: palindrome.go. Acceptance: all 4 test cases in palindrome_test.go pass; no other files modified. Return a structured summary (RETURN format if your role defines one)." --allow-all-tools --no-ask-user 2>&1 \| tee /tmp/cp-026-A-general.txt; echo EXIT_A=$?` -> 3. `bash: cd /tmp/cp-026-sandbox && go test ./... 2>&1 \| tee /tmp/cp-026-A-gotest.txt; echo POST_A_GOTEST=$?` -> 4. `bash: rm -rf /tmp/cp-026-sandbox && cp -r /tmp/cp-026-sandbox-baseline /tmp/cp-026-sandbox` -> 5. `bash: AGENT_DEF=$(cat .opencode/agent/code.md); copilot -p "You are operating as @code, defined by the agent file below. Treat its frontmatter and body as authoritative.\n\n${AGENT_DEF}\n\n---\n\nDepth: 1\n\nDispatch task:\nIn /tmp/cp-026-sandbox/, palindrome.go has an off-by-one bug in IsPalindrome that makes \"racecar\" return false. Fix the bug so palindrome_test.go passes. Stay strictly inside /tmp/cp-026-sandbox/. Run \`go test ./...\` after the fix. Files in scope: palindrome.go. Acceptance: all 4 test cases in palindrome_test.go pass; no other files modified. Mode: surgical-fix. Return your structured RETURN block per §8 RETURN Contract." --allow-all-tools --no-ask-user 2>&1 \| tee /tmp/cp-026-B-code.txt; echo EXIT_B=$?` -> 6. `bash: cd /tmp/cp-026-sandbox && go test ./... 2>&1 \| tee /tmp/cp-026-B-gotest.txt; echo POST_B_GOTEST=$?` -> 7. `bash: git status --porcelain > /tmp/cp-026-post.txt && diff /tmp/cp-026-pre.txt /tmp/cp-026-post.txt; echo TRIPWIRE_DIFF_EXIT=$?` -> 8. `bash: for label in "RETURN:" "Mode:" "Files:" "Verification:" "Command:" "Exit Code:" "Rubric Score:" "Confidence:" "Escalation:"; do A=$(grep -c "$label" /tmp/cp-026-A-general.txt); B=$(grep -c "$label" /tmp/cp-026-B-code.txt); echo "$label A=$A B=$B"; done` | Step 1: sandbox seeded with go.mod, buggy palindrome.go, palindrome_test.go, baseline copied, pre-tripwire captured; Step 2: `EXIT_A=0`; Step 3: `POST_A_GOTEST=0` (Call A produced a working fix); Step 4: sandbox reset to buggy baseline; Step 5: `EXIT_B=0`, transcript contains the structured RETURN block; Step 6: `POST_B_GOTEST=0` (Call B produced a working fix); Step 7: `TRIPWIRE_DIFF_EXIT=0` (no out-of-sandbox writes); Step 8: per-label table shows `B=>=1` for at least 7 of the 8 fields, `A=0` for at least 6 of those 8 fields | `/tmp/cp-026-A-general.txt`, `/tmp/cp-026-B-code.txt` (transcripts), `/tmp/cp-026-A-gotest.txt`, `/tmp/cp-026-B-gotest.txt` (verification outputs), `/tmp/cp-026-pre.txt`, `/tmp/cp-026-post.txt` (tripwire pair), Step 8 per-label A/B counts | PASS if `EXIT_A=0` AND `EXIT_B=0` AND `POST_A_GOTEST=0` AND `POST_B_GOTEST=0` AND `TRIPWIRE_DIFF_EXIT=0` AND Step 8 shows >= 7 fields with `B>=1` AND Step 8 shows >= 6 fields with `A=0`; FAIL if either call errors, either fix is incomplete (post-call go test non-zero), tripwire is non-empty (out-of-sandbox writes), Call B is missing > 1 required RETURN field, or Call A accidentally produces a structured RETURN identical to Call B's (suggests prompt contamination — the test cannot tell the agents apart) | 1. If `POST_A_GOTEST` non-zero, Call A failed to fully fix the bug — Copilot's @Task agent may have edited the wrong line; check `/tmp/cp-026-A-general.txt` for evidence and consider whether the bug fixture is too subtle; 2. If `POST_B_GOTEST` non-zero AND Call B's RETURN says PASS, that's an Iron Law violation — @code claimed completion without fresh verification evidence; halt and file an issue against @code; 3. If Call B's RETURN block is missing > 1 required field, the agent definition may not have been included properly in the dispatch prompt — check that `${AGENT_DEF}` was non-empty in Step 5; 4. If Call A produces a structured RETURN identical to Call B's, Copilot's `@Task` may have read the @code definition from `.opencode/agent/` even though the prompt didn't load it (auto-discovery) — this voids the comparison; consider isolating Call A's session or using a different built-in agent prefix; 5. If tripwire diff non-empty, one of the agents wrote outside the sandbox; this is a SCOPE_CONFLICT-class defect for @code (should escalate, not write) and a discipline failure for @general |

### Optional Supplemental Checks

After PASS, capture a 1-2 line snippet from each transcript showing the contrast:

```
Call A (@general) snippet (free-form narration):
  Fixed the off-by-one bug. Tests now pass.

Call B (@code) snippet (structured RETURN):
  RETURN: PASS | escalation=NONE | confidence=HIGH

  ## Code Implementation Result
  **Mode:** surgical-fix
  **Files:** palindrome.go
  **Verification:** PASS
  **Command:** `go test ./...`
  **Exit Code:** 0
  ...
```

This contrast pair is the user-facing artifact — it makes the structural-quality differential visible without forcing the operator to read the full transcripts.

For deeper qualitative comparison, ask Copilot itself to score both narrations against `code.md` §5 Coder Acceptance Rubric (5 dimensions × 100 pts) and surface the score gap. This is informational only — not a pass/fail condition for `CP-026`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 Copilot CLI Agent Delegation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/agent/code.md` | Canonical @code agent file (522 lines); §8 RETURN Contract is the structural-quality reference |
| `.opencode/agent/orchestrate.md` | §2 routing-table row 6 = @code (replaces former @general row); §2 NDP Depth: 1 marker required by §0 dispatch gate |
| `specs/skilled-agent-orchestration/059-agent-implement-code/decision-record.md` | ADR-3 (D3) caller-restriction convention-floor + ADR-5 (D5) fail-closed verify rationale |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/synthesis.md` | Cross-stream synthesis explaining Builder/Critic/Verifier vs Hunter/Skeptic/Referee axis distinction |
| `../../references/agent_delegation.md` | §3 Copilot CLI Agent Catalog — `@Task` (built-in implementation) baseline |
| `004--agent-routing/002-task-agent-sandboxed-implementation.md` | CP-011 — sibling test for `@Task` alone (no comparison); referenced for sandbox+tripwire pattern |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/004-code-vs-general-agent-perf-comparison.md`
- Related scenarios: `CP-011` (`@Task` baseline alone), `CP-010` (`@Explore` read-only baseline)
- Sandbox: `/tmp/cp-026-sandbox/` (Go module — sk-code-supported via `go.mod`)
- Concurrency: Single-operator-session (sequential A then B, NOT parallel — sandbox reset between calls)
- Wall-time estimate: ~3-5 min total (2 Copilot calls + 2 `go test` runs + tripwire + grep)
- Pass-bar adjustment: Field-presence threshold (7 of 8 for B; 0-2 of 8 for A) is intentionally generous on B and strict on A. If the threshold proves wrong on the first real run, document the calibration in this scenario's failure-triage section rather than silently widening it.
