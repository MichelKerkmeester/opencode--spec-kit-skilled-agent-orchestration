You are running iteration 2 of a 5-iteration deep review on spec folder `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/`.

## Iteration 2 Dimension: SECURITY

Audit the security posture of the deliverables produced in the recent session. The 5 cli-* manual_testing_playbook packages contain destructive scenarios, sandbox boundary claims, secret-handling assertions, and cross-AI handback isolation rules.

## Prior iteration context

Iteration 1 (correctness) found 6 P0 findings, primarily 51 broken 9-column scenario rows due to unescaped pipes in command cells. Read `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/review/iterations/iteration-001.md` for full prior findings before starting iter 2.

## Scope (security-focused)

1. **Destructive scenario isolation** — Per-feature files marked destructive (e.g. CC-* permission-mode bypass, CP-008 Autopilot, CP-013 repo-memory write, CP-020/021 cloud delegation, CO-026/027/028 `--share` flows). Verify:
   - Each destructive scenario explicitly documents recovery
   - Each runs in a `/tmp/` or sandboxed `HOME` directory (never the operator project tree)
   - Each has explicit operator-confirmation gating where required (e.g. `--share` URL publication)
2. **Self-invocation guards** — cli-opencode and cli-copilot SKILL.md document self-invocation refusal. Verify the playbook scenarios that exercise this (CO-008, CO-031, etc.) accurately describe the guard contract and do NOT propose nested invocation that would bypass the guard.
3. **ADR-004 cross-AI handback isolation** — cli-opencode `06--integration-patterns` claims companion CLI execution is out of scope for default scenarios. Verify the per-feature files and the root playbook §6 actually document this isolation in the Pass/Fail Criteria.
4. **Secret + credential surface** — Scan all 115 per-feature files + 5 root playbooks + 6 spec docs for accidental:
   - API keys, tokens, GH_TOKEN values, OAuth secrets
   - Hard-coded paths to `~/.copilot/state/` lock files in non-sandboxed contexts
   - Personal directory paths (e.g. `/Users/<name>/...`) outside sandboxed `/tmp/` examples
5. **Auto-memory rule honoring** — The auto-memory says "Copilot CLI max 3 concurrent dispatches". Verify cli-copilot scenarios document this cap and never propose 4+ concurrent invocations.
6. **Codex `service_tier="fast"` honor** — The auto-memory says cli-codex must explicitly pass `-c service_tier="fast"`. Verify all `codex exec` invocations in the cli-codex playbook actually carry this flag.

## Severity contract

- **P0 (Blocker)**: a leaked secret, a destructive scenario without recovery + sandbox, a guard-bypass scenario, an ADR-004 violation that lets companion CLI execution gate the verdict, a cli-copilot scenario proposing >3 concurrent dispatches
- **P1 (Required)**: missing recovery doc on a destructive scenario, missing sandbox boundary on a destructive scenario, partial self-invocation guard documentation
- **P2 (Suggestion)**: an absolute path that should be parameterized, a stale env-var reference, redundant safety prose

## Method

Use Grep + Read aggressively. Pattern-match `/tmp/`, `--share`, `HOME=`, `--allow-all-tools`, `--no-ask-user`, `service_tier`, `concurrent`, `parallel`, `nested`, etc. Spot-check the destructive-scenario set per playbook. Read full ADR-004 from `decision-record.md`.

## Output (REQUIRED)

Write findings to `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/review/iterations/iteration-002.md` using the exact template format from iteration-001.md (frontmatter + Metadata + Findings P0/P1/P2 + Evidence + newFindingsRatio + Convergence Signal).

Use `[severity] [feature-id-or-file:line] description + remediation` for every finding. Be aggressive — surface real risks. Read-only review, do not modify any file.
