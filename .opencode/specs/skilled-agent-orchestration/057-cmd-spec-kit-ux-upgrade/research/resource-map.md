---
title: "Resource Map: packet 057 SPAR-Kit synthesis"
description: "Lean ledger of external and internal paths cited in research.md for packet 057."
trigger_phrases:
  - "057 resource map"
  - "spar kit synthesis resource map"
importance_tier: "normal"
contextType: "research"
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

## Summary

- **Total references**: 64
- **By category**: External=29, Internal Commands=12, Internal Agents=4, Internal Skills=13, Internal Meta=3, Internal Templates=1, Internal Scripts=2
- **Missing on disk**: not checked in this synthesis pass
- **Scope**: every external and internal path cited in `research.md`
- **Generated**: 2026-05-01T11:03:48+02:00

## External Surface

### Root Docs and Package

| Path | Action | Status | Note |
| --- | --- | --- | --- |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/README.md` | Cited | OK | Lifecycle framing |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/ROADMAP.md` | Cited | OK | Iteration context |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/technicalBrief.md` | Cited | OK | External architecture context |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/AGENTS.md` | Cited | OK | External governance context |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/package.json` | Cited | OK | Package surface |

### Installer and Policy Scripts

| Path | Action | Status | Note |
| --- | --- | --- | --- |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/bin/spar-kit.mjs` | Cited | OK | CLI entrypoint |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/cli.mjs` | Cited | OK | Target flag UX |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/install-engine.mjs` | Cited | OK | Install orchestration |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/repo-bootstrap.mjs` | Cited | OK | Managed-block and asset policies |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/pack-prep.mjs` | Cited | OK | Template asset sync |

### Installed Instruction and Target Assets

| Path | Action | Status | Note |
| --- | --- | --- | --- |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/AGENTS.md` | Cited | OK | Small boot pointer |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/CLAUDE.md` | Cited | OK | Small boot pointer |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/.spar-kit/.local/tools.yaml` | Cited | OK | Local tool ledger |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/default.json` | Cited | OK | Default asset policy |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/codex.json` | Cited | OK | Codex target policy |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/opencode.json` | Cited | OK | OpenCode target policy |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/claude.json` | Cited | OK | Claude target policy |

### SPAR Skills

| Path | Action | Status | Note |
| --- | --- | --- | --- |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-init/SKILL.md` | Cited | OK | Init and tool-check flow |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-specify/SKILL.md` | Cited | OK | Specify phase boundary and tone |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-plan/SKILL.md` | Cited | OK | Plan phase and follow-up budget |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-act/SKILL.md` | Cited | OK | Act phase boundary |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-retain/SKILL.md` | Cited | OK | Retain phase boundary |

### Templates, Specs, and Persona Research

| Path | Action | Status | Note |
| --- | --- | --- | --- |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/templates/spec.md` | Cited | OK | Minimal spec template |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/templates/plan.md` | Cited | OK | Minimal plan template |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/specs/completed/tools-check/tools-check_spec.md` | Cited | OK | Tool-check contract |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/Personas/Personas.md` | Cited | OK | Six-persona source |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/research/personasRetrospective/spar.specify.recommendations.md` | Cited | OK | Specify tone recommendations |
| `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/research/personasRetrospective/spar.plan.recommendations.md` | Cited | OK | Plan follow-up recommendations |

## Internal Surface

### Meta and Instruction Files

| Path | Action | Status | Note |
| --- | --- | --- | --- |
| `AGENTS.md` | Cited | OK | Global/project instruction contract |
| `.codex/AGENTS.md` | Cited | OK | Codex voice and runtime instructions |
| `CLAUDE.md` | Cited | OK | Sibling instruction surface |

### Skills and References

| Path | Action | Status | Note |
| --- | --- | --- | --- |
| `.opencode/skill/system-spec-kit/SKILL.md` | Cited | OK | Spec-folder and validation contract |
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Cited | OK | Internal architecture context |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Cited | OK | Prompt-time routing contract |
| `.opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md` | Cited | OK | Template validation contract |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Cited | OK | Native MCP schema truth |
| `.opencode/skill/sk-deep-research/SKILL.md` | Cited | OK | Deep-research workflow contract |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Cited | OK | External MCP discovery model |

### Templates and Scripts

| Path | Action | Status | Note |
| --- | --- | --- | --- |
| `.opencode/skill/system-spec-kit/templates/` | Cited | OK | Internal template tree |
| `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` | Cited | OK | Template composer |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Cited | OK | Strict validation gate |
| `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh` | Cited | OK | Phase-parent and validator helpers |

### Commands

| Path | Action | Status | Note |
| --- | --- | --- | --- |
| `.opencode/command/spec_kit/README.txt` | Cited | OK | Command catalog |
| `.opencode/command/spec_kit/plan.md` | Cited | OK | Plan/intake surface |
| `.opencode/command/spec_kit/implement.md` | Cited | OK | Implement surface |
| `.opencode/command/spec_kit/complete.md` | Cited | OK | Complete surface |
| `.opencode/command/spec_kit/resume.md` | Cited | OK | Resume surface |
| `.opencode/command/spec_kit/deep-research.md` | Cited | OK | Deep-research command |
| `.opencode/command/spec_kit/deep-review.md` | Cited | OK | Deep-review command |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | Cited | OK | Clarification cap evidence |
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | Cited | OK | Implementation YAML evidence |
| `.opencode/command/memory/README.txt` | Cited | OK | Memory command catalog |
| `.opencode/command/create/agent.md` | Cited | OK | Create command surface |
| `.opencode/command/create/assets/create_feature_catalog_confirm.yaml` | Cited | OK | Create YAML evidence |
| `.opencode/command/doctor/skill-advisor.md` | Cited | OK | Advisor diagnostic command |

### Agents

| Path | Action | Status | Note |
| --- | --- | --- | --- |
| `.opencode/agent/README.txt` | Cited | OK | Agent catalog |
| `.opencode/agent/orchestrate.md` | Cited | OK | Orchestration role contract |
| `.opencode/agent/improve-prompt.md` | Cited | OK | Prompt-improvement role contract |
| `.opencode/agent/ultra-think.md` | Cited | OK | Reasoning-lens distinction |
