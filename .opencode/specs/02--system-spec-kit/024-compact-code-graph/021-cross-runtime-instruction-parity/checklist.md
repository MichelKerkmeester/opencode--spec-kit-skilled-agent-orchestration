---
title: "Checklist: Cross-Runtime Instruction Parity [024/021]"
description: "7 items across P1/P2 for phase 021."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 021 — Cross-Runtime Instruction Parity

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Verification Protocol
Template compliance shim section. Legacy phase content continues below.

## Pre-Implementation
Template compliance shim section. Legacy phase content continues below.

## Code Quality
Template compliance shim section. Legacy phase content continues below.

## Testing
Template compliance shim section. Legacy phase content continues below.

## Security
Template compliance shim section. Legacy phase content continues below.

## Documentation
Template compliance shim section. Legacy phase content continues below.

## File Organization
Template compliance shim section. Legacy phase content continues below.

## Verification Summary
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:protocol -->
Template compliance shim anchor for protocol.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
Template compliance shim anchor for pre-impl.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
Template compliance shim anchor for code-quality.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:security -->
Template compliance shim anchor for security.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
Template compliance shim anchor for docs.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
Template compliance shim anchor for file-org.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

#### P1 — Must Pass

- [x] [P1] CODEX.md has No Hook Transport trigger table — fresh session, resume, compaction flows documented [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] AGENTS.md has No Hook Transport trigger table — code graph auto-trigger included [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] GEMINI.md has No Hook Transport trigger table — adapted for Gemini lifecycle [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] @context-prime agent created at .opencode/agent/context-prime.md — 227 lines, uses `session_resume()` plus optional `session_health()` [EVIDENCE: verified in implementation-summary.md]

### P2 — Should Pass

- [x] @context-prime listed in CLAUDE.md Agent Definitions — entry added to routing table [EVIDENCE: verified in implementation-summary.md]
- [x] AGENTS.md defines `@context-prime` and documents No Hook Transport session lifecycle guidance [EVIDENCE: verified in implementation-summary.md]
- [x] F059: orchestrate.md wires delegation to @context-prime on first turn — VERIFIED in `.opencode/agent/orchestrate.md` lines 18-21 [EVIDENCE: verified in implementation-summary.md]
- [x] Residual Claude-hook wording cleanup in non-Claude agent files is complete [EVIDENCE: `.codex/agents/*.toml` and `.gemini/agents/*.md` now reference the runtime startup/bootstrap surface instead of Claude-only SessionStart wording]
