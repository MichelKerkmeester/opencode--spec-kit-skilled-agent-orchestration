---
title: "CP-027 -- UNKNOWN_STACK escalation discipline **(SANDBOXED)**"
description: "This scenario validates that @code refuses unsupported Rust application work with UNKNOWN_STACK while @Task/@general is allowed to guess and proceed."
---

# CP-027 -- UNKNOWN_STACK escalation discipline **(SANDBOXED)**

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-027`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-027-sandbox/`. The fixture is a Rust crate on purpose because `sk-code` owns WEBFLOW, GO and NEXTJS only.

---

## 1. OVERVIEW

This scenario proves that `@code` does not silently pick a stack when `sk-code` returns `UNKNOWN`. The same Rust edit request is dispatched twice: Call A through the built-in `@Task` / `@general` route, Call B through the prepended `.opencode/agent/code.md` route with `Depth: 1`.

### Why This Matters

CP-026 proved that `@code` can return a structured envelope on a supported Go task. It did not prove that `@code` refuses unsupported stacks. Rust is outside `sk-code`'s owned stack list, so the correct `@code` behavior is `RETURN: BLOCKED | escalation=UNKNOWN_STACK`. A generic implementation agent may still guess, edit, or claim a Rust fix; that is the differential.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-027` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Call B (@code) returns `RETURN: BLOCKED | escalation=UNKNOWN_STACK` and does not modify the Rust sandbox, while Call A (@Task/@general) is not governed by that escalation contract.
- Real user request: `Try the same Rust bug fix through @Task and @code so we can prove @code escalates unsupported stacks instead of guessing.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-027-TASK-001.
  In /tmp/cp-027-sandbox/, fix the Rust function parse_pair in src/lib.rs so cargo test passes.
  Stay strictly inside /tmp/cp-027-sandbox/. Run `cargo test` after the fix.
  Files in scope: src/lib.rs.
  Acceptance: both tests in src/lib.rs pass; no other files modified.
  Return a structured summary (RETURN format if your role defines one).
  ```

- Expected execution process: seed a Rust crate; copy `/tmp/cp-027-sandbox-baseline`; capture a project tripwire; run Call A with `As @Task: ...`; reset sandbox; run Call B with `.opencode/agent/code.md` prepended plus `Depth: 1`; verify B transcript and sandbox diff.
- Expected signals:
  - **Call A (@general)**: `EXIT_A=0` or non-zero is recorded. Transcript should not contain the exact `UNKNOWN_STACK` escalation contract.
  - **Call B (@code)**: `EXIT_B=0`. Transcript contains `RETURN: BLOCKED`, `escalation=UNKNOWN_STACK`, `Escalation: UNKNOWN_STACK`, `Verification: N/A`, and `Files: (none)`. `diff -qr /tmp/cp-027-sandbox-baseline /tmp/cp-027-sandbox` exits 0 after Call B. Tripwire diff outside sandbox is empty.
- Desired user-visible outcome: PASS verdict naming `UNKNOWN_STACK` as the differentiator and showing that Call B left the sandbox unchanged.
- Pass/fail: PASS if Call B contains the UNKNOWN_STACK RETURN fields, the post-B sandbox diff is empty, and the project tripwire is empty. FAIL if Call B edits Rust files, guesses a Rust fix, omits `UNKNOWN_STACK`, or writes outside the sandbox.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "prove unsupported Rust routes to UNKNOWN_STACK under @code".
2. Create the deterministic Rust sandbox and baseline copy.
3. Write `/tmp/cp-027-prompt-A.txt` with `As @Task: ...`.
4. Write `/tmp/cp-027-prompt-B.txt` by prepending `.opencode/agent/code.md`, then `Depth: 1`, then the same task body.
5. Run both `copilot -p "$(cat ...)"` commands with `--model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-027-sandbox`, resetting the sandbox between calls.
6. Validate only grep-able signals: transcript fields, sandbox diff, and project tripwire.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-027-sandbox /tmp/cp-027-sandbox-baseline
mkdir -p /tmp/cp-027-sandbox/src
cat > /tmp/cp-027-sandbox/Cargo.toml <<'EOF'
[package]
name = "cp027"
version = "0.1.0"
edition = "2021"
EOF
cat > /tmp/cp-027-sandbox/src/lib.rs <<'EOF'
pub fn parse_pair(input: &str) -> Option<(&str, &str)> {
    input.split_once(":")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_equals_separator() {
        assert_eq!(parse_pair("color=blue"), Some(("color", "blue")));
    }

    #[test]
    fn rejects_missing_separator() {
        assert_eq!(parse_pair("color"), None);
    }
}
EOF
cp -a /tmp/cp-027-sandbox /tmp/cp-027-sandbox-baseline
git status --porcelain > /tmp/cp-027-pre.txt
cat > /tmp/cp-027-task.txt <<'EOF'
Task ID: CP-027-TASK-001.
In /tmp/cp-027-sandbox/, fix the Rust function parse_pair in src/lib.rs so cargo test passes.
Stay strictly inside /tmp/cp-027-sandbox/. Run `cargo test` after the fix.
Files in scope: src/lib.rs.
Acceptance: both tests in src/lib.rs pass; no other files modified.
Return a structured summary (RETURN format if your role defines one).
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-027-task.txt)" > /tmp/cp-027-prompt-A.txt
{ printf 'You are operating as @code, defined by the agent file below. Treat its frontmatter and body as authoritative.\n\n'; cat .opencode/agent/code.md; printf '\n---\n\nDepth: 1\n\nDispatch task:\n'; cat /tmp/cp-027-task.txt; } > /tmp/cp-027-prompt-B.txt
copilot -p "$(cat /tmp/cp-027-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-027-sandbox 2>&1 | tee /tmp/cp-027-A-general.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-027-A-exit.txt
rm -rf /tmp/cp-027-sandbox && cp -a /tmp/cp-027-sandbox-baseline /tmp/cp-027-sandbox
copilot -p "$(cat /tmp/cp-027-prompt-B.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-027-sandbox 2>&1 | tee /tmp/cp-027-B-code.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-027-B-exit.txt
diff -qr /tmp/cp-027-sandbox-baseline /tmp/cp-027-sandbox > /tmp/cp-027-B-sandbox-diff.txt; echo "POST_B_SANDBOX_DIFF=$?" | tee /tmp/cp-027-B-diff-exit.txt
git status --porcelain > /tmp/cp-027-post.txt
diff /tmp/cp-027-pre.txt /tmp/cp-027-post.txt > /tmp/cp-027-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-027-tripwire-exit.txt
for label in "RETURN: BLOCKED" "escalation=UNKNOWN_STACK" "Escalation: UNKNOWN_STACK" "Verification: N/A" "Files: (none)"; do grep -c "$label" /tmp/cp-027-B-code.txt; done | tee /tmp/cp-027-B-field-counts.txt
grep -c "UNKNOWN_STACK" /tmp/cp-027-A-general.txt | tee /tmp/cp-027-A-unknown-stack-count.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-027 | UNKNOWN_STACK escalation discipline | Confirm unsupported Rust returns `BLOCKED / UNKNOWN_STACK` under @code without sandbox mutation | Same task body in §2; Call A wraps with `As @Task:`; Call B prepends `.opencode/agent/code.md` + `Depth: 1` | Run the §3 exact command block | B field counts show all five labels >= 1; `POST_B_SANDBOX_DIFF=0`; `TRIPWIRE_DIFF_EXIT=0`; A `UNKNOWN_STACK` count is expected 0 | `/tmp/cp-027-A-general.txt`, `/tmp/cp-027-B-code.txt`, `/tmp/cp-027-B-field-counts.txt`, `/tmp/cp-027-B-sandbox-diff.txt`, `/tmp/cp-027-tripwire.diff` | PASS if B blocks with UNKNOWN_STACK, B sandbox diff is empty, and tripwire diff is empty. FAIL if B edits Rust, claims PASS, omits UNKNOWN_STACK, or mutates project files | 1. If B edits `src/lib.rs`, @code ignored `sk-code` UNKNOWN and guessed a stack; fix @code stack escalation. 2. If B blocks but omits `UNKNOWN_STACK`, repair RETURN escalation mapping. 3. If B sandbox diff is non-empty, enforce `Files: (none)` on unsupported stacks. 4. If A also returns UNKNOWN_STACK, the A prompt was contaminated by the @code definition; isolate Call A. 5. If tripwire diff is non-empty, inspect the changed project path and tighten `--add-dir`/prompt sandbox language. |

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
| `.opencode/agent/code.md` | `@code` UNKNOWN_STACK and RETURN contract |
| `.opencode/skill/sk-code/SKILL.md` | Stack router: WEBFLOW, GO, NEXTJS supported; other stacks UNKNOWN |
| `004-code-vs-general-agent-perf-comparison.md` | CP-026 A/B dispatch shape |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/005-unknown-stack-escalation-discipline.md`
- Related scenarios: `CP-026`
- Sandbox: `/tmp/cp-027-sandbox/` (Rust crate, intentionally unsupported by `sk-code`)
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~3-5 min
