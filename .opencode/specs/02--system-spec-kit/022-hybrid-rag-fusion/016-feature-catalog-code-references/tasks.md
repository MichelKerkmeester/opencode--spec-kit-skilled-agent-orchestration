---
title: "Tasks: 016-Feature Catalog Code References"
description: "Task breakdown for feature catalog inline reference work."
trigger_phrases: ["tasks", "feature catalog references"]
importance_tier: "normal"
contextType: "general"
---
# Tasks: 016-Feature Catalog Code References

---

## Phase A: Cleanup Stale References

- [ ] **T-A1**: Scan all `.ts` source files for sprint number references in comments
- [ ] **T-A2**: Scan all `.ts` source files for phase number references in comments
- [ ] **T-A3**: Scan all `.ts` source files for spec folder number references in comments
- [ ] **T-A4**: Review and categorize each stale reference (remove vs rewrite)
- [ ] **T-A5**: Remove or rewrite all stale references
- [ ] **T-A6**: Verify zero stale references remain

## Phase B: Add Feature Catalog References

- [ ] **T-B1**: Build file-to-feature catalog mapping from SOURCE FILES tables
- [ ] **T-B2**: Annotate handler files with `// Feature catalog: <name>` comments
- [ ] **T-B3**: Annotate core lib modules with feature catalog references
- [ ] **T-B4**: Annotate shared algorithm modules with feature catalog references
- [ ] **T-B5**: Annotate script modules with feature catalog references
- [ ] **T-B6**: Verify all references use name-only format (no numbers)
- [ ] **T-B7**: TypeScript compile check (`tsc --noEmit`)

## Verification

- [ ] **T-V1**: Grep confirms zero sprint/phase/spec-number references in comments
- [ ] **T-V2**: Grep confirms all `Feature catalog:` references use name-only format
- [ ] **T-V3**: No runtime behavior changes (comment-only diff)
