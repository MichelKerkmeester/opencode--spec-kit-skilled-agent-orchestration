---
title: "Checklist: 016-Feature Catalog Code References"
description: "Verification checklist for feature catalog inline reference work."
trigger_phrases: ["checklist", "feature catalog references"]
importance_tier: "normal"
contextType: "general"
---
# Checklist: 016-Feature Catalog Code References
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:p0 -->
## P0 - Blockers

- [x] **CHK-001**: Zero inline comments reference `Sprint \d+` in non-test `.ts` files [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **CHK-002**: Zero inline comments reference `Phase \d+` in non-test `.ts` files [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **CHK-003**: Zero inline comments reference specific spec folder numbers (e.g., `spec 013`, `specs/NNN`) [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **CHK-004**: All handler files have at least one `// Feature catalog: <name>` reference [Evidence: 40 handler `.ts` files and 40 handler files containing a `// Feature catalog:` comment]
- [x] **CHK-005**: All `Feature catalog:` references use feature name only, no folder numbers [Evidence: Stable name-based wording + zero numbered-history comment matches]
<!-- /ANCHOR:p0 -->

<!-- ANCHOR:p1 -->
## P1 - Required

- [x] **CHK-006**: Core lib modules in `lib/search/`, `lib/scoring/`, `lib/cognitive/` have feature catalog references [Evidence: Additional mapped files in `mcp_server` received feature catalog comments where mapping was strong]
- [x] **CHK-007**: Shared algorithm modules have feature catalog references [Evidence: Additional mapped files in `shared` received feature catalog comments where mapping was strong]
- [x] **CHK-008**: No existing general-purpose comments were removed [Evidence: Comment-only diff audit for `mcp_server` + `shared` returned `{\"comment_only\": true}`]
- [x] **CHK-009**: References follow the `// Feature catalog: <name>` format consistently [Evidence: Implementation used stable `// Feature catalog: <feature-name>` references]
<!-- /ANCHOR:p1 -->

<!-- ANCHOR:p2 -->
## P2 - Quality

- [x] **CHK-010**: TypeScript compiles cleanly (`tsc --noEmit`) [Evidence: `npm run typecheck` in `.opencode/skill/system-spec-kit` exited 0]
- [x] **CHK-011**: Comments are concise (single line where possible) [Evidence: Stable single-line `// Feature catalog: <feature-name>` format applied]
- [x] **CHK-012**: Files implementing multiple features list all applicable catalog entries [Evidence: 91 additional annotations added across lib/cognitive, lib/search, lib/eval, lib/telemetry, lib/storage, shared/, and other modules. Cross-validation confirmed 124 unique annotation names, 0 invalid (all match catalog H3 headings)]
- [x] **CHK-013**: No feature catalog references point to non-existent feature names [Evidence: Exact-name validation against feature catalog H1 headings passed with zero invalid names]
<!-- /ANCHOR:p2 -->
