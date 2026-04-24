---
title: "Resource Map: Skill-Advisor Hook Improvements [014-skill-advisor-hook-improvements]"
description: "Lean, scannable catalog of every packet-owned path analyzed, updated, created, or cited while delivering the packet-02-derived skill-advisor implementation for threshold parity, rendering invariants, MCP surface normalization, and durable telemetry."
trigger_phrases:
  - "skill-advisor hook improvements resource map"
  - "014 resource map"
  - "026/009/014 files touched"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements"
    last_updated_at: "2026-04-24T12:44:39+02:00"
    last_updated_by: "codex-gpt-5"
    recent_action: "Aligned the resource map to the governing implementation packet lineage"
    next_safe_action: "Track the remaining packet-014 review gaps outside RG-016"
    blockers: []
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.0 -->

A resource map is a **lean** companion to the implementation summary. Where the summary narrates *what was done and why*, the resource map simply lists **every file path touched** during the packet — grouped by category and easy to scan.

It is supported at every documentation level (Level 1 through Level 3+) and is **optional but recommended**. Use it when the set of files spans more than a handful of paths, when audits or reviewers need a quick map of the blast radius, or when a phase child needs to hand a clean path ledger to its successor.

Keep this file **paths-only** — no narrative, no decisions, no test evidence. Those belong in the implementation summary, decision record, or checklist.

---

## Summary

- **Total references**: 49
- **By category**: READMEs=1, Documents=2, Commands=0, Agents=0, Skills=14, Specs=17, Scripts=5, Tests=4, Config=6, Meta=0
- **Missing on disk**: 1
- **Scope**: all packet-owned implementation docs, runtime surfaces, verification artifacts, upstream packet references, research inputs, and Codex success-path evidence cited for `026/009/014-skill-advisor-hook-improvements`
- **Generated**: 2026-04-24T12:44:39+02:00

> Action vocabulary: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> Status vocabulary: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> Omit categories that have zero entries. Keep tables tight — one path per row.

---

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md` | Updated | OK | Public `workspaceRoot`, `effectiveThresholds`, and `thresholdSemantics` contract. |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Updated | OK | Hook/operator contract for OpenCode threshold parity and shared brief rendering. |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Analyzed | OK | Runtime brief parity matrix cited from the packet scope. |

---

## 3. Commands

> `.opencode/command/**` and any runtime-specific command surfaces.

No command files were created, updated, or analyzed for this packet.

---

## 4. Agents

> `.opencode/agent/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`.

No agent definition files were created, updated, or analyzed for this packet.

---

## 5. Skills

> `.opencode/skill/**` including skill manifests, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts` | Updated | OK | Shared threshold builder used by OpenCode and Codex. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts` | Updated | OK | Shared advisor brief rendering invariants. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts` | Updated | OK | Durable diagnostics and accepted/corrected/ignored outcome capture. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts` | Updated | OK | Public workspace and effective-threshold outputs. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts` | Updated | OK | Threshold semantics and telemetry surfacing. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts` | Updated | OK | MCP advisor schema normalization. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Updated | OK | Durable diagnostics sink wiring. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Updated | OK | Shared brief path and durable diagnostics parity. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` | Updated | OK | Codex fallback parity with the shared builder. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` | Updated | OK | Durable diagnostics sink wiring. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` | Updated | OK | Durable diagnostics sink wiring. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | Analyzed | OK | Existing package build blocker cited in `implementation-summary.md`. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Analyzed | OK | Existing package build blocker cited in `implementation-summary.md`. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts` | Analyzed | OK | Existing package build blocker cited in `implementation-summary.md`. |

---

## 6. Specs

> `.opencode/specs/**` — spec folders, phase children, packet docs, research, review, scratch.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md` | Updated | OK | Governing spec now authorizes the packet-02-derived implementation in this folder. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/plan.md` | Updated | OK | Implementation contract for `014-F-001` through `014-F-007`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/tasks.md` | Updated | OK | Task ledger for `T-001` through `T-015`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/implementation-summary.md` | Created | OK | Delivery summary for the spec-authorized implementation packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/checklist.md` | Created | OK | Verification checklist aligned to the implementation requirements in `spec.md`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/resource-map.md` | Created | OK | This path ledger. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/applied/` | Cited | MISSING | Packet docs referenced this directory as the intended per-task evidence ledger, but the current checkout does not retain a packet-local `applied/` set. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/spec.md` | Analyzed | OK | Parent packet context for the hook-daemon parity track. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/` | Cited | OK | Prior hook-surface baseline referenced from the packet spec. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/008-skill-advisor-plugin-hardening/` | Cited | OK | Prior OpenCode/plugin hardening baseline. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/009-skill-advisor-standards-alignment/` | Cited | OK | Prior standards-alignment baseline. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md` | Cited | OK | Upstream parity-closure fix referenced as implementation baseline. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/014-skill-advisor-hook-improvements-pt-02/research.md` | Cited | OK | Packet-02 synthesis consumed by `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/014-skill-advisor-hook-improvements-pt-02/iterations/` | Cited | OK | Ten iteration reports for the packet-02 research run. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/014-skill-advisor-hook-improvements-pt-02/deep-research-dashboard.md` | Cited | OK | Packet-02 convergence dashboard. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/014-skill-advisor-hook-improvements-pt-02/deep-research-strategy.md` | Cited | OK | Packet-02 strategy surface. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/013-014-pt-02-merged-synthesis.md` | Cited | OK | `Bucket B` merged synthesis used as plan input. |
## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/plugins/spec-kit-skill-advisor.js` | Updated | OK | OpenCode bridge threshold default parity. |
| `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs` | Updated | OK | OpenCode native render and threshold contract. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py` | Analyzed | OK | Scripted fallback surface named in the packet spec. |
| `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js` | Validated | OK | Built Codex hook artifact exercised during direct smoke verification. |
| `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/prompt-wrapper.js` | Validated | OK | Built Codex fallback artifact exercised during direct smoke verification. |

---

## 8. Tests

> Test files, fixtures, snapshots. Group unit, integration, and vitest/pytest paths here.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts` | Updated | OK | OpenCode threshold/render parity regressions. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts` | Validated | OK | Validator/output parity suite exercised in `T-003`, `T-008`, `T-009`, and `T-014`. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts` | Analyzed | OK | Success-path Codex hook evidence now cited for live brief injection and prompt-safe CLI smoke output. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts` | Analyzed | OK | Success-path Codex prompt-wrapper evidence now cited for rendered advisor brief injection when native hooks are unavailable. |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`, `description.json`, `graph-metadata.json`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/description.json` | Updated | OK | Packet description metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/graph-metadata.json` | Updated | OK | Packet graph metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/014-skill-advisor-hook-improvements-pt-02/deep-research-config.json` | Cited | OK | Packet-02 research runner configuration. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/014-skill-advisor-hook-improvements-pt-02/findings-registry.json` | Cited | OK | Findings registry consumed by `plan.md`, `tasks.md`, and `checklist.md`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/014-skill-advisor-hook-improvements-pt-02/deep-research-state.jsonl` | Cited | OK | Iteration state cited by the verification checklist. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/013-014-pt-02-merged-findings.json` | Cited | OK | Merged findings companion to the `Bucket B` synthesis. |

---

## 10. Meta

> Repository-wide or governance artifacts: workspace instructions, runtime guidance docs, root README, license, changelog.

No repository-wide meta artifacts were created, updated, or packet-owned for this implementation.

---
