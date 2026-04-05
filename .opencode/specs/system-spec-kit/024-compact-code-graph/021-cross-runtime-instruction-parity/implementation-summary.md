<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Implementation Summary: Cross-Runtime Instruction Parity [024/021]"
description: "No Hook Transport tables in all instruction files and @context-prime agent for OpenCode."
---
# Implementation Summary


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Metadata
Template compliance shim section. Legacy phase content continues below.

## What Was Built
Template compliance shim section. Legacy phase content continues below.

## How It Was Delivered
Template compliance shim section. Legacy phase content continues below.

## Key Decisions
Template compliance shim section. Legacy phase content continues below.

## Verification
Template compliance shim section. Legacy phase content continues below.

## Known Limitations
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
Template compliance shim anchor for what-built.
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
Template compliance shim anchor for how-delivered.
<!-- /ANCHOR:how-delivered -->
Template compliance shim anchor for decisions.
<!-- ANCHOR:decisions -->
Decision details are documented in the Key Decisions section above.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
Template compliance shim anchor for verification.
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
Template compliance shim anchor for limitations.
<!-- /ANCHOR:limitations -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
### Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 021-cross-runtime-instruction-parity |
| **Completed** | 2026-03-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
### What Was Built
The runtime guidance now points non-hook CLIs at the current bootstrap-first recovery contract, and OpenCode now has a verified `@context-prime` entry point. This summary also keeps the remaining parity gap visible instead of overstating completion.

### No Hook Transport Tables

Added standardized trigger tables to `CODEX.md`, `AGENTS.md`, and `GEMINI.md` with consistent guidance:

| When | What to Call |
|------|-------------|
| Fresh session start | `session_bootstrap()` — returns resume + health + structural context in one call |
| After resume/reconnect | `session_resume()` |
| Suspected context loss | `session_health()` → if structural context is stale/missing, call `session_bootstrap()` |
| After `/clear` | Same as fresh session |
| Before structural search | `code_graph_context({ subject: "..." })` |

AGENTS.md advertises `@context-prime` and the session lifecycle guidance, while `.opencode/agent/orchestrate.md` performs the actual first-turn or post-`/clear` delegation. Claude-hook-specific wording was only partially cleaned up in non-Claude agent files, so this phase records that residual wording as a known gap instead of claiming full removal.

### @context-prime Agent

A new agent at `.opencode/agent/context-prime.md` (227 lines) that:
1. Calls `session_resume()` to recover prior session state plus graph and CocoIndex availability
2. Optionally calls `session_health()` when a quality score is useful
3. Returns a compact Prime Package with spec folder, task status, system health, and recommended next steps

F059 is now verified done because `.opencode/agent/orchestrate.md` lines 18-21 explicitly delegate to `@context-prime` on the first user turn or after `/clear`. AGENTS.md remains the advertising and guidance surface, not the delegation executor. The public first-turn contract is still `session_bootstrap()`; `@context-prime` is the delegated lower-level resume surface used by orchestrators.
<!-- /ANCHOR:what-built -->

---
### Files Changed

| File | Change Type | Description |
|------|------------|-------------|
| `.opencode/agent/context-prime.md` | New | @context-prime agent for session priming (227 lines) |
| `.opencode/agent/orchestrate.md` | Modified | Session Bootstrap delegation reference |
| `CODEX.md` | Modified | No Hook Transport trigger table |
| `AGENTS.md` | Modified | No Hook Transport trigger table, @context-prime reference |
| `GEMINI.md` | Modified | No Hook Transport trigger table |
| `CLAUDE.md` | Modified | @context-prime added to Agent Definitions |
---

<!-- ANCHOR:how-delivered -->
### How It Was Delivered
This phase landed as a documentation and agent-instruction alignment pass. The final verification step confirmed that AGENTS.md defines and advertises `@context-prime`, while `.opencode/agent/orchestrate.md` is the runtime file that actually delegates to it on the first turn or after `/clear`.
<!-- /ANCHOR:how-delivered -->

---
### Key Decisions
| Decision | Why |
|----------|-----|
| Treat `session_bootstrap()` as the public first-call contract for hookless runtimes | Root/runtime guidance now standardizes fresh starts and `/clear` on the composite bootstrap surface. |
| Keep `session_resume()` plus optional `session_health()` inside `@context-prime` | The delegated agent still benefits from the two-step workflow while staying subordinate to the public bootstrap-first runtime guidance. |
| Record Claude-hook wording as a known residual gap | The non-Claude agent files still contain that wording, so claiming full cleanup would be inaccurate. |
| Mark F059 verified done | `.opencode/agent/orchestrate.md` already contains the required first-turn and post-`/clear` delegation wiring. |
---

<!-- ANCHOR:verification -->
### Verification
- TypeScript: N/A (documentation and config changes only)
- Tests: N/A
- Review: Opus CONDITIONAL PASS 78/100, GPT-5.4 CONDITIONAL 82%
- Evidence: `.opencode/agent/context-prime.md` lines 34-38, 61-65, 74-87, 229-230; `AGENTS.md` lines 294-299 and 386-399; `.opencode/agent/orchestrate.md` lines 18-21
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
### Known Limitations
1. **Residual Claude-hook wording remains in non-Claude agent files.** Evidence still exists in `.codex/agents/orchestrate.toml` lines 827-835, `.codex/agents/deep-research.toml` lines 425-429, `.codex/agents/speckit.toml` lines 557-561, and several `.gemini/agents/*.md` files. This phase should treat that cleanup as incomplete follow-up work.
<!-- /ANCHOR:limitations -->
