---
title: Universal Error Recovery Decision Tree
description: Stack-agnostic recovery procedure for build, deploy, test, and runtime failures across WEBFLOW, NEXTJS, and GO.
---

# Universal Error Recovery Decision Tree

Stack-agnostic recovery procedure: Document → Isolate → Verify prerequisites → Retry verbose → Escalate.

---

## 1. OVERVIEW

### Purpose

Provides the decision tree to walk when a build, deploy, test, or runtime command fails unexpectedly. Stack-specific recovery (CDN upload, minification, dlv breakpoints, hydration retries) lives in each stack's debugging doc; this universal flow runs first and pulls in stack-specific procedures only after isolation.

### Core Principle

```
Document → Isolate → Verify prerequisites → Retry with verbose → Escalate if 3+ attempts fail
```

The recovery hierarchy is universal. Specific commands and tools change per stack but the decision flow is the same.

### When to Use

- A build, deploy, or test command fails unexpectedly.
- A previously-working flow suddenly breaks.
- An external dependency (CDN, registry, package mirror) misbehaves.
- You have tried the obvious fix twice and need a structured next move.

### Key Sources

- Per-stack debugging docs: `references/webflow/debugging/error_recovery.md`, `references/nextjs/debugging/debugging_workflows.md`, `references/go/debugging/debugging_workflows.md`.
- Universal debugging discipline: `assets/universal/checklists/debugging_checklist.md` (4-phase workflow).

---

## 2. THE FIVE-STEP RECOVERY FLOW

### Step 1 — Document the failure

Capture exact error output. Don't paraphrase.

- Full stack trace / log lines.
- Exit code.
- Working directory and relevant env vars.
- Last successful state (git commit, last test run, last deploy).

### Step 2 — Isolate the surface

Decide what's broken: source code, build tool, runtime, environment, or external service.

| Suspect          | First check                                                                  |
| ---------------- | ---------------------------------------------------------------------------- |
| Source code      | `git diff HEAD~1` — what changed since last working state?                   |
| Build tool       | Run with `--verbose` / `--debug` flag                                        |
| Runtime          | Try the previous version (rollback to known-good)                            |
| Environment      | `printenv` / `env` — required vars set? Auth / tokens valid?                 |
| External service | Service status page, healthcheck endpoint, rate limits                       |

### Step 3 — Verify prerequisites

Before re-running, confirm the obvious:

- Right working directory.
- Right branch (`git branch --show-current`).
- Auth tokens valid (`whoami` / token expiration check).
- Disk space available.
- Lockfile not corrupt (`rm -rf node_modules && npm ci` for JS / TS; `go mod tidy` for Go).
- Cache not stale (`<tool> clean` — npm, gradle, swift package, `go clean -cache`).

### Step 4 — Retry with verbose output

Re-run the failing command with the most verbose flag the tool supports.

| Stack              | Verbose flag                                                                  |
| ------------------ | ----------------------------------------------------------------------------- |
| WEBFLOW (Node tooling) | `--verbose`, `DEBUG=*`, `npm install --loglevel verbose`                  |
| WEBFLOW (Wrangler / R2) | `wrangler r2 object put ... --verbose`                                   |
| NEXTJS             | `npm run build --verbose`, `next build --debug`, `DEBUG=*`                    |
| GO                 | `go test -v ./...`, `go build -x ./...`, `golangci-lint run -v`               |

Read the verbose output linearly; the first new line that doesn't match a successful run is usually the cause.

### Step 5 — Escalate after 3 attempts

If 3+ retries with isolation + prerequisite verification fail, STOP iterating blindly:

- Surface the question to the user with the exact failure plus what was tried.
- Search the issue tracker / community for the verbose error string.
- Roll back to last-known-good and timebox a fresh attempt.

---

## 3. STACK-SPECIFIC RECOVERY POINTERS

| Stack    | Reference                                                                              |
| -------- | -------------------------------------------------------------------------------------- |
| WEBFLOW  | `references/webflow/debugging/error_recovery.md` (CDN, minification, version mismatch) |
| NEXTJS   | `references/nextjs/debugging/debugging_workflows.md` (Server vs Client, hydration)     |
| GO       | `references/go/debugging/debugging_workflows.md` (dlv, slog, race detector, pprof)     |

---

## 4. WHEN TO ESCALATE TO THE USER

Escalate immediately (do not retry blindly) if:

- Failure involves credentials, auth tokens, or secrets.
- Failure modifies production / deployed state.
- Failure cascades across multiple unrelated components.
- The failure description doesn't match any reasonable mental model of the system.
- 3+ retry attempts have already failed.

State: what failed (verbatim), what you tried, what you suspect, and what you propose next.

---

---

## 5. RELATED RESOURCES

- `assets/universal/checklists/debugging_checklist.md` - 4-phase debugging workflow that wraps this recovery flow.
- `assets/universal/checklists/verification_checklist.md` - runs after recovery completes, before any "done" claim.
- `references/universal/code_quality_standards.md` - severity contract (recovery failures are typically P0).
- `references/router/phase_lifecycle.md` - Phase 2 Debugging position in the sk-code lifecycle.
- Per-stack debugging refs under `references/{webflow,nextjs,go}/debugging/`.
