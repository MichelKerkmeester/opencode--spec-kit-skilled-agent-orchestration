---
title: "Implementation Summary: Code Audit — Tooling & Scripts"
description: "17 features audited: 16 MATCH, 1 PARTIAL, 0 MISMATCH"
trigger_phrases:
  - "implementation summary"
  - "tooling & scripts"
  - "code audit"
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary: Code Audit — Tooling & Scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-tooling-and-scripts |
| **Completed** | 2026-03-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 17 tooling and scripts features were audited — tree thinning, architecture boundaries, progressive validation, dead code removal, file watching, admin CLI, migration scripts, schema validation, feature catalog references, session pipeline, constitutional manager, and JSON mode features. One PARTIAL: SPEC_FOLDER_LOCKS refactored to a new file.

### Audit Results

17 features audited: 16 MATCH, 1 PARTIAL, 0 MISMATCH.

### Per-Feature Findings

1. 16 features confirmed with behavioral accuracy
2. F05 (code standards): SPEC_FOLDER_LOCKS moved from memory-save.ts to spec-folder-mutex.ts
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit was executed by dispatching 2 Opus research agents (parallel) to read feature catalog entries and verify against source code, followed by 2 Sonnet documentation agents (parallel) to update spec folder documents with findings. All agents operated as LEAF nodes at depth 1 under single-hop orchestration.

Each feature was verified by:
1. Reading the feature catalog entry
2. Locating referenced source files in the MCP server codebase
3. Comparing catalog behavioral descriptions against actual implementation
4. Documenting findings as MATCH, PARTIAL, or MISMATCH
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Track refactored file locations as catalog maintenance items | Code evolution moves implementations; catalog references need periodic refresh |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All features audited | PASS — 17/17 features verified |
| Source files verified | PASS — all referenced files confirmed to exist on disk |
| Findings documented | PASS — per-feature findings in spec.md AUDIT FINDINGS section |
| Tasks completed | PASS — all tasks marked [x] in tasks.md |
| Checklist verified | PASS — all P0/P1 items verified in checklist.md |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **AI-intent comment conventions (AI-WHY/AI-TRACE/AI-GUARD) removed from SKILL.md but catalog still references them**
<!-- /ANCHOR:limitations -->

---

### Phase 5 Audit Additions (2026-03-26)

#### T033: Template Compliance Contract Enforcement (Catalog 16/18)

| Field | Value |
|-------|-------|
| **Catalog Entry** | `16--tooling-and-scripts/18-template-compliance-contract-enforcement.md` |
| **Verdict** | MATCH |
| **Source Files** | `references/validation/template_compliance_contract.md`, `.claude/agents/speckit.md`, `.opencode/agent/speckit.md`, `.opencode/agent/chatgpt/speckit.md`, `.codex/agents/speckit.toml`, `.gemini/agents/speckit.md`, `scripts/utils/template-structure.js` |

The catalog entry documents a 3-layer defense-in-depth system: (1) Agent knowledge with 49-line compact contracts in 5 CLI @speckit agent definitions, (2) Post-write `validate.sh --strict` validation with exit code parsing, (3) Content minimum rules with SECTION_COUNTS thresholds. All 7 referenced source files exist. The canonical structural contract reference and agent definitions contain the described embedded contracts.

#### T037: mcp_server/api/index.ts (BOTH_MISSING Audit)

| Field | Value |
|-------|-------|
| **Source File** | `mcp_server/api/index.ts` (112 lines) |
| **Classification** | BOTH_MISSING — exists in source, no catalog entry, no prior audit |
| **Verdict** | Documented as API surface |

Main barrel export module serving as the single public API surface for the MCP server. Follows ARCH-1 architecture pattern preventing consumers from reaching into `lib/` internals. Re-exports from 7 domain modules: eval, search, indexing, providers, storage, folder-discovery, entity-extraction, plus architecture metadata, shared spaces, capability flags, and performance modules. Central architectural component — no separate catalog entry needed as individual features are documented under their respective categories.

#### T042: scripts/spec/check-completion.sh (BOTH_MISSING Audit)

| Field | Value |
|-------|-------|
| **Source File** | `scripts/spec/check-completion.sh` (414 lines) |
| **Classification** | BOTH_MISSING — exists in source, no catalog entry, no prior audit |
| **Verdict** | Documented as operational script |

Spec-Kit checklist completion verification rule. Validates `checklist.md` files against priority levels (P0=critical blocker, P1=required, P2=deferrable). Enforces evidence markers (`[EVIDENCE:]`, `(verified)`, `(tested)`, `(confirmed)`). Supports text, JSON, and quiet output modes. Exit codes: 0 (complete), 1 (incomplete), 2 (error). Consumed by `validate.sh` as a modular validation rule.

#### T043: scripts/ops/runbook.sh (BOTH_MISSING Audit)

| Field | Value |
|-------|-------|
| **Source File** | `scripts/ops/runbook.sh` (170 lines) |
| **Classification** | BOTH_MISSING — exists in source, no catalog entry, no prior audit |
| **Verdict** | Documented as operational script |

Operational runbook for 4 self-healing failure classes: index-drift, session-ambiguity, ledger-mismatch, telemetry-drift. Provides deterministic remediation drills with configurable scenarios (success/escalate), max attempts, and backoff. Commands: `list`, `show <class>`, `drill <class|all>`.

#### T048: nodes/phase-system.md (BOTH_MISSING Audit)

| Field | Value |
|-------|-------|
| **Source File** | `nodes/phase-system.md` (108 lines) |
| **Classification** | BOTH_MISSING — exists in source, no catalog entry, no prior audit |
| **Verdict** | Documented as knowledge node |

Phase decomposition knowledge node documenting phase application rules (complexity score >= 25/50 AND level >= 3), 5-dimension complexity scoring, phase count mapping (25-34→2 phases, 35-44→3, 45+→4), lifecycle states (draft/active/paused/complete), and key commands (`/spec_kit:phase`, `create.sh --phase`, `validate.sh --recursive`).

#### T050: scripts/spec/create.sh (AUDIT_MISSING)

| Field | Value |
|-------|-------|
| **Source File** | `scripts/spec/create.sh` (~690 lines) |
| **Classification** | AUDIT_MISSING — in catalog (tooling category), not formally audited |
| **Verdict** | MATCH |

Creates spec folders with Level 1-3+ documentation templates using CORE + ADDENDUM v2.0 architecture. Supports normal, versioned subfolder, and phased modes. Key functions: `slugify_token()`, `create_versioned_subfolder()`, `resolve_and_validate_spec_path()`, `resolve_branch_name()`, `create_git_branch()`. Dependencies: `shell-common.sh`, `git-branch.sh`, `template-utils.sh`, `generate-description.js`. The catalog tooling entries reference this script's capabilities accurately.

#### T051: scripts/spec/validate.sh (AUDIT_MISSING)

| Field | Value |
|-------|-------|
| **Source File** | `scripts/spec/validate.sh` (~600 lines) |
| **Classification** | AUDIT_MISSING — in catalog (tooling category), not formally audited |
| **Verdict** | MATCH |

Orchestrates spec folder validation via 21 modular rule scripts. Auto-detects documentation level from `SPECKIT_LEVEL` comments, table format, or YAML frontmatter. Supports strict mode (warnings as errors), JSON output, recursive phase validation, and rule-specific configuration via `.speckit.yaml` or environment variables. Severity levels: Error (exit 2: FILE_EXISTS, PLACEHOLDERS, ANCHORS), Warn (exit 1: SECTIONS, PRIORITY_TAGS, EVIDENCE), Info (verbose only). The catalog tooling entries reference this script's capabilities accurately.

---

<!--
Post-implementation documentation for code audit phase.
Written in active voice per HVR rules.
-->
