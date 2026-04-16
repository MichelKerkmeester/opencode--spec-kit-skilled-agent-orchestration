---
title: "Checklist: Root-Level Review/Research Folder Convention"
status: complete
---

# Checklist

<!-- SPECKIT_LEVEL: 2 -->

---

## P0 — Blockers

- [x] CHK-001 `review-research-paths.cjs` exists and exports `resolveArtifactRoot`
- [x] CHK-002 Standalone spec returns `{ rootDir: '{spec}/review', subfolder: null }`
- [x] CHK-003 Child spec returns correct root + subfolder (e.g., `026/review/` + `010-search-001-fusion`)
- [x] CHK-004 Grandchild spec returns correct root + subfolder with all segments joined
- [x] CHK-005 Resolver stops at `specs/` directory boundary (never walks above it)

## P1 — Required

### Reducers
- [x] CHK-010 `sk-deep-review/scripts/reduce-state.cjs` uses `resolveArtifactRoot` instead of hardcoded `path.join(specFolder, 'review')`
- [x] CHK-011 `sk-deep-research/scripts/reduce-state.cjs` uses `resolveArtifactRoot` instead of hardcoded `path.join(specFolder, 'research')`

### Command YAMLs
- [x] CHK-020 `spec_kit_deep-review_auto.yaml` documents root-level convention in state_paths
- [x] CHK-021 `spec_kit_deep-review_confirm.yaml` same
- [x] CHK-022 `spec_kit_deep-research_auto.yaml` same
- [x] CHK-023 `spec_kit_deep-research_confirm.yaml` same
- [x] CHK-024 `grep -r '{spec_folder}/review/' .opencode/command/spec_kit/assets/` returns 0 hardcoded child-local paths

### Agent Definitions (4 runtimes x 2 skills)
- [x] CHK-030 `.opencode/agent/deep-review.md` references root-level convention
- [x] CHK-031 `.opencode/agent/deep-research.md` references root-level convention
- [x] CHK-032 `.claude/agents/deep-review.md` consistent with OpenCode version
- [x] CHK-033 `.claude/agents/deep-research.md` consistent
- [x] CHK-034 `.gemini/agents/deep-review.md` consistent
- [x] CHK-035 `.gemini/agents/deep-research.md` consistent
- [x] CHK-036 `.codex/agents/deep-review.toml` consistent
- [x] CHK-037 `.codex/agents/deep-research.toml` consistent

### Documentation
- [x] CHK-040 `sk-deep-review/SKILL.md` State Packet Location describes root-level placement
- [x] CHK-041 `sk-deep-research/SKILL.md` State Packet Location describes root-level placement
- [x] CHK-042 `sk-deep-review/README.md` folder structure updated
- [x] CHK-043 `sk-deep-research/README.md` folder structure updated
- [x] CHK-044 `sk-doc readme_template.md` mentions convention

## P2 — Verification

- [x] CHK-050 `npx tsc --noEmit` passes (no type errors from resolver integration)
- [x] CHK-051 No remaining `{spec_folder}/review/` hardcoded paths in command assets
- [x] CHK-052 All 8 agent definition files are cross-runtime consistent
