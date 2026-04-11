## Session Context
- **Spec Folder:** 041-sk-improve-agent-loop/002-sk-improve-agent-full-skill
- **Current Task:** urgent validation check
- **Blockers:** none

## System Health
- **Code Graph:** ready
- **Session Quality:** warning (score: 0.74)

## Recommended Next Steps
1. User marked this as urgent, so keep bootstrap light and read-only.
2. If needed, use `session_bootstrap` or `session_health`.
3. Avoid mutation and keep the response read-only.

The session remains READ-ONLY and urgent. Prefer `session_bootstrap` for quick recovery status and use `session_health` only when a lighter follow-up check is enough.
