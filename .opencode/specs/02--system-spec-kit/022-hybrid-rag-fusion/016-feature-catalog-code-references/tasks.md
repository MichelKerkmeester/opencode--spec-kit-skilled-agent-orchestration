---
title: "Tasks: 016-Feature Catalog Code References"
description: "Task breakdown for feature catalog inline reference work."
trigger_phrases: ["tasks", "feature catalog references"]
importance_tier: "normal"
contextType: "general"
---
# Tasks: 016-Feature Catalog Code References
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:phase-a -->
## Phase A: Cleanup Stale References

- [x] **T-A1**: Scan all `.ts` source files for sprint number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-A2**: Scan all `.ts` source files for phase number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-A3**: Scan all `.ts` source files for spec folder number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-A4**: Review and categorize each stale reference (remove vs rewrite) [Evidence: Stale project-history references in non-test source comments were removed or reworded]
- [x] **T-A5**: Remove or rewrite all stale references [Evidence: Stale project-history references in non-test source comments were removed or reworded]
- [x] **T-A6**: Verify zero stale references remain [Evidence: Non-test source grep for stale refs returned no matches]
<!-- /ANCHOR:phase-a -->

<!-- ANCHOR:phase-b -->
## Phase B: Add Feature Catalog References

- [x] **T-B1**: Build file-to-feature catalog mapping from SOURCE FILES tables [Evidence: Mapping used for handler-wide and strong-match module annotations]
- [x] **T-B2**: Annotate handler files with `// Feature catalog: <name>` comments [Evidence: 40 handler `.ts` files and 40 handler files containing a `// Feature catalog:` comment]
- [x] **T-B3**: Annotate core lib modules with feature catalog references [Evidence: Additional mapped files in `mcp_server` received feature catalog comments where mapping was strong]
- [x] **T-B4**: Annotate shared algorithm modules with feature catalog references [Evidence: Additional mapped files in `shared` received feature catalog comments where mapping was strong]
- [x] **T-B5**: Annotate script modules with feature catalog references [Evidence: Additional mapped files in `mcp_server` received feature catalog comments where mapping was strong]
- [x] **T-B6**: Verify all references use name-only format (no numbers) [Evidence: References standardized as `// Feature catalog: <feature-name>`]
- [x] **T-B7**: TypeScript compile check (`tsc --noEmit`) [Evidence: `npm run typecheck` in `.opencode/skill/system-spec-kit` exited 0]
<!-- /ANCHOR:phase-b -->

<!-- ANCHOR:verification -->
## Verification

- [x] **T-V1**: Grep confirms zero sprint/phase/spec-number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-V2**: Grep confirms all `Feature catalog:` references use name-only format [Evidence: References standardized as `// Feature catalog: <feature-name>`]
- [x] **T-V3**: No runtime behavior changes (comment-only diff) [Evidence: Comment-only diff audit for `mcp_server` + `shared` returned `{\"comment_only\": true}`]
<!-- /ANCHOR:verification -->
