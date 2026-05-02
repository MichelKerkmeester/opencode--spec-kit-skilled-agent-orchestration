---
title: "Implementation [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/plan]"
description: "Implements the bounded Phase 031 runtime/config follow-on that makes live Copilot sessionStart surface the shared startup banner and aligns runtime detection with the repo hook config."
trigger_phrases:
  - "phase 031 plan"
  - "copilot startup hook wiring plan"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Copilot Startup Hook Wiring

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell, JSON, TypeScript, Markdown |
| **Framework** | Packet 030 startup/runtime surfaces plus Copilot repo hooks |
| **Storage** | Existing packet 030 folder plus root `.github/hooks/` and `mcp_server` runtime files |
| **Testing** | `jq empty`, targeted `vitest`, shell smoke runs, strict packet validation |

### Overview
This phase closes the Copilot live startup gap by routing `sessionStart` through a repo-local shell wrapper that emits the shared startup banner and then fans out to Superset silently. The phase also makes Copilot runtime detection repo-config-driven so hook metadata and fallback guidance match reality in this repo and in no-config repos.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Copilot live report identifies the actual wiring gap
- [x] Existing hook binary behavior is verified
- [x] Current repo hook config is inspected directly

### Definition of Done
- [x] Copilot `sessionStart` uses a tracked repo-local wrapper
- [x] Superset fan-out still exists as best-effort behavior
- [x] Runtime detection/tests are truth-synced
- [x] Packet and related docs are updated
- [x] Strict packet validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Repo-local startup wrapper plus dynamic runtime detection

### Key Components
- **`.github/hooks/superset-notify.json`**: Copilot repo hook registration surface
- **`session-start.sh`**: startup banner wrapper for `sessionStart`
- **`superset-notify.sh`**: JSON-safe best-effort notifier wrapper for non-banner events
- **`hooks/copilot/session-prime.ts`**: existing shared startup banner source
- **`runtime-detection.ts`**: repo-config-driven Copilot hook policy detection
- **Packet truth-sync**: parent packet, Phase 004, and runtime-detection docs

### Data Flow
Copilot `sessionStart` reads stdin once, passes it to the repo-local startup wrapper, the wrapper emits the shared startup banner via the built Copilot hook, then silently invokes the Superset notifier helper. Runtime detection separately scans `.github/hooks/*.json` for `sessionStart` entries so the hookPolicy reflects whether this repo actually exposes a startup hook.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Hook Wiring
- [x] Add repo-local hook wrapper scripts
- [x] Route Copilot `sessionStart` through the startup wrapper
- [x] Keep non-startup hooks JSON-safe through the notifier wrapper

### Phase 2: Runtime Detection and Tests
- [x] Make Copilot hook policy dynamic
- [x] Cover both enabled and missing-config branches
- [x] Add a dedicated Copilot hook wiring test

### Phase 3: Truth-Sync and Verification
- [x] Create Phase 031 packet docs
- [x] Update the parent packet and Phase 004 wording
- [x] Update runtime-detection playbook and feature docs
- [x] Run targeted verification and strict packet validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Wiring Tests | Repo hook JSON and shell wrapper output | `tests/copilot-hook-wiring.vitest.ts` |
| Runtime Detection | Copilot enabled/no-config branches plus cross-runtime fallback | `tests/runtime-detection.vitest.ts`, `tests/cross-runtime-fallback.vitest.ts` |
| Shell Validation | Hook config JSON and wrapper smoke runs | `jq empty`, direct wrapper execution |
| Typecheck | Runtime code remains valid | `npx tsc --noEmit` |
| Packet Validation | Parent and Phase 031 docs stay validator-clean | strict recursive `validate.sh` |
<!-- /ANCHOR:testing -->

---

### AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm Copilot changes stay bounded to startup wiring and runtime detection.
- Confirm the shared startup banner content is reused instead of forked.
- Confirm parent packet wording stays evidence-backed.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `HOOK-SCOPE` | Touch only Copilot repo hook config, wrapper scripts, runtime detection/tests, and packet-related docs. |
| `TRUTH-FIRST` | Keep Copilot capability claims tied to actual repo wiring, not intent. |
| `VALIDATE-LAST` | Finish with targeted tests, shell smoke runs, and strict packet validation. |

### Status Reporting Format
- `in-progress`: describe the active runtime or packet sync pass.
- `blocked`: record the failing hook/test/validator output.
- `completed`: record changed files and final verification status.

### Blocked Task Protocol
- If a hook wrapper fails, keep the wiring task open until direct shell smoke runs pass.
- If docs still contain stale Copilot wording, keep the truth-sync task open until searches return clean.

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `dist/hooks/copilot/session-prime.js` | Internal | Green | Startup wrapper cannot emit the shared banner |
| Existing Superset helper | Optional external | Green | Best-effort fan-out would be skipped but startup banner can still work |
| Runtime detection tests | Internal | Green | Dynamic hookPolicy claims could drift from code |
| Spec Kit validator | Internal | Green | Phase closeout cannot be proven clean |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Copilot startup wrapper blocks the session, emits invalid output, or runtime detection becomes misleading.
- **Procedure**: Restore the previous hook JSON, remove the repo-local wrappers, revert Copilot runtime-detection changes, and rerun the targeted tests plus strict packet validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Hook Wiring ──► Runtime Detection + Tests ──► Packet Truth-Sync + Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Hook Wiring | Copilot report + current config inspection | Detection/test alignment |
| Runtime Detection + Tests | Repo-local wrapper design | Doc truth-sync |
| Packet Truth-Sync + Validation | Runtime verification evidence | Phase closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Hook Wiring | Medium | Completed in this runtime/config pass |
| Runtime Detection + Tests | Medium | Completed in this runtime/config pass |
| Packet Truth-Sync + Validation | Medium | Completed in this closeout pass |
| **Total** | | **Phase 031 complete** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Current Copilot hook JSON inspected
- [x] Existing hook binary verified directly
- [x] Verification commands selected before implementation

### Rollback Procedure
1. Restore the old `sessionStart` hook command in `.github/hooks/superset-notify.json`.
2. Remove the repo-local wrapper scripts.
3. Revert Copilot runtime-detection and test updates.
4. Re-run targeted tests and packet validation.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Restore config/scripts/docs from version control and rerun verification
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Copilot Live Report ──► Repo Hook Wiring Repair ──► Dynamic Runtime Detection
                                        │
                                        └──► Packet + Playbook Truth-Sync ──► Clean Validation
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Repo Hook Wiring | Current hook config + built Copilot hook | Live startup banner path | Runtime detection truth |
| Runtime Detection | Repo hook JSON contract | Truthful hookPolicy metadata | Playbook/docs sync |
| Packet Truth-Sync | Runtime evidence + detection changes | Clean phase docs | Final validation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Route Copilot `sessionStart` through the repo-local startup wrapper** - completed - CRITICAL
2. **Align runtime detection and tests to the dynamic Copilot hook policy** - completed - CRITICAL
3. **Truth-sync packet/docs and rerun validation** - completed - CRITICAL

**Total Critical Path**: One bounded startup/runtime repair pass
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Hook wiring repaired | Copilot `sessionStart` routes through the repo-local startup wrapper | Completed |
| M2 | Detection/tests aligned | Copilot hookPolicy is dynamic and covered by tests | Completed |
| M3 | Packet truth-synced | Parent and child docs match the new repo hook reality | Completed |
| M4 | Phase validated | Targeted tests and strict packet validation pass | Completed |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Use a Repo-Local Wrapper Instead of Pointing Copilot Directly at the Superset Notifier

**Status**: Accepted

**Context**: The Superset notifier path preserved notifications but swallowed the shared startup banner.

**Decision**: Route `sessionStart` through a repo-local wrapper that emits the banner first and then fans out to Superset silently.

