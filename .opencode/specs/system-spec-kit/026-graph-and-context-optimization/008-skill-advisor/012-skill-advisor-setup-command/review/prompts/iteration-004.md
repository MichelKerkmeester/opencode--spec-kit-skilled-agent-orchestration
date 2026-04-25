You are running iteration 4 of 7 in a deep-review loop.

# Iteration 4 — Security: Prompt Injection, Rollback Safety, Secret Leakage

## Focus
Audit the entire packet implementation for security concerns:
- Prompt injection surface in cli-* executor dispatch
- Rollback procedure safety (clean-tree assumptions, blast radius)
- Secret leakage in command markdown, install guide, YAMLs (no API keys, no tokens)
- Path traversal in scope/target arguments
- File permission concerns (`--allow-all-tools` flag in cli-copilot)
- Untrusted input in PHRASE_BOOSTS / TOKEN_BOOSTS proposals

## Required reads
1. Strategy + prior iteration outputs (1, 2, 3)
2. `.opencode/command/spec_kit/skill-advisor.md`
3. `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml`
4. `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml`
5. `.opencode/install_guides/SET-UP - Skill Advisor.md`
6. `.opencode/specs/.../012-skill-advisor-setup-command/spec.md` (NFR-S section)

## What to look for
- Phase 1 reads SKILL.md frontmatter — could a malicious frontmatter inject a prompt?
- Rollback uses `git checkout HEAD -- <paths>` — what if the user has unrelated WIP in those paths?
- The diff written to `/tmp/skill-advisor-proposal-*.md` — is it world-readable on shared systems?
- Scope flag parsing — any path traversal possible via `--scope=...../...`?
- Command markdown's `allowed-tools` list — does it grant broader tool access than the workflow needs?
- Proposed tokens in TOKEN_BOOSTS — are they sanitized to prevent regex injection in the scorer?

## Outputs (MANDATORY)
Same three artifacts pattern with `iteration-004` suffix. ID prefix `F-SEC-`.

## Constraints
- Read-only.
- Cite file:line for every finding.
- Severity calibration: a P0 security finding should require known exploit path or data exposure; over-flagging dilutes signal.
