---
title: "Verification Checklist: sk-code multi-stack scaffolding"
description: "P0/P1/P2 verification gate. Phases A → B → C → D all complete; final memory save pending."
trigger_phrases: ["056 checklist", "sk-code multi-stack verification"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/056-sk-code-fullstack-branch"
    last_updated_at: "2026-04-30T17:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "057 merged into 056"
    next_safe_action: "Run /memory:save"
    blockers: []
    completion_pct: 95
---
# Verification Checklist: sk-code multi-stack scaffolding

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence required**: Each `[x]` mark MUST include a one-line evidence note.

---

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-020). Evidence: `wc -l spec.md` ≈ 220 lines, all 8 P0 + 3 P1 + 1 P2 requirements present.
- [x] CHK-002 [P0] Technical approach defined in plan.md (Phases A-D, dependencies). Evidence: plan.md §4 IMPLEMENTATION PHASES enumerates all 4 phases with task lists.
- [x] CHK-003 [P0] tasks.md authored with T001-T070 covering every plan step. Evidence: 70 tasks across 3 numbered Phase headings (Setup, Implementation, Verification).
- [x] CHK-004 [P1] Absorbed-packet lineage documented. Evidence: spec.md §1 METADATA `Absorbed packet` row references `057-sk-code-multi-stack-placeholders`.

---

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Folder structure: `references/nextjs/` exists; `references/react/` does NOT exist. Evidence: `ls .opencode/skill/sk-code/references/` shows webflow/, nextjs/, go/, router/, universal/.
- [x] CHK-011 [P0] Asset directories: `assets/nextjs/{checklists,patterns,integrations}/` and `assets/go/{checklists,patterns}/` populated.
- [x] CHK-012 [P0] All 33 paths in SKILL.md `RESOURCE_MAPS[NEXTJS|GO]` (and matching WEBFLOW) resolve. Evidence: path-existence sweep returns 33/33, 0 missing.
- [x] CHK-013 [P0] Every md stub declares `status: stub`. Evidence: `grep -rL "status: stub" references/{nextjs,go} assets/{nextjs,go} --include="*.md"` returns empty.
- [x] CHK-014 [P0] Every code stub declares `Status: stub` in comment header. Evidence: `grep -rL "Status: stub" assets/{nextjs,go}/patterns/` returns empty.
- [x] CHK-015 [P0] No fenced code blocks in markdown stubs (cross_stack_pairing exempt). Evidence: `grep -rE '^\`\`\`' references/{nextjs,go} --include="*.md"` returns empty.
- [x] CHK-016 [P0] No `kerkmeester` references anywhere in `sk-code/`. Evidence: `grep -rl "kerkmeester" .opencode/skill/sk-code/` returns empty.
- [x] CHK-017 [P0] No `<!--.*ANCHOR:.*-->` HTML comments anywhere in `sk-code/`. Evidence: `grep -rln '<!--.*ANCHOR:' .opencode/skill/sk-code/` returns 0.
- [x] CHK-018 [P1] Webflow content untouched. Evidence: `git diff -- references/webflow assets/webflow scripts/` shows only the perl pass replacing REACT → NEXTJS in stack-name strings — no functional Webflow changes.
- [x] CHK-019 [P1] cross_stack_pairing.md structure intact post-restructure. Evidence: 10 numbered sections (OVERVIEW + Topology/API/Schema/JWT/CORS/Pagination/Deploy/Drift + RELATED RESOURCES); 16K bytes preserved.

---

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] sk-doc validate_document.py on 9 reference files: all `valid: true`, 0 issues.
- [x] CHK-021 [P0] sk-doc validate_document.py on 2 universal asset checklists: all `valid: true`, 0 issues.
- [x] CHK-022 [P0] sk-doc validate_document.py on SKILL.md: `valid: true`, 0 issues.
- [x] CHK-023 [P0] Advisor smoke test "implement Next.js App Router page with vanilla-extract" → sk-code wins (score 0.857).
- [x] CHK-024 [P0] Advisor smoke test "build a gin handler with sqlc and Postgres" → sk-code wins (score 0.78).
- [x] CHK-025 [P0] Advisor smoke test (regression) "fix Webflow animation flicker" → sk-code wins (score 0.842).
- [x] CHK-026 [P1] Path-existence sweep returns 0 missing across 33 NEXTJS + GO paths.
- [ ] CHK-027 [P1] Memory save POST-SAVE QUALITY REVIEW shows no HIGH issues. (Pending — user runs `/memory:save` after merge.)

---

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, API keys, or credentials in any stub or reference file.
- [x] CHK-031 [P0] No external URLs in stubs except `example.com` placeholders or canonical doc URLs.
- [x] CHK-032 [P1] No fictional library version pins (`motion@12.23.12` ❌ → `motion v12` ✓).

---

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] SKILL.md §2 SMART ROUTING follows sk-doc canonical pattern (single Python pseudocode block, sk-doc helper names).
- [x] CHK-041 [P0] SKILL.md §5 REFERENCES section present (Core References → Templates and Assets → Build/Verification Scripts).
- [x] CHK-042 [P0] SKILL.md sections numbered 1-10 sequentially without gaps.
- [x] CHK-043 [P1] sk-code/README.md describes three-stack model honestly.
- [x] CHK-044 [P1] sk-code/changelog/v1.3.0.0.md exists with version 1.3.0 entry summarizing the work.
- [x] CHK-045 [P1] description.json `lastUpdated` ≥ 2026-04-30; `placeholder_fill_packet` field references `056-sk-code-fullstack-branch` (post-merge).
- [x] CHK-046 [P1] graph-metadata.json `derived.last_updated_at` ≥ 2026-04-30; `placeholder_fill_packet` field references `056-sk-code-fullstack-branch` (post-merge).
- [x] CHK-047 [P2] DQI scores ≥ good for all 9 reference docs. Evidence: 95, 93, 96, 93, 92 (router); 88, 90, 93, 91 (universal). All ≥ 88; 7 of 9 are excellent.

---

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Spec folder structure: spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md / description.json / graph-metadata.json present.
- [x] CHK-051 [P1] No leftover `scratch/` directory in 056 packet (cleared during merge).
- [x] CHK-052 [P1] No new feature branch created (stay-on-main rule); current branch = main.
- [x] CHK-053 [P1] Absorbed packet 057 deleted (rm -rf during merge).

---

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 22/22 |
| P1 Items | 14 | 13/14 (CHK-027 memory save pending) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-04-30.
<!-- /ANCHOR:summary -->
