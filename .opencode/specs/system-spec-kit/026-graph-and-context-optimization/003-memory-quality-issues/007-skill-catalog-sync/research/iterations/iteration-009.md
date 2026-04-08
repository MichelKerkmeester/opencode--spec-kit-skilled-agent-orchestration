---
title: "Review Iteration 009: agent definitions"
description: "Phase 7 drift audit of agent definitions against the post-Phase-6 memory-save baseline"
trigger_phrases:
  - "phase 7 review iteration 009"
  - "agent definition drift"
  - "orchestrate save command audit"
importance_tier: important
contextType: "research"
---

# Review Iteration 009: agent definitions

## Surface Audited
- `.opencode/agent/orchestrate.md`
- `.claude/agents/orchestrate.md`
- `.opencode/agent/speckit.md`
- `.claude/agents/speckit.md`
- `.opencode/agent/deep-review.md`
- `.claude/agents/deep-review.md`

## Findings

### P1 — should update; defer only with rationale
- **F009.1** — OpenCode orchestrate agent gives an incomplete context-save command after multi-agent workflows
  - **Location**: `.opencode/agent/orchestrate.md:574-577`
  - **Stale content**: ``node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]``
  - **Why stale**: The save script now expects structured JSON input plus a spec-folder target (or `--json` / `--stdin`). The shorthand omits the JSON payload step and reads like a directly runnable command.
  - **Required update**: Replace the shorthand with a canonical JSON-mode example or explicitly label it as a reminder that points to `/memory:save` or the full save workflow.

- **F009.2** — Claude orchestrate agent repeats the same incomplete context-save command
  - **Location**: `.claude/agents/orchestrate.md:563-566`
  - **Stale content**: ``node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]``
  - **Why stale**: This mirrors the same pre-JSON-primary shorthand as the OpenCode runtime agent and can mislead Claude-profile operators into skipping the required structured input.
  - **Required update**: Rewrite the handover guidance to point to the canonical JSON-mode save flow instead of the bare script-plus-path shorthand.

## Negative Cases (confirmed still accurate)
- `.opencode/agent/deep-review.md:29-31` still keeps `@deep-review` leaf-only and restricted to review artifacts.
- `.claude/agents/deep-review.md:24-26` preserves the same review-artifact-only contract for the Claude runtime.

## Confidence
**0.95** — Audited the highest-signal agent files and verified the stale handover command in both runtime variants. The rest of the sampled agent contracts remain aligned with current role boundaries.

## Cross-Surface Notes
- This is a localized operator-guidance drift, not a broad agent-contract failure. The stale shorthand appears only in the orchestrate handover section.
