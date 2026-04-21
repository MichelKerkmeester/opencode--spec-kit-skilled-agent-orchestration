---
title: "029 - Hook Parity Remediation Decisions"
description: "Architecture decision record for hook parity remediation, including transport diagnostics, Codex recovery truth, Copilot routing, and PreToolUse policy behavior."
trigger_phrases:
  - "029 decisions"
  - "hook parity adr"
importance_tier: "high"
contextType: "decision-record"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation"
    last_updated_at: "2026-04-21T15:33:58Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Decision record reshaped to strict Level 3 ADR anchors"
    next_safe_action: "Run strict validation and targeted OpenCode plugin tests"
    completion_pct: 95
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: 029 - Runtime Hook Parity Remediation

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep runtime hook parity explicit and diagnostic

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-21 |
| **Deciders** | Hook parity remediation maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The hook parity review found that several runtime surfaces looked equivalent in documentation but behaved differently in practice. OpenCode injects context through a plugin bridge, Codex exposes prompt and pre-tool hooks but no startup lifecycle hook, Copilot routes startup through shell hooks, and PreToolUse policy must run safely in sandboxed workspaces.

### Constraints

- OpenCode transport failures must be visible to operators.
- Codex startup recovery must use a real surface available today.
- Copilot wrapper routing must preserve existing notification fan-out.
- PreToolUse enforcement must not create files during hook execution.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: preserve each runtime's real capability model and add diagnostics where silent failure was previously possible.

**How it works**: Minimal `session_resume` remains lightweight but returns transport metadata. The OpenCode bridge and plugin emit diagnostics when transport is absent or unparsable. Codex startup recovery is documented through `session_bootstrap`, Copilot startup enters through the repo-local wrapper, and PreToolUse policy loading uses in-memory defaults when persisted policy is absent.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Keep runtime-specific surfaces with diagnostics | Accurate, testable, low churn | Requires docs to be precise | 9/10 |
| Force all runtimes into lifecycle parity language | Simple story | Misleading for Codex and OpenCode | 3/10 |
| Accept missing transport as an empty result | Avoids extra diagnostics | Preserves the silent no-op P1 failure | 2/10 |

**Why this one**: It fixes the observed failures without inventing unsupported runtime capabilities.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- OpenCode plugin no-op paths become visible.
- Codex documentation points operators to a real recovery path.
- Copilot startup routing matches the intended wrapper contract.
- PreToolUse remains safe under read-only sandbox constraints.

**What it costs**:
- Runtime docs must stay capability-specific. Mitigation: keep the hook matrix and validation evidence current.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future runtime hooks add new capabilities | Medium | Update the matrix and add a new ADR when behavior changes. |
| Diagnostic output is too noisy | Low | Emit diagnostics only on missing or unparsable transport. |
| Sandbox constraints block direct policy-file edits | Medium | Use runtime/setup defaults and document the deferral. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The review reported P1 silent no-op and traceability failures. |
| 2 | **Beyond Local Maxima?** | PASS | Compared diagnostics, lifecycle parity language, and empty-result behavior. |
| 3 | **Sufficient?** | PASS | The decision maps directly to plugin, docs, and policy remediation. |
| 4 | **Fits Goal?** | PASS | It closes the hook parity review findings without scope creep. |
| 5 | **Open Horizons?** | PASS | Runtime-specific docs can evolve when actual hook capabilities change. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- OpenCode bridge and plugin diagnostic path for absent or invalid transport.
- Phase 003 docs reference `session_bootstrap` for Codex startup recovery.
- Task, checklist, implementation summary, continuity, and graph metadata reflect current evidence.
- PreToolUse policy behavior remains read-only at hook runtime.

**How to roll back**: Revert the plugin diagnostic additions and documentation updates only if the orchestrator accepts the known silent no-op and truth-sync risks.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
