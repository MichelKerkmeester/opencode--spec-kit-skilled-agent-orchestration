---
title: "Decision Record: sk-git Superset Worktree Alignment [03--commands-and-skills/006-sk-git-superset-worktrees/decision-record]"
description: "Architecture decisions for adapting Superset-style worktree workflows into sk-git documentation."
---
# Decision Record: sk-git Superset Worktree Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Centralized worktree storage with backward-compatible fallback

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-28 |
| **Deciders** | Spec author, sk-git maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The existing sk-git workflow used project-local `.worktrees/` storage. The Superset model uses centralized storage that keeps repo roots cleaner and supports broader multi-workspace organization.

### Constraints

- Existing `.worktrees/` users must not be broken.
- The documentation must remain practical for a CLI/AI-skill workflow.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Document `~/.opencode/worktrees/<project>/<branch>/` as the new default while preserving `.worktrees/` as a supported fallback.

**How it works**: New guidance recommends centralized storage first, but existing project-local workflows continue to be supported so migration is not forced.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Centralized default + fallback** | Cleaner repos, backward compatibility | Slightly more complex guidance | 9/10 |
| Project-local only | Simple and familiar | Less aligned with Superset model | 5/10 |
| Centralized only | Strong consistency | Breaks existing local setups | 4/10 |

**Why this one**: It captured the Superset benefit without forcing current users into an immediate migration.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Repo roots stay cleaner.
- Worktrees can be organized across projects more predictably.

**What it costs**:
- The guidance becomes slightly more complex. Mitigation: document resolution priority clearly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users are confused by two supported storage patterns | M | Document precedence and migration notes clearly |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Existing worktree model was too manual |
| 2 | **Beyond Local Maxima?** | PASS | Several storage approaches were considered |
| 3 | **Sufficient?** | PASS | Default + fallback covers old and new workflows |
| 4 | **Fits Goal?** | PASS | Aligns sk-git with the adapted Superset model |
| 5 | **Open Horizons?** | PASS | Leaves room for future migration guidance |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Worktree docs describe centralized storage as the default.
- Existing `.worktrees/` usage remains documented as supported.

**How to roll back**: Revert the guidance to project-local `.worktrees/` only and remove centralized-path references.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---


### ADR-002: Config-driven lifecycle hooks with explicit user confirmation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-28 |
| **Deciders** | Spec author, sk-git maintainers |

---


### Context

Superset-style worktree setup and teardown become more useful when project-specific commands can run automatically. In an AI-driven CLI context, that creates a security problem because repository config could request arbitrary commands.

### Constraints

- Setup and teardown must stay optional.
- Users must remain in control of command execution.


---


### Decision

**We chose**: Use `.opencode/worktree.json` for setup/teardown hooks and require explicit user confirmation before any lifecycle script runs.

**How it works**: The config file can define hook arrays, but the AI must show those commands to the user and get approval before execution. If no config exists, the workflow falls back gracefully.


---


### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Config hooks + confirmation** | Flexible and safer in AI workflows | Adds one extra confirmation step | 9/10 |
| Config hooks without confirmation | Less friction | Unsafe for cloned repos | 2/10 |
| No lifecycle config | Simpler docs | Misses important automation benefits | 5/10 |

**Why this one**: It preserves automation value while respecting the security expectations of AI-mediated command execution.


---


### Consequences

**What improves**:
- Projects can document repeatable setup and teardown.
- Users retain control over potentially unsafe commands.

**What it costs**:
- There is extra confirmation friction. Mitigation: keep commands visible and explicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Malicious config in cloned repos | H | Mandatory explicit confirmation |


---


### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Hook automation without safeguards would be risky |
| 2 | **Beyond Local Maxima?** | PASS | Hook-free and auto-exec variants were considered |
| 3 | **Sufficient?** | PASS | Confirmation requirement addresses the key risk |
| 4 | **Fits Goal?** | PASS | Supports the adapted Superset lifecycle model |
| 5 | **Open Horizons?** | PASS | Future config expansion remains possible |

**Checks Summary**: 5/5 PASS


---


### Implementation

**What changes**:
- Docs describe `.opencode/worktree.json` with setup and teardown arrays.
- The workflow explicitly asks for confirmation before script execution.

**How to roll back**: Remove config-hook guidance and return to manual setup/teardown instructions only.



---


### ADR-003: Defer branch sanitization and advanced config resolution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Deferred |
| **Date** | 2026-02-28 |
| **Deciders** | Spec author, sk-git maintainers |

---


### Context

The full Superset-style model also suggests branch sanitization, multi-level config resolution, and environment-variable injection. Those improvements were valuable but expanded the scope beyond the core documentation alignment work.

### Constraints

- The current spec must stay focused on the core worktree workflow adaptation.
- Deferred items still need to be recorded for future work.


---


### Decision

**We chose**: Defer branch sanitization, advanced config resolution, and environment-variable injection to follow-up work.

**How it works**: The current documentation focuses on centralized storage, lifecycle hooks, setup flow, and teardown safety. Deferred items remain documented so they can be resumed without rediscovery.


---


### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer advanced features** | Keeps current scope achievable | Some Superset parity remains incomplete | 8/10 |
| Include everything now | More feature parity immediately | Too much scope for one documentation pass | 4/10 |

**Why this one**: It protected the core adaptation work from scope creep.


---


### Consequences

**What improves**:
- The current work stays focused and completable.
- Future work has a documented starting point.

**What it costs**:
- Some advanced parity remains deferred. Mitigation: keep deferred items explicit in the spec and checklist.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Deferred items are forgotten | M | Record them in the spec, plan, and checklist |


---


### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Core scope was already large |
| 2 | **Beyond Local Maxima?** | PASS | Full-parity option was explicitly considered |
| 3 | **Sufficient?** | PASS | Core workflow adaptation remains meaningful without the deferred items |
| 4 | **Fits Goal?** | PASS | Keeps the current effort focused on the highest-value pieces |
| 5 | **Open Horizons?** | PASS | Follow-up work is clearly defined |

**Checks Summary**: 5/5 PASS


---


### Implementation

**What changes**:
- Deferred items remain documented rather than implemented in this pass.
- Core worktree workflow alignment remains the focus.

**How to roll back**: Re-open the deferred scope and fold the advanced features back into the current plan.



---
