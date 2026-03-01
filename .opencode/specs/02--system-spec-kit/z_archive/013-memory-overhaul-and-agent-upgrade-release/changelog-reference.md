# Changelog Reference — Spec 130

<!-- SPECKIT_LEVEL: 3+ -->

> Consolidated changelog from 11 source specs across 3 tracks. Single source of truth for version numbers, dates, and file counts.

---

## Agent System Track (03--agent-orchestration)

### v2.0.2.0 — Specs 014 + 015: Command Agent Routing + Review Model-Agnostic

- **Date**: Pre-2026-02-15
- **Spec 014**: Command agent routing — 18 files, @speckit/@context/@review routing to specialized sub-agents
- **Spec 015**: Review model-agnostic — 1 file, removed hardcoded model from review agent
- **Combined impact**: Agent dispatch system established with routing rules in AGENTS.md and command configs

### v2.0.3.0 — Spec 016: Handover Haiku + Codex Agent Conversion

- **Date**: 2026-02-16
- **Files changed**: 11
- **Handover model downgrade**: Sonnet → Haiku across Copilot and Claude Code platforms
- **Codex frontmatter conversion**: 8 `.codex/agents/*.md` files from Claude Code YAML to Codex-native format
- **4 profiles added**: fast, balanced, powerful, readonly in `.codex/config.toml`
- **Sub-agent dispatch MCP**: `codex-specialized-subagents` providing `delegate` tool

---

## Spec-Kit System Track (01--system-spec-kit)

### v2.2.11.0 — README Anchor Tags (part of spec 013)

- **Date**: 2026-02-15
- **Files changed**: 60
- **Anchor pairs added**: 382 across all system-spec-kit README files
- **HVR fixes**: 47 violations corrected

### v2.2.12.0 — Comprehensive Script Audit (spec 121, audit-only)

- **Date**: 2026-02-15
- **Files changed**: 0 (documentation-only audit)
- **5 P0 blockers identified** across script ecosystem
- **Downstream**: Findings informed specs 124 and 125

### v2.2.13.0 — Spec 122: Documentation Quality Upgrade

- **Date**: 2026-02-15
- **Files changed**: ~98 (~85 documentation files)
- **LOC changed**: ~4,864
- **61 system-spec-kit docs tightened**: Superlatives, marketing language, style inconsistencies removed
- **9 skill README.md files improved**: Consistent tone and structure
- **10 new CHANGELOG.md files created**: Versioned changelog infrastructure

### v2.2.14.0 — Spec 123: Generate-Context Subfolder Fix

- **Date**: 2026-02-15
- **Files changed**: 3
- **Bug fix**: `path.isAbsolute()` not handling relative subfolder paths
- **New**: `subfolder-utils.ts` reusable path resolution utility

### v2.2.15.0 — Spec 124: Upgrade-Level Script

- **Date**: 2026-02-15
- **Files changed**: 1
- **LOC**: 1,490+
- **Features**: Multi-level upgrade (L1→L2→L3→L3+), dry-run, template-based generation, idempotent operation, JSON output
- **Architecture**: 22 functions, 6-phase pipeline, Bash 3.2+ compatible

### v2.2.16.0 — Spec 125: System-Wide Remediation

- **Date**: 2026-02-15
- **Files changed**: 3 (upgrade-level.sh + test suite + spec docs)
- **Defects fixed**: 10 (2 P0 fail-fast, 7 P1 hardening, 1 rollback feature)
- **Test suite**: 14 regression tests in `test-upgrade-level.sh`
- **New feature**: Automatic rollback on upgrade failure

### v2.2.17.0 — Specs 126 + 127: Full Spec Doc Indexing + Documentation Alignment

- **Date**: 2026-02-16
- **Files changed**: 26 total (16 code, 10 documentation)
- **Spec 126 (code)**: Schema v13, 11 document types, scoring multipliers, 2 new intents (find_spec + find_decision), spec document crawler, causal chains, feature flag (includeSpecDocs)
- **Spec 126 post-implementation hardening**: MCP server import path regression fixes (context-server.ts, attention-decay.ts), memory-index specFolder boundary filtering + incremental chain coverage, memory-save document_type/spec_level preservation in update/reinforce paths, vector-index metadata update plumbing, causal edge conflict-update semantics for stable edge IDs
- **Spec 127 (docs)**: All READMEs, SKILL.md, and reference files aligned to post-126 state
- **5th indexing source**: Spec folder documents join memory, constitutional, skill READMEs, project READMEs
- **7 intents total** (was 5): added find_spec, find_decision

### v2.2.18.0 — Spec 128: AI Auto-Populate Workflow

- **Date**: 2026-02-16
- **Files changed**: 7 (1 created, 6 modified)
- **Post-upgrade AI workflow**: Agent reads existing spec context, replaces unresolved placeholder text
- **New script**: `check-placeholders.sh` — scans for remaining bracket placeholder patterns
- **ADR-001**: AI-side workflow over script modification
- **ADR-002**: Missing context handled with "N/A" rather than fabrication

### (Pending) — Spec 129: Anchor Tags

- **Status**: Implementation pending
- **Scope**: Anchor tag conventions for templates + validation script
- **Impact**: Template files and `check-anchors.sh` script

---

## Environment Track (00--opencode-environment)

### v2.0.3.0 — README Documentation Infrastructure (spec 013)

- **Date**: 2026-02-15
- **Files changed**: 70 (+ 1 new)
- **Anchor pairs**: 469 across all `.opencode/skill/` README files
- **HVR violations fixed**: 59
- **New file**: `skill/README.md` — global Skills Library overview (302 lines)

### v2.0.4.0 — Codex Platform Integration (spec 016)

- **Date**: 2026-02-16
- **Files changed**: 11
- **4 Codex profiles**: fast, balanced, powerful, readonly (gpt-5.3 family)
- **Sub-agent dispatch MCP**: `codex-specialized-subagents`
- **Cross-platform alignment**: Codex/Claude Code/Copilot model mapping

### v2.0.5.0 — 5th Indexing Source + 7 Intents (specs 126 + 127)

- **Date**: 2026-02-16
- **Files changed**: 14 (10 modified, 4 created)
- **5-source indexing pipeline**: Added spec folder documents
- **7 intents**: Added find_spec and find_decision
- **Document-type scoring**: 11 types with multipliers

---

## Cross-Track Impact Summary

| Track | Pre-130 Version | Changelogs Covered | Source Specs |
|-------|----------------|-------------------|--------------|
| 03--agent-orchestration | v2.0.3.0 | v2.0.2.0, v2.0.3.0 | 014, 015, 016 |
| 01--system-spec-kit | v2.2.18.0 | v2.2.11.0–v2.2.18.0 + pending | 121–129 (+ 013) |
| 00--opencode-environment | v2.0.5.0 | v2.0.3.0–v2.0.5.0 | 013, 016, 126, 127 |

## Key Feature Milestones

| Feature | Introduced By | Current State |
|---------|--------------|---------------|
| 5-source indexing pipeline | Spec 126 | Active (v2.2.17.0) |
| 7 intent types | Spec 126 | Active (v2.2.17.0) |
| Schema v13 | Spec 126 | Active (v2.2.17.0) |
| Document-type scoring | Spec 126 | Active (v2.2.17.0) |
| Upgrade-level script | Spec 124 | Active (v2.2.15.0), hardened (v2.2.16.0) |
| AI auto-populate workflow | Spec 128 | Active (v2.2.18.0) |
| check-placeholders.sh | Spec 128 | Active (v2.2.18.0) |
| Codex profile system | Spec 016 | Active (v2.0.3.0 / v2.0.4.0) |
| Handover = Haiku | Spec 016 | Active (v2.0.3.0) |
| Anchor tag infrastructure | Spec 013 | Active (v2.0.3.0 / v2.2.11.0) |
| Anchor tag conventions | Spec 129 | Pending |
