---
title: "Decision Record: Copilot CLI Hook Parity Remediation"
description: "ADRs for scoping decisions. The load-bearing decision (wire hooks vs. document gap) lands after Phase 1 investigation — this file carries placeholder scoping ADRs until then."
trigger_phrases:
  - "026/007/007 adr"
  - "copilot hook parity decisions"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/007-copilot-hook-parity-remediation"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scoping ADRs authored; outcome ADR pending Phase 1 findings"
    next_safe_action: "Author ADR-003 after T-07 classifies outcome A/B/C"
    completion_pct: 25
---
# Decision Record: Copilot CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->

---

## ADR-001: Investigate before implementing

**Status**: Accepted

**Context**: When spec 020 wired Claude Code's hook surface, Copilot CLI parity wasn't verified. The user discovered the gap empirically. Two outcome shapes are plausible: (a) Copilot has a hook API we didn't use — implementation is a port; (b) Copilot has no hook API — the fix is a workaround or a documented limitation. These outcomes require radically different effort and produce different artifacts.

**Decision**: Gate all implementation on a Phase 1 investigation that establishes Copilot CLI's actual extension surface with primary sources. Do not write Copilot hook code until that investigation classifies the outcome as A (full parity possible) or B (reduced-scope workaround possible).

**Consequences**:
- **Positive**: prevents implementation against a non-existent API; prevents re-investigation in a later attempt.
- **Positive**: produces a durable research artifact (`research.md`) that any future CLI-parity effort (Gemini, etc.) can reuse.
- **Negative**: adds one investigation pass before any code lands. Acceptable because the alternative is worse — speculative code against an undocumented API.

---

## ADR-002: Accept "documented limitation" as a valid phase outcome

**Status**: Accepted

**Context**: If Phase 1 finds Copilot CLI has no usable extension surface at all (outcome C), the user has two options: (1) accept the asymmetry and ship docs that make it discoverable; (2) hold the phase open indefinitely waiting for Copilot to ship an extension API. Option 2 blocks closure on an external party's roadmap, which is not a sustainable phase state.

**Decision**: Treat outcome C as a complete-with-limitation closure. The phase ships documentation in `cli-copilot/SKILL.md` + `README.md` stating the gap explicitly, and the parent handover records the outcome. If Copilot later ships an extension API, a new phase reopens the parity work; this one stays closed.

**Consequences**:
- **Positive**: phase has a bounded completion condition regardless of Copilot's roadmap.
- **Positive**: user-visible docs prevent re-discovery of the gap.
- **Negative**: users in Copilot CLI remain without the advisor brief + graph context. Mitigated by the P2 best-effort shell-wrapper workaround if feasible.

---

## ADR-003: Final implementation path — B (file-based workaround)

**Status**: Accepted (2026-04-22) — classified from 10-iteration deep-research synthesis in `../research/007-deep-review-remediation-pt-01/research.md`.

**Context**: 10 deep-research iterations via cli-copilot converged on a clear picture of Copilot CLI 1.0.34's extension surface. Copilot *does* have a documented hook system (`sessionStart`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, `sessionEnd`, `errorOccurred`) — but the hook reference explicitly says: `sessionStart` output is ignored, `userPromptSubmitted` output is ignored ("prompt modification is not currently supported in customer hooks"), and `postToolUse`/`errorOccurred` outputs are ignored. Only `preToolUse` can affect behavior (deny/ask/allow a tool call) — not a prompt-text channel. That rules out outcome A (full hook parity mirroring Claude).

Copilot DOES have a native startup-context mechanism: auto-loaded custom instructions from `.github/copilot-instructions.md`, `AGENTS.md`, `$HOME/.copilot/copilot-instructions.md`, path-specific `.github/instructions/**/*.instructions.md`, plus extra directories via `COPILOT_CUSTOM_INSTRUCTIONS_DIRS`. This is file-based/static but gives us a real parity path.

`--acp` (Agent Client Protocol) server mode exposes bidirectional injection if Spec Kit Memory acts as an external ACP client wrapper — but that's significant engineering cost against a public-preview API with open gaps (no `ask_user` extension, no arbitrary JSON-RPC methods, slash-command coverage missing).

**Decision**: Accept **outcome B (file-based workaround)**. Primary implementation path is **static file rewrite** (option 1 in matrix below) targeting `$HOME/.copilot/copilot-instructions.md`. Supplementary: shell wrapper around `copilot -p` for programmatic-mode coverage (option 2). Defer ACP client wrapper (option 3) until the ACP API stabilizes.

**Decision matrix (real entries from research)**:

| # | Path                                                 | Feasibility | Eng. cost | Runtime cost | Coverage                                                           | Recommended |
|---|------------------------------------------------------|-------------|-----------|--------------|--------------------------------------------------------------------|-------------|
| 1 | Static file rewrite at `$HOME/.copilot/copilot-instructions.md` | High | Low (~1 day) | Negligible (file write per update) | Startup context + advisor brief; freshness bounded by writer cadence (typically < 1 prompt) | **Yes — primary** |
| 2 | Shell wrapper for `copilot -p` programmatic mode     | High        | Low (~1h) | <100ms per call | Programmatic/scripting mode only; no interactive TUI coverage       | Yes — supplementary |
| 3 | ACP client wrapper (`copilot --acp` as child)        | Medium (API in public preview, evolving) | High (~1-2 weeks) | Protocol overhead per turn | Full dynamic injection, all modes including TUI | Medium priority — defer |
| 4 | Custom-agent profile with static prompt              | Low         | Low       | None         | Only when user selects agent; static; wrong abstraction            | No          |
| 5 | MCP tool proxy (advisor exposed as callable tool)    | Low (agent must voluntarily call) | Medium | Per-call | Unreliable (pull-based; agent may skip)                        | No          |
| 6 | `preToolUse` hook inject                             | None (hook is a decision gate, not text channel) | — | — | Zero text coverage | No          |
| 7 | Document limitation, no action                       | High        | Zero      | None         | Zero parity                                                        | No — options 1-3 viable |

**Consequences**:
- **Positive**: options 1 + 2 together cover both interactive TUI (via option 1's file) and programmatic/CI (via option 2's wrapper). Low engineering cost, high feasibility.
- **Positive**: no dependency on Copilot's evolving ACP API for the primary path.
- **Positive**: Spec Kit Memory already has the advisor/context generation logic — only a new writer target is needed for option 1, not new logic.
- **Negative**: freshness bounded by writer cadence — if advisor brief changes mid-prompt, only the most recent value lands on next prompt. Acceptable for this use case.
- **Negative**: static-file parity doesn't match Claude's true in-turn injection. Users of cli-copilot will see slightly-stale briefs vs cli-claude-code. Documented in cli-copilot SKILL.md as expected behavior.
- **Negative**: multi-tenant / shared-host scenarios need `COPILOT_HOME` per-session override work, out of scope for primary path.

**References**:
- Full synthesis: `../research/007-deep-review-remediation-pt-01/research.md` — §5 decision matrix, §6 recommended plan.
- Primary-source URLs: 30+ in `research.md` §2.
- Upstream evolution to watch (gates the option 3 revisit): [GitHub issue #1245](https://github.com/github/copilot-cli/issues/1245), [#2044](https://github.com/github/copilot-cli/issues/2044), [#2555](https://github.com/github/copilot-cli/issues/2555).

---

## CROSS-REFERENCES

- **Spec**: `spec.md` §2 (problem), §4 (requirements)
- **Plan**: `plan.md` §2 Phase 1 exit criteria
- **Tasks**: `tasks.md` T-06, T-07 (investigation → classification), T-19 (ADR-003 finalization)
- **Research artifact**: `research.md` (to be authored during Phase 1)
- **Referenced spec**: `.opencode/specs/026-graph-and-context-optimization/020-skill-advisor-hook-surface/`
