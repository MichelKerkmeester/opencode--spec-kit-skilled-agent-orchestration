---
title: "Implementation Summary: Copilot Startup Hook Wiring [031/030]"
description: "Phase 031 repairs the live Copilot sessionStart wiring, aligns runtime detection with actual repo hook config, and truth-syncs packet 030 accordingly."
trigger_phrases:
  - "phase 031 implementation summary"
  - "copilot startup hook summary"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary: Copilot Startup Hook Wiring

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-copilot-startup-hook-wiring |
| **Completed** | 2026-04-04 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 031 closes the real Copilot runtime gap that remained after Phase 004. The repo already had a working Copilot session-prime hook binary, but the tracked `sessionStart` config still pointed at the Superset notifier. This phase replaces that wiring with a repo-local startup wrapper, preserves Superset notifications as best-effort fan-out, and updates runtime detection plus docs to match the actual repo state.

### Packet Deliverables

- Repo-local `sessionStart` wrapper at `.github/hooks/scripts/session-start.sh`
- Repo-local JSON-safe notifier wrapper at `.github/hooks/scripts/superset-notify.sh`
- Updated `.github/hooks/superset-notify.json` routing for `sessionStart`, `sessionEnd`, `userPromptSubmitted`, and `postToolUse`
- Dynamic Copilot hook detection in `runtime-detection.ts`
- New Copilot wiring test plus refreshed runtime-detection/fallback tests
- Parent packet, Phase 004, and runtime-detection doc truth-sync
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed the Copilot report directly:

1. Confirm the live Copilot gap was in the hook registration path, not in the session-prime hook itself.
2. Replace `sessionStart` with a repo-local wrapper that emits the shared startup banner.
3. Preserve Superset notifications through a second wrapper that stays JSON-safe.
4. Make Copilot runtime detection check `.github/hooks/*.json` for `sessionStart`.
5. Add tests and update the packet/docs so the runtime story stays truthful.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use a wrapper instead of calling Superset directly from `sessionStart` | Copilot needs the startup banner on stdout, while Superset notifications should stay silent |
| Keep Superset forwarding best-effort | Startup parity should not depend on a user-local helper being installed |
| Make Copilot detection dynamic | The repo can now truthfully say Copilot is hook-enabled here without hardcoding that for every repo |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts tests/copilot-hook-wiring.vitest.ts` | PASS |
| `jq empty .github/hooks/superset-notify.json` | PASS |
| `./.github/hooks/scripts/session-start.sh <<< '{}'` | PASS - emitted the shared startup banner and snapshot note |
| `./.github/hooks/scripts/superset-notify.sh sessionEnd <<< '{}'` | PASS - returned `{}` |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin --recursive --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Copilot repo wiring is local to this repository, not universal across all repos.** Other repositories still need their own `.github/hooks/*.json` setup if they want the same startup banner behavior.
2. **Superset remains optional.** The wrapper preserves best-effort forwarding, but the startup banner does not depend on Superset being installed.
3. **Codex remains bootstrap-based.** Phase 031 does not change Codex’s hookless startup model.
<!-- /ANCHOR:limitations -->

