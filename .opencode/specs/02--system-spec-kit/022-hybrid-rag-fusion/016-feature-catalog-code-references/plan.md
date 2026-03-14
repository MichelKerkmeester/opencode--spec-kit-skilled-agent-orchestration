---
title: "Plan: 016-Feature Catalog Code References"
description: "Execution plan for adding feature catalog inline references and removing stale sprint/spec references from MCP server code."
trigger_phrases: ["plan", "feature catalog references", "inline comments"]
importance_tier: "normal"
contextType: "general"
---
# Plan: 016-Feature Catalog Code References
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:approach -->
## 1. APPROACH

Comment-only pass across all MCP server source files in two phases:

**Phase A: Cleanup** (remove stale references)
Scan all `.ts` source files for inline comments referencing specific sprint numbers, phase numbers or spec folder identifiers. Remove or neutralize these references while preserving any useful context they contain.

**Phase B: Annotate** (add feature catalog references)
Map each source file to its feature catalog entry and add concise `// Feature catalog: <feature-name>` comments at module level and key function boundaries.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:execution -->
## 2. EXECUTION STEPS

### Phase A: Cleanup stale references

| Step | Action | Details |
|------|--------|---------|
| A1 | Scan for sprint references | Grep all `.ts` files for `Sprint \d+`, `sprint \d+` patterns in comments |
| A2 | Scan for phase references | Grep for `Phase \d+`, `phase \d+` patterns in comments |
| A3 | Scan for spec folder references | Grep for `spec \d+`, `Spec \d+`, `spec-folder`, `specs/\d+` patterns in comments |
| A4 | Review each match | Determine if the comment contains useful context beyond the stale reference |
| A5 | Remove or rewrite | Remove pure-reference comments. Rewrite mixed comments to keep the useful part and drop the stale identifier |
| A6 | Verify zero matches | Re-run scans from A1-A3 to confirm zero remaining stale references |

### Phase B: Add feature catalog references

| Step | Action | Details |
|------|--------|---------|
| B1 | Build file-to-feature map | Cross-reference the feature catalog SOURCE FILES tables with the actual codebase to create a mapping of every `.ts` file to its feature catalog entry or entries |
| B2 | Annotate handler files | Add `// Feature catalog: <name>` at the top of each handler file, below imports |
| B3 | Annotate core lib modules | Add references at module level and at key exported functions |
| B4 | Annotate shared modules | Add references to shared algorithm and type modules |
| B5 | Annotate script modules | Add references where scripts implement specific feature behavior |
| B6 | Verify format consistency | Grep for all `Feature catalog:` comments and verify they use name-only format |
| B7 | Compile check | Run `tsc --noEmit` to confirm no syntax issues from comment changes |
<!-- /ANCHOR:execution -->

---

<!-- ANCHOR:dependencies -->
## 3. ORDERING AND DEPENDENCIES

```
A1-A3 (parallel scans)
  -> A4-A5 (sequential review and fix)
    -> A6 (verify cleanup)
      -> B1 (build mapping)
        -> B2-B5 (parallel annotation by directory)
          -> B6-B7 (verify)
```
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:scope-estimate -->
## 4. ESTIMATED SCOPE

| Category | File Count | Effort |
|----------|------------|--------|
| Handlers | ~20 | Small per file |
| Lib modules | ~60 | Medium (multiple features per file possible) |
| Shared modules | ~10 | Small |
| Scripts | ~15 | Small |
| **Total** | **~105** | **Comment-only, no behavioral changes** |
<!-- /ANCHOR:scope-estimate -->
