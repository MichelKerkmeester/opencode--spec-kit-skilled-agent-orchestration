---
title: "Verification Checklist: Documentation Alignment [007-documentation-alignment/checklist]"
description: "checklist document for 007-documentation-alignment."
trigger_phrases:
  - "verification"
  - "checklist"
  - "documentation"
  - "alignment"
  - "007"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3 -->
# Verification Checklist: Documentation Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-checklist | v1.1 -->

---

<!-- ANCHOR:verification-protocol -->
## Verification Protocol

| Priority | Handling |
|----------|----------|
| P0 | Hard blocker — must complete |
| P1 | Required unless explicitly deferred |
| P2 | Optional optimization |
<!-- /ANCHOR:verification-protocol -->

---

<!-- ANCHOR:p0-blockers -->
## P0 — Blockers

- [x] CHK-301 Skill README module count matches Glob result — feature flags added, counts verified [EVIDENCE: `.opencode/skill/system-spec-kit/README.md`; verification method logged in `spec.md` and `tasks.md`]
- [x] CHK-302 MCP Server README module count matches Glob result — 63 modules confirmed [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md`; verification method logged in `spec.md` and `tasks.md`]
- [x] CHK-303 Both feature flags (`SPECKIT_ADAPTIVE_FUSION`, `SPECKIT_EXTENDED_TELEMETRY`) documented in: Skill README, SKILL.md, MCP Server README, INSTALL_GUIDE (4/4) [EVIDENCE: `.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`]
- [x] CHK-304 Search architecture diagram in Skill README shows artifact routing and adaptive fusion stages [EVIDENCE: `.opencode/skill/system-spec-kit/README.md`]
- [x] CHK-305 Search architecture diagram in MCP Server README shows artifact routing and adaptive fusion stages [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md`]
- [x] CHK-306 lib/ directory listing in MCP Server README includes contracts/, telemetry/, extraction/ folders [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md`]
<!-- /ANCHOR:p0-blockers -->

---

<!-- ANCHOR:p1-required -->
## P1 — Required

- [x] CHK-310 `lib/search/README.md` lists all 12 modules (was 8, added artifact-routing, adaptive-fusion, causal-boost, session-boost) [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md`]
- [x] CHK-311 `lib/storage/README.md` lists all 8 modules (was 7, added mutation-ledger) [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md`]
- [x] CHK-312 `lib/cognitive/README.md` lists all 10 modules (was 8, added pressure-monitor, rollout-policy) [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md`]
- [x] CHK-313 `lib/config/README.md` lists all 3 modules (was 2, added skill-ref-config) [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md`]
- [x] CHK-314 `lib/contracts/README.md` exists and documents retrieval-trace.ts exports [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md`]
- [x] CHK-315 `lib/telemetry/README.md` exists and documents retrieval-telemetry.ts exports [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md`]
- [x] CHK-316 `lib/extraction/README.md` exists and documents extraction-adapter.ts and redaction-gate.ts [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md`]
- [x] CHK-317 `lib/README.md` lists all 18+ module categories — 63 total modules, 19 folders [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/README.md`]
- [x] CHK-318 SKILL.md Key Concepts section mentions artifact routing, adaptive fusion, mutation ledger, retrieval telemetry [EVIDENCE: `.opencode/skill/system-spec-kit/SKILL.md`]
- [x] CHK-319 INSTALL_GUIDE features section documents new capabilities [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`]
- [x] CHK-320 `mcp_server/tests/README.md` lists all new test files — 24 previously unlisted files added [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/tests/README.md`]
- [x] CHK-321 Memory command `context.md` documents adaptive fusion behavior [EVIDENCE: `.opencode/command/memory/context.md`]
- [x] CHK-322 Memory command `manage.md` documents feature flag context [EVIDENCE: `.opencode/command/memory/manage.md`]
- [x] CHK-323 Memory command `save.md` documents mutation-ledger tracking [EVIDENCE: `.opencode/command/memory/save.md`]
- [x] CHK-324 Memory command `learn.md` documents updated consolidation pipeline [EVIDENCE: `.opencode/command/memory/learn.md`]
- [x] CHK-325 Memory command `continue.md` documents recovery context changes [EVIDENCE: `.opencode/command/memory/continue.md`]
- [x] CHK-326 All ANCHOR tags preserved in every edited file (broken closing related anchor tag in Skill README fixed) [EVIDENCE: ANCHOR validation and remediation notes in `tasks.md` and `plan.md`]
- [x] CHK-327 No stale references — all file paths verified by Glob [EVIDENCE: verification method documented in `spec.md` and checklist Evidence section]
- [x] CHK-328 Post-completion drift addendum closed: legacy `embedding-provider` path remains historical-only, deferred placeholder suite is rewritten to current architecture, and three deferred API/startup suites are now active [EVIDENCE: `../dead-code-unused-analysis.md`, `../test-results.md`, `../implementation-summary.md`, `decision-record.md` ADR-007-005, `tasks.md` T050]
<!-- /ANCHOR:p1-required -->

---

<!-- ANCHOR:p2-optional -->
## P2 — Optional

- [x] CHK-330 `scripts/README.md` lists evals/ and kpi/ directories
- [x] CHK-331 `scripts/extractors/README.md` lists contamination-filter.ts and quality-scorer.ts
- [x] CHK-332 `scripts/memory/README.md` lists validate-memory-quality.ts
- [x] CHK-333 `scripts/tests/README.md` lists test-memory-quality-lane.js
- [x] CHK-334 `mcp_server/handlers/README.md` notes telemetry integration
- [x] CHK-335 `mcp_server/hooks/README.md` verified current (no changes needed)
- [x] CHK-336 "Last verified" dates added to module count tables in skill, MCP server, and lib statistics docs [EVIDENCE: `.opencode/skill/system-spec-kit/README.md` (By The Numbers), `.opencode/skill/system-spec-kit/mcp_server/README.md` (By The Numbers), `.opencode/skill/system-spec-kit/mcp_server/lib/README.md` (Key Statistics)]
<!-- /ANCHOR:p2-optional -->

---

<!-- ANCHOR:evidence -->
## Evidence

- Spec: `spec.md`
- Plan: `plan.md`
- Tasks: `tasks.md`
- Gap analysis: performed 2026-02-19 via 5 parallel research agents
- Implementation: 10 write agents dispatched 2026-02-19 (all completed)
- Remediation: 3 fixes applied post-verification (module counts, feature flags in Skill README, broken ANCHOR tag)
- Post-completion addendum: embedding-provider lifecycle captured with root + package evidence links, drift closure recorded after `embeddings.vitest.ts` rewrite, and deferred API/startup suites closure synced to root verification totals
- CHK-336 closure: "Last Verified" rows are now present in all required module-count/stat tables (`.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/lib/README.md`)
- Final verification: automated pass confirmed all P0 and P1 items pass
- Verification method: Glob file counts vs README stated counts
<!-- /ANCHOR:evidence -->
