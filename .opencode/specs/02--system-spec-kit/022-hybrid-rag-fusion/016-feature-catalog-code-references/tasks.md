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
- [x] **T-B5**: Annotate script modules with feature catalog references [Evidence: `mcp_server/scripts` coverage check passed (3 TypeScript scripts, all 3 annotated with `// Feature catalog:`)]
- [x] **T-B6**: Verify all references use name-only format (no numbers) [Evidence: Exact-name validation against feature catalog H1 headings passed with zero invalid names]
- [x] **T-B7**: TypeScript compile check (`tsc --noEmit`) [Evidence: `npm run typecheck` in `.opencode/skill/system-spec-kit` exited 0]
<!-- /ANCHOR:phase-b -->

<!-- ANCHOR:verification -->
## Verification

- [x] **T-V1**: Grep confirms zero sprint/phase/spec-number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-V2**: Grep confirms all `Feature catalog:` references use name-only format [Evidence: Exact-name validation against feature catalog H1 headings passed with zero invalid names]
- [x] **T-V3**: No runtime behavior changes (comment-only diff) [Evidence: Comment-only diff audit for `mcp_server` + `shared` returned `{\"comment_only\": true}`]
<!-- /ANCHOR:verification -->

<!-- ANCHOR:phase-c -->
## Phase C: CHK-012 Resolution, MODULE: Alignment, and Documentation

- [x] **T-C1**: Transform `// 1. NAME` headers to `// MODULE: Name` in all 228 non-test mcp_server .ts files [Evidence: Python batch transform applied; verify_alignment_drift.py returns 0 TS-MODULE-HEADER findings]
- [x] **T-C2**: Add `// MODULE: Name` headers to 82 scripts/ .ts files [Evidence: Headers added; verify_alignment_drift.py PASS]
- [x] **T-C3**: Add `// MODULE: Name` headers to 2 headerless files (session-transition.ts, ranking-contract.ts) [Evidence: Headers added manually]
- [x] **T-C4**: Add missing `// Feature catalog:` annotations to 91 unannotated files across lib/cognitive, lib/search, lib/eval, lib/telemetry, lib/storage, lib/scoring, lib/graph, shared/ [Evidence: Cross-validation: 124 unique annotations, 0 invalid names]
- [x] **T-C5**: Create feature catalog snippet `16--tooling-and-scripts/11-feature-catalog-code-references.md` [Evidence: File created with OVERVIEW, CURRENT REALITY, SOURCE FILES, METADATA, PLAYBOOK sections]
- [x] **T-C6**: Add H3 entry in main `feature_catalog.md` under Tooling section [Evidence: Entry added with Description, Current Reality, Source Files]
- [x] **T-C7**: Add manual testing playbook scenarios NEW-135..NEW-138 [Evidence: 4 scenarios added with grep traceability, name validity, multi-feature coverage, MODULE: compliance]
- [x] **T-C8**: Update playbook TOC range to NEW-001..NEW-138 and add coverage mappings [Evidence: TOC and section heading updated, 4 coverage mapping rows added]
- [x] **T-C9**: Add Code Conventions section to mcp_server/README.md [Evidence: MODULE: header and Feature catalog annotation conventions documented]
- [x] **T-C10**: Add traceability mention to system-spec-kit/README.md [Evidence: Brief mention added in MCP Server component description]
- [x] **T-C11**: Mark CHK-012 as complete in checklist.md [Evidence: CHK-012 marked [x] with 91 annotations and 0 invalid names evidence]
- [x] **T-C12**: TypeScript compile check (`tsc --noEmit`) [Evidence: `npx tsc --noEmit` in system-spec-kit exited 0]
<!-- /ANCHOR:phase-c -->
