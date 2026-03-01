---
title: "Phase Package Plan: Documentation Alignment [007-documentation-alignment/plan]"
description: "Synchronize all user-facing documentation with the post-Wave 1–3 codebase. Every README, SKILL.md, INSTALL_GUIDE, memory command, and scripts doc should accurately reflect the c..."
trigger_phrases:
  - "phase"
  - "package"
  - "plan"
  - "documentation"
  - "alignment"
  - "007"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3 -->
# Phase Package Plan: Documentation Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-plan | v1.1 -->

---

<!-- ANCHOR:objective -->
## 1. Objective

Synchronize all user-facing documentation with the post-Wave 1–3 codebase. Every README, SKILL.md, INSTALL_GUIDE, memory command, and scripts doc should accurately reflect the current module inventory, feature flags, architecture, and tool signatures.
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:technical-context -->
## 2. Technical Context

Waves 1–3 added the following to the MCP server:

**New source modules (5):**
- `lib/contracts/retrieval-trace.ts` — typed ContextEnvelope, RetrievalTrace, DegradedModeContract
- `lib/search/artifact-routing.ts` — 9 artifact classes with per-type retrieval strategies
- `lib/search/adaptive-fusion.ts` — intent-aware weighted RRF with dark-run mode
- `lib/storage/mutation-ledger.ts` — append-only audit trail with SQLite triggers
- `lib/telemetry/retrieval-telemetry.ts` — 4-dimension retrieval telemetry

**New feature flags (2):**
- `SPECKIT_ADAPTIVE_FUSION` (opt-out: unset/empty/`true` = enabled, `false` = disabled) — controls adaptive fusion
- `SPECKIT_EXTENDED_TELEMETRY` (default: on) — enables extended telemetry

**Handler integration:**
- `handlers/memory-search.ts` — now captures retrieval telemetry
- `handlers/memory-context.ts` — now captures mode metrics

**Additional modules also undocumented from earlier phases:**
- `lib/cognitive/pressure-monitor.ts`, `lib/cognitive/rollout-policy.ts`
- `lib/search/causal-boost.ts`, `lib/search/session-boost.ts`
- `lib/config/skill-ref-config.ts`
- `lib/extraction/extraction-adapter.ts`, `lib/extraction/redaction-gate.ts`
- `scripts/extractors/contamination-filter.ts`, `scripts/extractors/quality-scorer.ts`
- `scripts/memory/validate-memory-quality.ts`
- `scripts/evals/` directory (9 scripts), `scripts/kpi/` directory
<!-- /ANCHOR:technical-context -->

---

<!-- ANCHOR:architecture -->
## Architecture

The package follows the existing documentation architecture and updates content in place:

- Top-level docs (`README.md`, `SKILL.md`, MCP `README.md`, `INSTALL_GUIDE.md`) provide primary discovery paths.
- Folder READMEs under `mcp_server/lib/`, `mcp_server/handlers/`, `mcp_server/tests/`, and `scripts/` provide implementation-level inventory.
- Memory command docs under `.opencode/command/memory/` define user-facing command contracts.
- ANCHOR blocks remain stable to preserve memory indexing behavior.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:implementation -->
## Implementation

Execution remains documentation-only and is split into two phases to keep verification deterministic.

## Phase 1 - Core Documentation Alignment

- Update top-level docs and subfolder READMEs with current module inventories and feature flags.
- Add missing folder READMEs for `contracts`, `telemetry`, and `extraction`.
- Update architecture diagrams and key capability sections where gaps were identified.

## Phase 2 - Command and Script Documentation Alignment

- Update memory command docs to match current MCP tool signatures and behavior notes.
- Update scripts documentation inventories for extractors, memory tooling, and tests.
- Run final stale-reference and evidence validation across all updated docs.
<!-- /ANCHOR:implementation -->

---

<!-- ANCHOR:ai-execution-protocol -->
## AI Execution Protocol

### Pre-Task Checklist

1. Confirm scope is limited to package `007-documentation-alignment` and listed in-scope files.
2. Confirm no runtime code implementation claims are introduced in doc updates.
3. Confirm module counts and file references are verified before checklist completion marks are kept.
4. Confirm ANCHOR open/close pairs remain intact after each edit.

### Execution Rules

| Rule ID | Rule |
|---------|------|
| TASK-SEQ-01 | Complete Phase 1 documentation alignment before Phase 2 command/script updates. |
| TASK-SCOPE-01 | Keep changes documentation-only and within package 007 scope. |
| TASK-EVID-01 | Every completed P0/P1 checklist item must include explicit evidence formatting. |

### Status Reporting Format

Use: `Status: <in-progress|blocked|complete> | Group: <A-F> | Evidence: <path or pending> | Next: <next action>`

### Blocked Task Protocol

When blocked, mark item as `[B]`, describe missing source evidence, identify owner, and define clear unblock criteria before continuing.
<!-- /ANCHOR:ai-execution-protocol -->

---

<!-- ANCHOR:execution-model -->
## 3. Execution Model

Work is organized into 6 groups. Groups A–C are high priority (user-facing docs). Groups D–F are medium-to-lower priority (internal docs).

| Group | Scope | Files | Priority | Est. Duration |
|-------|-------|-------|----------|---------------|
| A | Top-level docs | 4 files (README, SKILL.md, MCP README, INSTALL_GUIDE) | P0 | 2–3 hours |
| B | Library subfolder README updates | 8 existing READMEs | P1 | 1–2 hours |
| C | New folder READMEs | 3 new READMEs (contracts, telemetry, extraction) | P1 | 30 min |
| D | Memory commands | 5 command files | P1 | 1–2 hours |
| E | Scripts READMEs | 4 files | P2 | 30 min |
| F | Tests/Handlers READMEs | 2 files | P2 | 20 min |

**Parallelization:** Groups A–F are independent. All 6 groups can run concurrently with dedicated agents.

**Pattern:** Each update follows: Read current → Glob for actual files → Diff listed vs actual → Edit to add missing entries and correct counts → Verify ANCHOR tags preserved.
<!-- /ANCHOR:execution-model -->

---

<!-- ANCHOR:quality-gates -->
## 4. Quality Gates

### Definition of Ready
- Gap analysis complete (performed 2026-02-19)
- All new source modules verified to exist via Glob
- Existing README patterns understood (ANCHOR format, HVR structure)

### Definition of Done
- Every module count in every README matches Glob results
- Every new module appears in its parent README and top-level READMEs
- Both feature flags documented in feature flag tables
- Architecture diagrams updated to show new pipeline stages
- No stale references (every mentioned file exists)
- ANCHOR tags preserved in all edited files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:milestones -->
## 5. Milestones

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 | Group A complete — top-level docs updated |
| M2 | Groups B+C complete — all lib READMEs updated/created |
| M3 | Groups D+E complete — commands and scripts docs updated |
| M4 | Group F complete — all remaining docs updated |
| M5 | Verification pass — all counts and references validated |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:risk-register -->
## 6. Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| ANCHOR tags broken during edit | Broken memory indexing for affected doc | Preserve all ANCHOR open/close tags; verify after edit |
| Module count goes stale again after next change | Recurring maintenance burden | Add a "Last verified" date to module count tables |
| README format inconsistency across folders | Reduced readability, indexing gaps | Follow existing README patterns exactly; don't introduce new formats |
| Concurrent edits from other agents | Merge conflicts | This phase runs independently; no code changes |
<!-- /ANCHOR:risk-register -->

---

<!-- ANCHOR:dependencies -->
## 7. Dependencies

- Depends on Waves 1–3 completion (packages 004, 005, 006)
- No upstream blockers
- No code changes required
- Feeds updated documentation into memory index for future retrieval
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:governance -->
## 8. Governance Notes

- Level 3 package planning
- `decision-record.md` present for documentation approach decisions
- All edits are documentation-only; no code risk
<!-- /ANCHOR:governance -->

---

<!-- ANCHOR:status -->
## 9. Planning Status

Complete. All 26 tasks implemented, verified, and remediated. CHK-336 (P2) closed with evidence in the updated "Last Verified" rows across skill, MCP server, and lib README tables.
<!-- /ANCHOR:status -->
