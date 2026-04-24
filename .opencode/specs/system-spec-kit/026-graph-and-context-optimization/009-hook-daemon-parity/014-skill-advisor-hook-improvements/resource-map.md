---
title: "Resource Map: Skill-Advisor Hook Improvements [014-skill-advisor-hook-improvements]"
description: "Factual path ledger for packet 014 skill-advisor hook improvement artifacts."
trigger_phrases:
  - "skill-advisor hook improvements resource map"
  - "014 resource map"
  - "026/009/014 files touched"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements"
    last_updated_at: "2026-04-24T13:01:31+02:00"
    last_updated_by: "codex-gpt-5"
    recent_action: "Regenerated the resource map as a path-only ledger and corrected research-lineage references"
    next_safe_action: "Track the remaining packet-014 remediation findings outside RG-037"
    blockers: []
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

## Summary

- **Total references**: 49
- **By category**: READMEs=1, Skills=16, Specs=23, Scripts=5, Tests=4
- **Missing on disk**: 1
- **Scope**: packet-owned implementation docs, runtime surfaces, verification artifacts, and canonical research inputs cited for `026/009/014-skill-advisor-hook-improvements`
- **Generated**: 2026-04-24T13:01:31+02:00

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).

---

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md` | Updated | OK | Skill-advisor package README. |

---

## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Updated | OK | Hook reference. |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Analyzed | OK | Runtime hook-system reference. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts` | Updated | OK | Shared skill-advisor brief builder. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts` | Updated | OK | Shared brief renderer. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts` | Updated | OK | Skill-advisor telemetry helpers. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts` | Updated | OK | `advisor_recommend` handler. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts` | Updated | OK | `advisor_validate` handler. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts` | Updated | OK | MCP advisor schemas. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Updated | OK | Claude hook adapter. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Updated | OK | Codex hook adapter. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` | Updated | OK | Codex prompt-wrapper adapter. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` | Updated | OK | Copilot hook adapter. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` | Updated | OK | Gemini hook adapter. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | Analyzed | OK | Claude hook-state support. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Analyzed | OK | Shared payload helper. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts` | Analyzed | OK | Code-graph context helper cited by packet docs. |

---

## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md` | Updated | OK | Packet spec. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/plan.md` | Updated | OK | Packet plan. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/tasks.md` | Updated | OK | Packet task ledger. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/implementation-summary.md` | Created | OK | Packet implementation summary. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/checklist.md` | Created | OK | Packet checklist. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/resource-map.md` | Updated | OK | Packet resource map. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/applied/` | Cited | MISSING | Packet-local applied directory reference. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/spec.md` | Analyzed | OK | Parent packet spec. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/` | Cited | OK | Related sibling packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/008-skill-advisor-plugin-hardening/` | Cited | OK | Related sibling packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/009-skill-advisor-standards-alignment/` | Cited | OK | Related sibling packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md` | Cited | OK | Upstream parity remediation report. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02/research.md` | Cited | OK | Packet-02 research synthesis. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02/iterations/` | Cited | OK | Packet-02 iteration reports directory. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02/deep-research-dashboard.md` | Cited | OK | Packet-02 research dashboard. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02/deep-research-strategy.md` | Cited | OK | Packet-02 research strategy. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/013-014-review-gap-merged-synthesis.md` | Cited | OK | Canonical merged review-gap synthesis. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/013-014-review-gap-merged-findings.json` | Cited | OK | Canonical merged review-gap findings. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/description.json` | Updated | OK | Packet description metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/graph-metadata.json` | Updated | OK | Packet graph metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02/deep-research-config.json` | Cited | OK | Packet-02 research config. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02/findings-registry.json` | Cited | OK | Packet-02 findings registry. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02/deep-research-state.jsonl` | Cited | OK | Packet-02 research state. |

---

## 7. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/plugins/spec-kit-skill-advisor.js` | Updated | OK | OpenCode plugin bridge entrypoint. |
| `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs` | Updated | OK | OpenCode helper bridge. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py` | Analyzed | OK | Fallback advisor CLI. |
| `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js` | Validated | OK | Built Codex hook artifact. |
| `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/prompt-wrapper.js` | Validated | OK | Built Codex prompt-wrapper artifact. |

---

## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts` | Updated | OK | Plugin-bridge compatibility test. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts` | Validated | OK | `advisor_validate` handler test. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts` | Analyzed | OK | Codex hook test. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts` | Analyzed | OK | Codex prompt-wrapper test. |
