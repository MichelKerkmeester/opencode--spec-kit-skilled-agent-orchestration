# Halt Reason

- Timestamp: 2026-04-20T17:52:15.856Z
- Cause: 3 consecutive iteration failures (stuckRecovery)
- Proposed recovery: Inspect /tmp/027-review-iter-*-output.txt for Copilot/auth/tool errors, repair the executor issue, then resume from the same packet.

The loop halted rather than papering over the failure.
