---
title: "Decision Record: Copilot Startup Hook Wiring [02--system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring]"
description: "Architecture decisions for Phase 031: repair live Copilot startup surfacing through a repo-local wrapper and make Copilot hook detection depend on actual repo hook config."
trigger_phrases:
  - "phase 031 adr"
  - "copilot startup hook adr"
importance_tier: "important"
contextType: "implementation"
---
# Decision Record: Copilot Startup Hook Wiring

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Route Copilot `sessionStart` Through a Repo-Local Wrapper

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-04 |
| **Deciders** | Packet 030 follow-on implementation pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

Live Copilot verification showed a mismatch between implementation intent and live behavior. The shared Copilot startup hook existed and emitted the correct banner when run directly, but the tracked `sessionStart` config still pointed to a Superset notifier that outputs `{}`. That meant the banner never reached real Copilot sessions.

### Constraints

- The shared startup banner should remain the single source of truth.
- Superset notifications should continue to work best-effort.
- Runtime detection must stay truthful across repos with and without hook wiring.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Introduce a repo-local `sessionStart` wrapper and a repo-local JSON-safe notifier wrapper.

**How it works**: Copilot `sessionStart` now runs the startup wrapper, which emits the shared startup banner via the built Copilot hook and then fans out silently to Superset. Non-banner events run the JSON-safe notifier wrapper directly. Runtime detection separately scans `.github/hooks/*.json` for `sessionStart` to decide whether Copilot is hook-enabled in the current repo.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Repo-local startup wrapper + JSON-safe notifier wrapper** | Fixes live Copilot startup parity, preserves Superset, keeps config portable within the repo | Adds two small shell scripts | 9/10 |
| Point `sessionStart` directly at `session-prime.js` and drop Superset | Minimal moving parts | Regresses Superset notifications | 6/10 |
| Leave config unchanged and only correct docs | Lowest implementation risk | Fails the live runtime problem and leaves AGENTS/runtime claims wrong | 2/10 |

**Why this one**: It is the only option that fixes the real runtime behavior without throwing away the existing notifier path.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Copilot finally receives the shared startup banner automatically in this repo.
- Packet 030 no longer overstates Copilot parity.
- Runtime detection now reflects actual repo hook wiring.

**What it costs**:
- The repo now owns two small shell wrappers. Mitigation: keep them thin and tested.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wrapper emits invalid output | H | Add direct wrapper smoke tests and Vitest coverage |
| Detection overfits to this repo only | M | Prove both enabled and no-config branches in tests |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Live Copilot sessions were missing the startup banner despite existing hook code. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered included direct hook, doc-only repair, and wrapper approach. |
| 3 | **Sufficient?** | PASS | Thin wrappers plus dynamic detection fully close the observed gap. |
| 4 | **Fits Goal?** | PASS | The phase goal is truthful startup parity, not a new Copilot architecture. |
| 5 | **Open Horizons?** | PASS | Leaves broader cross-repo rollout out of packet 030. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Root `.github/hooks/superset-notify.json` now routes `sessionStart` through the repo-local startup wrapper.
- New repo-local wrapper scripts handle the startup banner and best-effort Superset forwarding.
- Copilot runtime detection and tests become repo-config-driven.
- Parent and related docs are truth-synced to the delivered wiring.

**How to roll back**: Restore the previous hook JSON, remove the wrapper scripts, and revert the dynamic Copilot detection logic.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

