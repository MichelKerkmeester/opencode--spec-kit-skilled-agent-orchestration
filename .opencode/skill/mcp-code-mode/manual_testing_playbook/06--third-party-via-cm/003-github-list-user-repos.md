---
title: "CM-019 -- GitHub list user repos"
description: "This scenario validates GitHub repo listing via Code Mode for `CM-019`. It focuses on confirming `github_list_user_repos` returns the authenticated user's repos."
---

# CM-019 -- GitHub list user repos

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-019`.

---

## 1. OVERVIEW

This scenario validates GitHub repo listing via Code Mode for `CM-019`. It focuses on confirming `github.github_list_user_repos()` returns the authenticated user's repository list — the discovery entry point for any GitHub workflow (issues, PRs, releases).

### Why This Matters

GitHub is one of the most-used external MCPs. If repo listing fails, every downstream GitHub scenario (issue creation, PR review, release drafting) is unverifiable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-019` and confirm the expected signals without contradictory evidence.

- Objective: Verify `github.github_list_user_repos()` returns array of repo objects with `name`, `owner.login`, `private` fields.
- Real user request: `"List my GitHub repos."`
- Prompt: `As a manual-testing orchestrator, list repos owned by the authenticated GitHub user through Code Mode against the live GitHub API. Verify the response is a non-empty array of repo objects. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: single `call_tool_chain` invocation; assumes `github_GITHUB_TOKEN` env var per CM-008.
- Expected signals: response is array; each entry has `name`, `owner.login`, `private` fields; array length > 0 (most accounts have at least one repo).
- Desired user-visible outcome: A short report quoting count + first-repo name and a PASS verdict.
- Pass/fail: PASS if all signals hold; FAIL if auth error, response not array, or entries missing required fields.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, list repos owned by the authenticated GitHub user through Code Mode against the live GitHub API. Verify the response is a non-empty array of repo objects. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "const repos = await github.github_list_user_repos({}); return { count: repos.length, sample_name: repos[0]?.name, sample_owner: repos[0]?.owner?.login, sample_private: repos[0]?.private };" })`
2. Inspect the returned object

### Expected

- Step 1: chain returns object with `count`, `sample_name`, `sample_owner`, `sample_private`
- Step 2: `count` >= 1 for accounts with repos
- Step 2: `sample_name` is non-empty; `sample_owner` matches the authenticated user; `sample_private` is boolean

### Evidence

Capture the chain response with count + sample fields.

### Pass / Fail

- **Pass**: Repo list returned with valid shape; auth succeeded.
- **Fail**: 401 (token missing/invalid); response not an array; entries missing fields.

### Failure Triage

1. If 401: check `github_GITHUB_TOKEN` (note prefix per CM-008); confirm token scopes include `repo` for private repos.
2. If empty array on an account that has repos: token may be limited to public repos only; check token scope.
3. If response shape mismatch: `tool_info({tool_name: "github.github_list_user_repos"})` to confirm current schema.

### Optional Supplemental Checks

- Call `github_get_repo({owner, repo})` for the first entry; verifies the id is usable downstream.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | GitHub MCP integration notes |

---

## 5. SOURCE METADATA

- Group: THIRD-PARTY VIA CM
- Playbook ID: CM-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--third-party-via-cm/003-github-list-user-repos.md`
