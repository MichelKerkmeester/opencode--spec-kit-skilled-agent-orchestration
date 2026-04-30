---
title: "Verification Checklist: Merge sk-code-web + sk-code-full-stack into sk-code"
description: "P0/P1/P2 verification items for 054-sk-code-merger. Verification Date: TBD."
trigger_phrases: ["sk-code merger checklist", "054 checklist", "sk-code verification"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/054-sk-code-merger"
    last_updated_at: "2026-04-30T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored P0/P1/P2 checklist tied to REQ ids in spec.md"
    next_safe_action: "Mark items [x] with evidence as work completes"
    blockers: []
    completion_pct: 0
---
# Verification Checklist: Merge sk-code-web + sk-code-full-stack into sk-code

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-021)
- [x] CHK-002 [P0] Technical approach defined in plan.md and approved external plan file
- [x] CHK-003 [P0] Dependencies identified (skill_advisor.py, explicit.ts, generate-context.js, validate.sh)
- [x] CHK-004 [P0] Plan-agent cross-validation complete (3 risks surfaced + folded in)
- [x] CHK-005 [P1] User-resolved decisions captured (name=sk-code, folder=054, placeholders=templated stubs)

---

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:new-skill-structure -->
## New Skill Structure (sk-code/)

- [ ] CHK-010 [P0] `.opencode/skill/sk-code/SKILL.md` exists with merged routing pseudocode (stack detection → intent → load level)
- [ ] CHK-011 [P0] SKILL.md frontmatter valid (name, description, allowed-tools, version 1.0.0)
- [ ] CHK-012 [P0] `sk-code/README.md` exists with activation, structure inventory, troubleshooting
- [ ] CHK-013 [P0] `sk-code/CHANGELOG.md` exists with 1.0.0 baseline
- [ ] CHK-014 [P0] `sk-code/graph-metadata.json` exists with siblings/enhances edges
- [ ] CHK-015 [P0] `sk-code/description.json` exists with keywords, importance_tier, derived metadata
- [ ] CHK-016 [P1] `sk-code/_router/` contains 4 extracted reference docs (stack_detection, intent_classification, resource_loading, phase_lifecycle)

## Web Content (LIVE branch)

- [ ] CHK-020 [P0] `sk-code/references/web/implementation/` matches `sk-code-web/references/implementation/` byte-for-byte (12 files)
- [ ] CHK-021 [P0] `sk-code/references/web/debugging/debugging_workflows.md` present (preserved from web; NOT lifted to universal/)
- [ ] CHK-022 [P0] `sk-code/references/web/verification/verification_workflows.md` present (preserved from web; NOT lifted to universal/)
- [ ] CHK-023 [P0] `sk-code/references/web/{deployment,performance,standards}/` mirrored from sk-code-web
- [ ] CHK-024 [P0] `sk-code/assets/web/{checklists,patterns,integrations}/` mirrored from sk-code-web
- [ ] CHK-025 [P0] `sk-code/scripts/{minify-webflow,verify-minification,test-minified-runtime}.mjs` present (no path edits required)

## Universal Namespace (TIGHT scope per Plan-agent critique)

- [ ] CHK-030 [P0] `sk-code/references/universal/error_recovery.md` exists (decision tree only, browser-context bits stripped)
- [ ] CHK-031 [P0] `sk-code/references/universal/code_quality_standards.md` exists (P0/P1/P2 model only)
- [ ] CHK-032 [P0] `sk-code/references/universal/code_style_guide.md` exists (language-agnostic parts only)
- [ ] CHK-033 [P0] `sk-code/references/universal/multi_agent_research.md` exists (copied from web/research/multi_agent_patterns.md)
- [ ] CHK-034 [P0] `universal/` does NOT contain debugging_workflows.md or verification_workflows.md (those stay in web/)
- [ ] CHK-035 [P0] `sk-code/assets/universal/{checklists,patterns}/` contains validation_patterns.js, wait_patterns.js, debugging_checklist.md, verification_checklist.md

## Placeholder Scaffolding

- [ ] CHK-040 [P0] `sk-code/references/react/` has _placeholder.md + 7 stub files (matches sk-code-full-stack frontend/react count)
- [ ] CHK-041 [P0] `sk-code/references/nodejs/` has _placeholder.md + 4 stub files
- [ ] CHK-042 [P0] `sk-code/references/go/` has _placeholder.md + 11 stub files
- [ ] CHK-043 [P0] `sk-code/references/react-native/` has _placeholder.md + 7 stub files
- [ ] CHK-044 [P0] `sk-code/references/swift/` has _placeholder.md + 6 stub files
- [ ] CHK-045 [P0] Each stub file frontmatter contains `status: placeholder, canonical_source, source_version: sk-code-full-stack@1.1.0, populated: false`
- [ ] CHK-046 [P0] Each stack folder's `_placeholder.md` body explains migration steps and points at canonical sk-code-full-stack location
- [ ] CHK-047 [P1] `sk-code/assets/{react,nodejs,go,react-native,swift}/_placeholder.md` exists (5 files)

---

<!-- /ANCHOR:new-skill-structure -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-050 [P0] All new SKILL.md, README.md, CHANGELOG.md pass markdown lint (no broken anchors, valid YAML frontmatter)
- [ ] CHK-051 [P0] No console errors when reading new skill files
- [ ] CHK-052 [P1] Code style: snake_case identifiers in SKILL.md pseudocode (consistent with web's TASK_SIGNALS)
- [ ] CHK-053 [P1] Frontmatter follows existing skill conventions (name, description, allowed-tools, version)

---

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:cross-repo-updates -->
## Cross-Repo Reference Updates

### Tier 1: Skill Advisor

- [ ] CHK-060 [P0] `skill_advisor.py` contains `DEPRECATED_SKILLS = frozenset({"sk-code-web", "sk-code-full-stack"})` with early-return guard
- [ ] CHK-061 [P0] `skill_advisor.py` PHRASE_BOOSTS retargeted to sk-code (3 entries from full-stack)
- [ ] CHK-062 [P0] `skill_advisor.py` TOKEN_BOOSTS retargeted to sk-code (17+ entries from web + full-stack stack keywords)
- [ ] CHK-063 [P0] `explicit.ts` contains `DEPRECATED_SKILLS` constant + early-return guard
- [ ] CHK-064 [P0] `explicit.ts` 18 lane mappings retargeted from sk-code-web → sk-code
- [ ] CHK-065 [P0] `lexical.ts` 1 entry updated
- [ ] CHK-066 [P0] `lane-attribution.test.ts` fixtures updated and tests pass

### Tier 2: graph-metadata.json (8 files)

- [ ] CHK-070 [P0] `sk-code/graph-metadata.json` defines siblings (sk-code-opencode, sk-code-review) and enhances (sk-code-review)
- [ ] CHK-071 [P1] `sk-code-web/graph-metadata.json` has deprecated: true, superseded_by: sk-code, advisor_weight: 0
- [ ] CHK-072 [P1] `sk-code-full-stack/graph-metadata.json` has same deprecation keys
- [ ] CHK-073 [P1] `sk-code-review/graph-metadata.json` enhanced_by retargeted to [sk-code]
- [ ] CHK-074 [P1] `sk-code-opencode/graph-metadata.json` sibling weights retargeted
- [ ] CHK-075 [P1] `mcp-chrome-devtools/graph-metadata.json` enhances retargeted to sk-code
- [ ] CHK-076 [P1] `mcp-figma/graph-metadata.json` enhances retargeted to sk-code
- [ ] CHK-077 [P1] `system-spec-kit/.../skill_advisor/graph-metadata.json` routing edges retargeted

### Tier 3: Sister SKILL.md cross-refs (7 files)

- [ ] CHK-080 [P1] sk-code-review/SKILL.md (2 refs updated)
- [ ] CHK-081 [P1] sk-code-opencode/SKILL.md (2 refs updated)
- [ ] CHK-082 [P1] mcp-chrome-devtools/SKILL.md (1 ref updated)
- [ ] CHK-083 [P1] cli-claude-code/SKILL.md (2 refs updated)
- [ ] CHK-084 [P1] cli-codex/SKILL.md (1 ref updated)
- [ ] CHK-085 [P1] cli-gemini/SKILL.md (1 ref updated)
- [ ] CHK-086 [P1] sk-improve-prompt/SKILL.md (1 ref updated)

### Tier 4: Root instruction files (4 files)

- [ ] CHK-090 [P0] AGENTS.md (line ~161) updated
- [ ] CHK-091 [P0] CLAUDE.md (line ~161) updated
- [ ] CHK-092 [P1] AGENTS_example_fs_enterprises.md updated (3 refs)
- [ ] CHK-093 [P1] AGENTS_Barter.md updated (mirror per memory rule)

### Tier 5: Agent definitions (3 files)

- [ ] CHK-100 [P1] .opencode/agent/deep-review.md updated
- [ ] CHK-101 [P1] .claude/agents/deep-review.md updated
- [ ] CHK-102 [P1] .gemini/agents/deep-review.md updated

### Tier 6: Documentation (~10 files)

- [ ] CHK-110 [P1] .opencode/skill/README.md updated
- [ ] CHK-111 [P1] mcp-chrome-devtools/README.md + examples/README.md updated
- [ ] CHK-112 [P1] Top-level README.md updated
- [ ] CHK-113 [P2] system-spec-kit references audited + updated where actionable
- [ ] CHK-114 [P2] Observability reports get deprecation note (no historical metric rewrites)

### Tier 7: Old skill deprecation (2 files, additive only)

- [ ] CHK-120 [P0] sk-code-web/SKILL.md frontmatter has appended `deprecated: true`, `superseded_by: sk-code`, `advisor_weight: 0` (body untouched)
- [ ] CHK-121 [P0] sk-code-full-stack/SKILL.md same
- [ ] CHK-122 [P0] `git diff` on legacy SKILL.md confirms only frontmatter additions, no body changes
- [ ] CHK-123 [P0] Legacy `references/`, `assets/`, `scripts/` folders unchanged (verify via `git status`)

---

<!-- /ANCHOR:cross-repo-updates -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-130 [P0] All acceptance criteria met (REQ-001 through REQ-007)
- [ ] CHK-131 [P0] Manual trigger tests pass (T122-T126):
  - "Fix Webflow animation flicker" → sk-code (WEB)
  - "Add a React component to my Next.js app" → sk-code (REACT placeholder)
  - "Help me debug a Go service" → sk-code (GO placeholder)
  - "Audit OpenCode plugin loader" → sk-code-opencode (unchanged)
  - "Review this PR" → sk-code-review (unchanged)
- [ ] CHK-132 [P0] Web smoke test passes: minify-webflow.mjs from new location produces identical output
- [ ] CHK-133 [P1] Edge cases tested (multi-marker projects, no marker, deprecated-skill direct invocation)
- [ ] CHK-134 [P1] Bare `sk-code` name does NOT collide with siblings (sk-code-review, sk-code-opencode) — exact-name match verified

---

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-140 [P0] No hardcoded secrets in any new file
- [ ] CHK-141 [P0] No XSS/injection risk surfaces (all content is markdown + structured JSON)
- [ ] CHK-142 [P2] Auth/authz N/A (skill content, no runtime auth)

---

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-150 [P1] spec.md, plan.md, tasks.md, checklist.md, decision-record.md synchronized
- [ ] CHK-151 [P1] implementation-summary.md authored after work complete
- [ ] CHK-152 [P1] /memory:save executed for session continuity
- [ ] CHK-153 [P2] description.json keywords match SKILL.md frontmatter triggers

---

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-160 [P1] Temp files (if any) in 054-sk-code-merger/scratch/ only
- [ ] CHK-161 [P1] scratch/ cleaned before completion (or contents documented as kept artifacts)

---

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 35 | [ ]/35 |
| P1 Items | 34 | [ ]/34 |
| P2 Items | 6 | [ ]/6 |

**Verification Date**: TBD

---

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-200 [P0] All architecture decisions documented in decision-record.md (ADR-001..ADR-005)
- [ ] CHK-201 [P1] All ADRs have status (Accepted)
- [ ] CHK-202 [P1] Alternatives documented with rejection rationale (placeholder strategy alternatives, deprecation strategy alternatives)
- [ ] CHK-203 [P2] Migration path documented (placeholder → live for non-web stacks; users follow `_placeholder.md` instructions)

---

## L3+: Performance Verification

- [ ] CHK-210 [P1] Skill advisor scoring round-trip stays under 100ms per prompt (NFR-P01)
- [ ] CHK-211 [P2] No measurable latency regression vs. baseline

---

## L3+: Deployment Readiness

- [ ] CHK-220 [P0] Rollback procedure documented in plan.md §7 (Enhanced Rollback)
- [ ] CHK-221 [P1] Smoke test runbook present (web stack manual test in checklist + plan)
- [ ] CHK-222 [P2] No CI changes required — skill registry auto-discovers via filesystem scan + advisor :confirm

---

## L3+: Compliance Verification

- [ ] CHK-230 [P1] Security review N/A (no executable runtime path; markdown + JSON only)
- [ ] CHK-231 [P1] Dependency licenses N/A (no new packages)
- [ ] CHK-232 [P2] Internal: respects "don't overwrite the 2 skills" user directive — additive frontmatter, no body changes

---

## L3+: Documentation Verification

- [ ] CHK-240 [P0] All spec documents synchronized (spec.md ↔ plan.md ↔ tasks.md ↔ checklist.md ↔ decision-record.md)
- [ ] CHK-241 [P1] sk-code/SKILL.md describes the routing model usable by external readers
- [ ] CHK-242 [P1] sk-code/README.md covers setup, troubleshooting, structure inventory
- [ ] CHK-243 [P2] User-facing documentation updated where applicable (root README.md, AGENTS.md)

---

## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User (michelkerkmeester) | Owner | [ ] Approved | |
| Plan-agent (cross-validation) | Architecture review | [x] Approved | 2026-04-30 |
| Validation suite | Automated | [ ] Approved | |

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified.
P0 must complete before claiming done. P1 needs user approval to defer. P2 optional.
-->

<!-- /ANCHOR:arch-verify -->
