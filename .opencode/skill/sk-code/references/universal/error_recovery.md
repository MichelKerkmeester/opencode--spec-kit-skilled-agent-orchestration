---
title: Universal Error Recovery Decision Tree
description: Stack-agnostic recovery workflow for build / deployment / runtime failures. Symptom → Isolate → Verify prerequisites → Retry verbose → Escalate.
keywords: [error-recovery, troubleshooting, decision-tree, universal, stack-agnostic]
---

# Universal Error Recovery Decision Tree

Stack-agnostic recovery procedures. Apply this decision tree first; reach for stack-specific recovery only when the universal flow runs out.

> **Web stack note**: For CDN upload, minification, version mismatch, and Webflow-specific recovery procedures, see `references/web/debugging/error_recovery.md` (carries the wrangler / r2 / terser specifics).

---

## 1. CORE PRINCIPLE

```
Document → Isolate → Verify prerequisites → Retry with verbose → Escalate if 3+ attempts fail
```

The recovery hierarchy is universal. Specific commands and tools change per stack but the decision flow is the same.

---

## 2. WHEN TO USE

- A build / deploy / test command fails unexpectedly
- A previously-working flow suddenly breaks
- An external dependency (CDN, registry, package mirror) misbehaves
- You've tried the obvious fix 2× and need a structured next move

---

## 3. THE FIVE-STEP RECOVERY FLOW

### Step 1 — Document the failure

Capture exact error output. Don't paraphrase.
- Full stack trace / log lines
- Exit code
- Working directory + relevant env vars
- Last successful state (git commit, last test run, last deploy)

### Step 2 — Isolate the surface

Decide what's broken: source code, build tool, runtime, environment, external service.

| Suspect | First check |
|---|---|
| Source code | `git diff HEAD~1` — what changed since last working state? |
| Build tool | Run with `--verbose` / `--debug` flag |
| Runtime | Try the previous version (rollback to known-good) |
| Environment | `printenv` / `env` — required vars set? Auth / tokens valid? |
| External service | Service status page; healthcheck endpoint; rate limits |

### Step 3 — Verify prerequisites

Before re-running, confirm the obvious:
- Right working directory
- Right branch (`git branch --show-current`)
- Auth tokens valid (`whoami` / token expiration check)
- Disk space available
- Lockfile not corrupt (`rm -rf node_modules && npm ci` for JS; `go mod tidy` for Go)
- Cache not stale (`<tool> clean` — npm, gradle, swift package, go clean -cache)

### Step 4 — Retry with verbose output

Re-run the failing command with the most verbose flag the tool supports.

| Stack | Verbose flag |
|---|---|
| WEB / Node | `--verbose`, `DEBUG=*`, `npm install --loglevel verbose` |
| Go | `go test -v ./...`, `go build -x ./...`, `golangci-lint run -v` |
| Swift | `swift build --verbose`, `xcodebuild -verbose` |
| Wrangler / R2 (web) | `wrangler r2 object put ... --verbose` |

Read the verbose output linearly; the first new line that doesn't match a successful run is usually the cause.

### Step 5 — Escalate after 3 attempts

If 3+ retries with isolation + prerequisite verification fail, STOP iterating blindly:
- Surface the question to the user with the exact failure + what was tried
- Search the issue tracker / community for the verbose error string
- Roll back to last-known-good and timebox a fresh attempt

---

## 4. STACK-SPECIFIC RECOVERY POINTERS

| Stack | Reference |
|---|---|
| WEB | `references/web/debugging/error_recovery.md` (CDN, minification, version mismatch, Webflow specifics) |
| GO / NODEJS / REACT / RN / SWIFT | `references/<stack>/_placeholder.md` (canonical content retired) for stack-specific recovery patterns |

---

## 5. WHEN TO ESCALATE TO THE USER

Escalate immediately (do not retry blindly) if:
- Failure involves credentials, auth tokens, or secrets
- Failure modifies production / deployed state
- Failure cascades across multiple unrelated components
- The failure description doesn't match any reasonable mental model of the system
- 3+ retry attempts have already failed

State: what failed (verbatim), what you tried, what you suspect, and what you propose next.
