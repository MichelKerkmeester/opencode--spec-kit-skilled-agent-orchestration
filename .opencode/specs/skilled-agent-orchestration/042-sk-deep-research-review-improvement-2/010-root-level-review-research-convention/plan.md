---
title: "Implementation Plan: Root-Level Review/Research Folder Convention"
description: "3-phase plan: shared resolver, consumer updates, documentation alignment"
status: planned
---

# Implementation Plan

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## Phase 1: Shared Path Resolver

Create `review-research-paths.cjs` in `.opencode/skill/system-spec-kit/shared/`:

```javascript
function resolveArtifactRoot(specFolder, mode) {
  // 1. Resolve specFolder to absolute path
  // 2. Walk up parent directories checking for spec.md
  // 3. Stop at the specs/ directory boundary (don't walk above it)
  // 4. The highest folder with spec.md is the root
  // 5. Build subfolder name: relative path from root to specFolder, segments joined with dashes
  // 6. Return { rootDir: path.join(root, mode), subfolder: joinedSegments || null }
}
```

Fallback: if no parent spec.md found, treat specFolder as root (standalone spec).

## Phase 2: Consumer Updates

### 2a. Reducers (2 files)
- `sk-deep-review/scripts/reduce-state.cjs:1140` — use `resolveArtifactRoot(specFolder, 'review')`
- `sk-deep-research/scripts/reduce-state.cjs:822` — use `resolveArtifactRoot(specFolder, 'research')`

### 2b. Command YAMLs (4 files)
- All 4 deep-review/deep-research YAML assets
- Add `step_resolve_artifact_root` before `phase_init` that computes `{artifact_root}`
- Replace all `{spec_folder}/review/` and `{spec_folder}/research/` with `{artifact_root}`
- Update `mkdir -p` commands

### 2c. Agent Definitions (8 files, 4 runtimes)
- Update dispatch context paths in deep-review.md and deep-research.md
- All 4 runtimes: OpenCode, Claude, Codex, Gemini
- Add note about root-level convention in the agent's output instructions

## Phase 3: Documentation

- sk-deep-review/SKILL.md: update State Packet Location section
- sk-deep-research/SKILL.md: same
- sk-deep-review/README.md: update folder structure diagram
- sk-deep-research/README.md: same
- sk-doc readme_template.md: add convention note

## Verification

1. Unit test the resolver with standalone, child, grandchild paths
2. Verify `grep -r '{spec_folder}/review/' .opencode/command/spec_kit/assets/` returns 0
3. Verify all 8 agent files reference root-level convention
4. `npx tsc --noEmit` passes
