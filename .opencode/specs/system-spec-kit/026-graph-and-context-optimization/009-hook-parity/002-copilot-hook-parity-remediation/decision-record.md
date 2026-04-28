---
title: "Decision Record: Copilot CLI Hook Parity Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2"
description: "ADRs for Copilot parity outcome B, repo-local wrapper routing, and managed custom-instructions retention."
trigger_phrases:
  - "026/009/004 adr"
  - "copilot hook parity decisions"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Strict validator closure"
    next_safe_action: "Keep validators green"
    completion_pct: 100
---

# Decision Record: Copilot CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Copilot parity ships through managed custom instructions

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-22, updated 2026-04-28 |
| **Deciders** | Spec Kit maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

Spec 020 wired Claude Code's native hooks for startup context and prompt-submit advisor brief. Copilot CLI did not surface those payloads. Research found Copilot customer hooks exist, but `sessionStart` output is ignored and `userPromptSubmitted` cannot mutate prompts. Copilot custom instructions are available through the home-level instructions file, which makes file-backed next-prompt freshness feasible.

### Constraints

- Copilot hook output cannot provide true current-turn prompt mutation.
- Human-authored Copilot instructions must be preserved.
- Superset notification remains optional and must not replace the Spec Kit writer.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: outcome B, a managed custom-instructions file workaround targeting `$HOME/.copilot/copilot-instructions.md`.

**How it works**: repo-local wrappers run Spec Kit Copilot hooks before optional Superset notification. The hooks refresh a `SPEC-KIT-COPILOT-CONTEXT` managed block scoped to the workspace root. Copilot reads that block on the next prompt.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Managed custom-instructions file | Low cost, documented Copilot input, covers interactive use | Next-prompt freshness, not true prompt mutation | 9/10 |
| Shell wrapper for `copilot -p` | Same-command programmatic coverage | Does not cover interactive TUI by itself | 7/10 |
| ACP client wrapper | Could support richer dynamic injection | Higher cost, public-preview API gaps | 5/10 |
| Direct hook prompt mutation | Would match Claude | Unsupported by Copilot hook contract | 0/10 |
| Document limitation only | Honest and cheap | Leaves viable file path unused | 3/10 |

**Why this one**: managed custom instructions are the lowest-risk working transport. It preserves user instructions and avoids depending on Copilot ACP stabilization.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Copilot users get startup/advisor context through a supported file surface.
- The parity state is discoverable in docs and ADRs.
- Superset notification remains available after Spec Kit writer execution.

**What it costs**:
- Copilot remains next-prompt fresh rather than current-turn fresh. Mitigation: document this explicitly.
- Workspace scoping relies on Copilot honoring the instruction. Mitigation: render the workspace root inside the managed block.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Superset wrapper regeneration bypasses repo-local writer | Medium | ADR-004 records repo-local wrappers as source of truth. |
| Global file leaks stale context | High | Workspace-scoped managed block and ignore-mismatch instruction. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Copilot lacked Claude-equivalent startup/advisor context. |
| 2 | **Beyond Local Maxima?** | PASS | Hook mutation, shell wrapper, ACP, MCP proxy, and no-action options were compared. |
| 3 | **Sufficient?** | PASS | File-backed transport gives practical context without unsupported APIs. |
| 4 | **Fits Goal?** | PASS | The goal is Copilot parity under actual transport limits. |
| 5 | **Open Horizons?** | PASS | ACP remains available as future work when stable. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `hooks/copilot/custom-instructions.ts` owns managed block rendering and writes.
- `.github/hooks/scripts/session-start.sh` and `user-prompt-submitted.sh` route events through Spec Kit before optional Superset notification.
- cli-copilot docs describe outcome B and next-prompt freshness.

**How to roll back**: disable writes with `SPECKIT_COPILOT_INSTRUCTIONS_DISABLED` or revert repo-local hook routing; then rerun focused Copilot/Claude hook tests.

### ADR-002: Investigate before implementing

Status: Accepted. Implementation was gated on research because Copilot could have had either a direct hook API or no usable injection surface. The research-first approach prevented speculative code against an unsupported API.

### ADR-003: Documented limitation remains a valid outcome

Status: Accepted. If Copilot had no viable surface, documentation-only closure would have been valid. Outcome B superseded that path because custom instructions are viable.

### ADR-004: Repo-local wrappers own routing before Superset notification

Status: Accepted. `sessionStart` and `userPromptSubmitted` route through repo-local wrappers first, then optionally call Superset if present.

### ADR-005: Managed retention is workspace-scoped and atomically updated

Status: Accepted. The writer renders `Workspace: <root>`, tells Copilot to ignore mismatched roots, serializes writes with a lock file, and replaces the target through atomic rename.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
