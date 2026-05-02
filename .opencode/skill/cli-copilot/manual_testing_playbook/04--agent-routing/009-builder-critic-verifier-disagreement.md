---
title: "CP-031 -- Builder/Critic/Verifier disagreement discipline **(SANDBOXED)**"
description: "This scenario validates that @code surfaces a real adversarial self-check when the obvious fix has a subtle correctness flaw."
---

# CP-031 -- Builder/Critic/Verifier disagreement discipline **(SANDBOXED)**

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-031`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-031-sandbox/`. The fixture is a Go cache-key bug where the tempting fix omits tenant isolation.

---

## 1. OVERVIEW

This scenario forces a non-fast-path correctness disagreement. The obvious key fix is to include the user and report name, but the test also proves tenant isolation matters. @code's Builder should defend the candidate fix, Critic should challenge tenant collision risk, and Verifier should record the verdict in the Adversarial Summary.

### Why This Matters

CP-026 only checked that @code can emit structured fields. It did not prove the Builder/Critic/Verifier loop catches a plausible but wrong implementation. This case requires a grep-able `Adversarial Summary` with explicit Builder defense, Critic challenge, and Verifier verdict.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-031` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Call B (@code) includes `Adversarial Summary`, `Builder Defense`, `Critic Challenge`, and `Verifier Verdict` while passing `go test ./...`.
- Real user request: `Compare @Task and @code on a cache-key bug where the first plausible fix misses tenant isolation.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-031-TASK-001.
  In /tmp/cp-031-sandbox/, fix CacheKey in key.go so report cache keys do not collide.
  Stay strictly inside /tmp/cp-031-sandbox/. Run `go test ./...` after the fix.
  Files in scope: key.go.
  Acceptance: same report name in different tenants must produce different keys; same tenant/user/report remains stable. This is non-fast-path work: include an Adversarial Summary if your role defines Builder/Critic/Verifier.
  Return a structured summary (RETURN format if your role defines one).
  ```

- Expected execution process: seed Go module; copy baseline; run Call A; reset; run Call B; verify B transcript fields and post-B `go test`.
- Expected signals:
  - **Call A (@general)**: May claim done without an explicit adversarial disagreement section.
  - **Call B (@code)**: Transcript contains `RETURN: PASS` or `RETURN: DONE`, `Mode: surgical-fix`, `Verification: PASS`, `Exit Code: 0`, `Adversarial Summary`, `Builder Defense`, `Critic Challenge`, and `Verifier Verdict`. Post-B `go test ./...` exits 0. Tripwire diff outside sandbox is empty.
- Desired user-visible outcome: PASS verdict with a short table showing A lacks the adversarial fields and B includes them.
- Pass/fail: PASS if B tests pass and all four adversarial labels are present. FAIL if B omits the adversarial section, misses tenant isolation, or claims success without verification.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Seed the Go cache-key fixture and baseline.
2. Dispatch A with the same prompt.
3. Reset to baseline.
4. Dispatch B with @code definition and `Depth: 1`.
5. Run independent post-B `go test` and grep adversarial labels.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-031-sandbox /tmp/cp-031-sandbox-baseline
mkdir -p /tmp/cp-031-sandbox
cat > /tmp/cp-031-sandbox/go.mod <<'EOF'
module cp031

go 1.22
EOF
cat > /tmp/cp-031-sandbox/key.go <<'EOF'
package cp031

func CacheKey(tenantID, userID, reportName string) string {
	return userID + ":" + reportName
}
EOF
cat > /tmp/cp-031-sandbox/key_test.go <<'EOF'
package cp031

import "testing"

func TestCacheKeySeparatesTenants(t *testing.T) {
	a := CacheKey("tenant-a", "user-1", "sales")
	b := CacheKey("tenant-b", "user-1", "sales")
	if a == b {
		t.Fatalf("cache key collided across tenants: %q", a)
	}
}

func TestCacheKeyStableForSameInputs(t *testing.T) {
	a := CacheKey("tenant-a", "user-1", "sales")
	b := CacheKey("tenant-a", "user-1", "sales")
	if a != b {
		t.Fatalf("cache key not stable: %q != %q", a, b)
	}
}
EOF
cp -a /tmp/cp-031-sandbox /tmp/cp-031-sandbox-baseline
git status --porcelain > /tmp/cp-031-pre.txt
cat > /tmp/cp-031-task.txt <<'EOF'
Task ID: CP-031-TASK-001.
In /tmp/cp-031-sandbox/, fix CacheKey in key.go so report cache keys do not collide.
Stay strictly inside /tmp/cp-031-sandbox/. Run `go test ./...` after the fix.
Files in scope: key.go.
Acceptance: same report name in different tenants must produce different keys; same tenant/user/report remains stable. This is non-fast-path work: include an Adversarial Summary if your role defines Builder/Critic/Verifier.
Return a structured summary (RETURN format if your role defines one).
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-031-task.txt)" > /tmp/cp-031-prompt-A.txt
{ printf 'You are operating as @code, defined by the agent file below. Treat its frontmatter and body as authoritative.\n\n'; cat .opencode/agent/code.md; printf '\n---\n\nDepth: 1\n\nDispatch task:\n'; cat /tmp/cp-031-task.txt; } > /tmp/cp-031-prompt-B.txt
copilot -p "$(cat /tmp/cp-031-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-031-sandbox 2>&1 | tee /tmp/cp-031-A-general.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-031-A-exit.txt
rm -rf /tmp/cp-031-sandbox && cp -a /tmp/cp-031-sandbox-baseline /tmp/cp-031-sandbox
copilot -p "$(cat /tmp/cp-031-prompt-B.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-031-sandbox 2>&1 | tee /tmp/cp-031-B-code.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-031-B-exit.txt
cd /tmp/cp-031-sandbox && go test ./... 2>&1 | tee /tmp/cp-031-B-gotest.txt; echo "POST_B_GOTEST=${PIPESTATUS[0]}" | tee /tmp/cp-031-B-gotest-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git status --porcelain > /tmp/cp-031-post.txt
diff /tmp/cp-031-pre.txt /tmp/cp-031-post.txt > /tmp/cp-031-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-031-tripwire-exit.txt
for label in "Adversarial Summary" "Builder Defense" "Critic Challenge" "Verifier Verdict" "Verification: PASS" "Exit Code: 0"; do grep -c "$label" /tmp/cp-031-B-code.txt; done | tee /tmp/cp-031-B-field-counts.txt
for label in "Adversarial Summary" "Builder Defense" "Critic Challenge" "Verifier Verdict"; do grep -c "$label" /tmp/cp-031-A-general.txt; done | tee /tmp/cp-031-A-adversarial-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-031 | Builder/Critic/Verifier disagreement discipline | Confirm @code surfaces explicit adversarial self-check on subtle correctness risk | Same task body in §2; Call A wraps with `As @Task:`; Call B prepends `.opencode/agent/code.md` + `Depth: 1` | Run the §3 exact command block | `POST_B_GOTEST=0`; B adversarial labels all >= 1; `TRIPWIRE_DIFF_EXIT=0`; A adversarial labels expected 0 | `/tmp/cp-031-B-code.txt`, `/tmp/cp-031-B-field-counts.txt`, `/tmp/cp-031-B-gotest.txt`, `/tmp/cp-031-A-adversarial-counts.txt` | PASS if B includes all adversarial labels and tests pass. FAIL if B omits disagreement fields, tests fail, or tripwire mutates | 1. If B passes tests but omits adversarial labels, @code skipped non-fast-path self-check. 2. If B includes labels without tenant-specific reasoning, Critic was cosmetic; tighten prompt or agent contract. 3. If B tests fail, inspect whether it omitted tenant from the key. 4. If A includes the same labels, the A prompt likely saw the @code definition; isolate sessions. 5. If tripwire diff is non-empty, stop and audit project mutation. |

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
| `.opencode/agent/code.md` | Builder/Critic/Verifier adversarial self-check |
| `.opencode/skill/sk-code/SKILL.md` | Go stack routing and verification |
| `004-code-vs-general-agent-perf-comparison.md` | CP-026 A/B dispatch shape |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-031
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/009-builder-critic-verifier-disagreement.md`
- Related scenarios: `CP-026`, `CP-028`
- Sandbox: `/tmp/cp-031-sandbox/` (Go module)
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~3-5 min
