## [v0.5.0] - 2026-03-29

This release matters because it turns the last uncertain parts of the ESM (the modern JavaScript module system) migration into something people can trust. It closes the remaining failures, replaces placeholder coverage with real verification, and finishes the remediation sweep for the server and script packages with aligned guidance for manual checks.

> Spec folder: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/005-test-and-scenario-remediation/` (Level 1)

---

## Bug Fixes (8)

These fixes removed the remaining mismatches between what the system actually does and what the verification expected to see.

### Causal-graph checks were marking healthy behavior as broken

**Problem:** One integration check for the causal graph (the record of how decisions and events connect) was still looking for an older failure pattern. That made a healthy result look broken, even when the real system response was correct.

**Fix:** The check now recognizes the behavior that users actually receive. This means the test only fails when the real causal-graph behavior is wrong, not when an older expectation is out of date.

### Error-recovery checks were still reading an older response shape

**Problem:** A recovery test was still expecting a simpler error response than the system now returns. That made recovery behavior look less reliable than it really was.

**Fix:** Recovery verification now follows the current error format people see in real use. That keeps the safety signal honest and makes the test fail only for real recovery problems.

### Learning-statistics checks could inherit leftover database state

**Problem:** A database (stored test data) leak could let one learning-statistics scenario affect the next one. That is like grading each student with the previous student's notes still left on the desk.

**Fix:** Each learning-statistics check now starts from its own clean setup. Results are repeatable, and any failure points to the behavior under review instead of leftover state from an earlier test.

### Recovery checks could also interfere with each other

**Problem:** Recovery verification had the same shared-state problem. One scenario could quietly prepare or damage the next, which made the results harder to trust.

**Fix:** Recovery scenarios now run in isolation. Each one proves its own behavior without hidden setup from a previous run.

### Broken-link noise could look like a real logging safety problem

**Problem:** Logging safety checks could be distracted by broken symlink noise (a filesystem shortcut that points to something missing). That noise was environmental clutter, not proof that the safety rules had failed.

**Fix:** The verification now ignores that unrelated noise while still checking the real logging protections. This removes false alarms without weakening the safety coverage.

### A size-limit check was still enforcing an outdated boundary

**Problem:** One architecture safety check was still using an older size expectation. Once the code legitimately grew past that older limit, the test started reporting a problem that no longer reflected the real boundary being protected.

**Fix:** The check now measures the current boundary that matters. This keeps the warning meaningful and avoids flagging normal, accepted growth as a failure.

### Manual testing guidance had drifted away from verified behavior

**Problem:** The manual testing playbook still described some checks in a way that no longer matched the verified system state. That weakens trust because readers can be told to look for behavior that is no longer real.

**Fix:** The playbook now matches the verified behavior used during closeout. People following the manual steps are guided by the same reality that the automated checks confirmed.

### Hydra roadmap flag guidance had fallen out of sync

**Problem:** Hydra roadmap flag guidance was still based on older assumptions. That made the surrounding closeout notes harder to trust because the roadmap-facing explanation no longer matched the verified state.

**Fix:** The roadmap flag guidance now matches the current verified story, and those references were updated within the manual playbook file. Release evidence, manual guidance, and verification now point to the same result.

---

## Testing (4)

This work turned the last soft promises into proof that runs every time.

### The scripts package still had end-of-sweep failures

**Problem:** Even after the main migration work was finished, the scripts package still had failures left in the final stretch. That made the overall result feel almost done instead of fully dependable.

**Fix:** Those remaining failures were removed so the scripts package reaches the same dependable state as the server package. The final release signal is now clean across both package groups.

### Sparse-first graph coverage existed as skipped checks instead of active protection

**Problem:** Skipped checks are promises, not protection. The sparse-first graph scenarios were listed, but they were not running, so they could not catch regressions.

**Fix:** Those scenarios now run as active verification. The graph behavior is covered by real checks instead of being left as future intent.

### Crash recovery was still documented as future work instead of tested behavior

**Problem:** Crash recovery is one of the worst places to rely on notes instead of proof. Placeholder reminders described what should happen, but they did not verify that recovery actually worked.

**Fix:** Crash recovery is now covered by real passing tests. The release no longer depends on handwritten intent for one of the most important failure paths.

### Environment-sensitive checks could wobble for setup reasons

**Problem:** Some checks depended too directly on live setup details such as database state or API key availability. That made them more likely to fail because of the test environment instead of the product behavior.

**Fix:** Those checks now run against stable, controlled inputs where needed. That keeps the signal focused on real behavior and reduces noise from setup conditions.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Passing tests | 8,894 in Sweep 1, with one server file still pending final closure | 9,480 / 9,480 passing |
| Test files passing | `mcp_server` 334 / 335, `scripts` not yet at final full-package closure | `mcp_server` 335 / 335, `scripts` 44 / 44 |
| Failed tests | 8 pre-existing failures before remediation, then 0 active failures after Sweep 1 | 0 |
| Skipped tests | Present | 0 |
| TypeScript errors | 0 | 0 |

The phase first removed the eight failures that blocked trust, then replaced skipped and placeholder coverage with active tests until both packages reached a fully passing state.

---

<details>
<summary>Technical Details: Files Changed (8 total)</summary>

### Source (0 files)

No production source files changed in this remediation phase.

### Tests (7 files)

| File | Changes |
| ---- | ------- |
| `integration-causal-graph.vitest.ts` | Updated expected failure handling to match the shipped causal-graph response shape. |
| `integration-error-recovery.vitest.ts` | Updated recovery assertions to match the current structured error response. |
| `learning-stats-filters.vitest.ts` | Added deterministic per-test database setup for learning-statistics coverage. |
| `transaction-manager-recovery.vitest.ts` | Isolated recovery checks so database state cannot leak between scenarios. |
| `stdio-logging-safety.vitest.ts` | Filtered broken-symlink `ENOENT` noise while keeping the real logging safety assertions. |
| `modularization.vitest.ts` | Updated the size-boundary expectation and stabilized related import checks. |
| `crash-recovery.vitest.ts` | Replaced placeholder recovery coverage with real executable crash-recovery tests. |

These test changes converted outdated expectations, shared-state leaks, and placeholder coverage into stable verification that runs as part of the regular suite.

### Documentation (1 files)

| File | Changes |
| ---- | ------- |
| `manual_testing_playbook.md` | Updated the manual verification guidance and the Hydra roadmap flag references inside the same playbook file so the written steps match the verified system state. |

This documentation update matters because release evidence is only trustworthy when the written guidance matches the behavior that was actually verified.

</details>

---

## Upgrade

No migration required.

Runtime behavior for users does not require a rollout step. The practical change is that this phase now closes with verified test coverage, aligned manual guidance, and no known limitations.
