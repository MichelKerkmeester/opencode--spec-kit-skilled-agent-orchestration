# Iteration 005 - Correctness

## Scope

Focused on deep-review loop routing and command/CLI tiebreaking, because this review request itself depends on the skill-owned loop guard.

Code reviewed:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`

Verification:
- Git history checked around routing guard commits, including `d7d338c0a2 feat: prevent skill-owned workflow bypass`.
- Vitest run 005 passed: 8 files, 54 tests.

## Findings

### IMPL-F002 - P1 Correctness - Iteration-loop tiebreaker misses the actual deep-review command bridge

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1638` defines command bridge records.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1670` defines `command-spec-kit-deep-review`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1727` maps `command-spec-kit-deep-review` back to `sk-deep-review`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2600` starts the iteration-loop tiebreaker.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2624` checks only `r.get("skill") == "command-spec-kit"`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2849` sorts skills before commands using kind priority.

Why this matters:
The tiebreaker does not recognize the actual deep-review command bridge, and penalizing CLI confidence is not enough when kind priority still ranks skills ahead of commands. Reproduction with `--force-local --threshold 0.5 --show-rejections` for `use cli-copilot for 10 iterations of deep-review` returned `cli-copilot` above `sk-deep-review` and `command-spec-kit-deep-review`, despite the tiebreaker message saying command-spec-kit owns the loop.

## Delta

New findings: 1 P1.
No P0 findings.
