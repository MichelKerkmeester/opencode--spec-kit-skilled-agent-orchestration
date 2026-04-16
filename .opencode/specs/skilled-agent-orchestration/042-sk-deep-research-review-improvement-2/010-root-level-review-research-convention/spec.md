---
title: "Feature Specification: Root-Level Review/Research Folder Convention"
description: "Change sk-deep-review and sk-deep-research so review/ and research/ folders are always created at the spec tree root with phase-based subfolders, never inside nested child phases."
trigger_phrases:
  - "root level review folder"
  - "review research folder convention"
  - "review at spec root"
  - "no nested review folders"
  - "consolidate review folders"
importance_tier: "important"
contextType: "implementation"
status: planned
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/010-root-level-review-research-convention"
    last_updated_at: "2026-04-16T14:00:00Z"
    last_updated_by: "claude-opus-4.6-1m"
    recent_action: "Created spec"
    next_safe_action: "Implement shared path resolver + update all consumers"
    key_files: ["spec.md", "plan.md"]
---

# Feature Specification: Root-Level Review/Research Folder Convention

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| Level | 2 |
| Priority | P1 |
| Status | Planned |
| Created | 2026-04-16 |
| Parent Packet | `042-sk-deep-research-review-improvement-2` |
| Predecessor | `009-round3-review-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. Problem & Purpose

### Problem Statement

When running `/spec_kit:deep-review` or `/spec_kit:deep-research` on a child phase inside a parent spec tree, both skills create their output folders (`review/`, `research/`) **inside the child phase folder**. In a spec tree with many nested phases (like `026-graph-and-context-optimization` with 14 phases, some 3-4 levels deep), this scatters review and research artifacts across dozens of nested directories. Finding a specific review requires knowing the exact nesting path. Manual consolidation after the fact (as we did for 026 -- moving 42 review + 18 research folders) is tedious and error-prone.

### Purpose

Make root-level placement the default: review/ and research/ folders are always created at the root of the spec tree, with phase-based subfolders inside. This matches how teams naturally look for review artifacts (check the root, not hunt through nested phases) and eliminates post-hoc consolidation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### The Rule

> Review and research folders are ALWAYS at the **root** of a spec tree, never inside nested child phases. Phase-specific subfolders are created inside the root `review/` or `research/` folder when targeting a child phase.

### Path Resolution Examples

| Target | Output Path | Subfolder |
|--------|------------|-----------|
| Standalone `040-feature/` | `040-feature/review/` | (none) |
| Parent `026/` itself | `026/review/` | (none) |
| Child `026/009-playbook/` | `026/review/009-playbook/` | `009-playbook` |
| Grandchild `026/010-search/001-fusion/` | `026/review/010-search-001-fusion/` | `010-search-001-fusion` |
| Deep child `026/010/001/001-remove/` | `026/review/010-001-001-remove/` | `010-001-001-remove` |

### In Scope

- Create a shared path resolver function (`resolveArtifactRoot`) used by all consumers
- Update sk-deep-review reducer, SKILL.md, command YAMLs, agent definitions (4 runtimes)
- Update sk-deep-research reducer, SKILL.md, command YAMLs, agent definitions (4 runtimes)
- Update READMEs for both skills
- Update sk-doc readme_template.md with the convention

### Out of Scope

- Migrating existing review/research folders in other spec trees (only 026 was done manually)
- Changing the internal structure of review/research folders (iterations/, state files, etc.)
- Modifying MCP server handlers that read review/research state

### Files to Change

| File | Change |
|------|--------|
| `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` | NEW: shared path resolver |
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Use shared resolver (line 1140) |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Use shared resolver (line 822) |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Computed artifact root in state_paths |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Same |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Same |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Same |
| `.opencode/agent/deep-review.md` | Updated dispatch paths |
| `.opencode/agent/deep-research.md` | Updated dispatch paths |
| `.claude/agents/deep-review.md` | Mirror of above |
| `.claude/agents/deep-research.md` | Mirror of above |
| `.gemini/agents/deep-review.md` | Mirror of above |
| `.gemini/agents/deep-research.md` | Mirror of above |
| `.codex/agents/deep-review.toml` | Mirror of above |
| `.codex/agents/deep-research.toml` | Mirror of above |
| `.opencode/skill/sk-deep-review/SKILL.md` | Convention documentation |
| `.opencode/skill/sk-deep-research/SKILL.md` | Convention documentation |
| `.opencode/skill/sk-deep-review/README.md` | Updated folder structure |
| `.opencode/skill/sk-deep-research/README.md` | Updated folder structure |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared path resolver determines the spec tree root | `resolveArtifactRoot('/path/to/026/010-search/001-fusion', 'review')` returns `{ rootDir: '/path/to/026/review', subfolder: '010-search-001-fusion' }` |
| REQ-002 | sk-deep-review creates review/ at spec tree root | Running deep-review on a child phase creates `{root}/review/{phase-subfolder}/` not `{child}/review/` |
| REQ-003 | sk-deep-research creates research/ at spec tree root | Same as REQ-002 for research/ |
| REQ-004 | Reducers read from the correct root-level path | `reduce-state.cjs` resolves the review/research directory using the shared resolver |
| REQ-005 | Standalone specs are unaffected | A spec with no parent still gets `{specFolder}/review/` directly |
| REQ-006 | All 4 runtime agent definitions are consistent | Claude, OpenCode, Codex, Gemini agents all describe the same path convention |
| REQ-007 | SKILL.md and README.md document the new convention | The "State Packet Location" sections describe root-level placement with subfolders |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- `resolveArtifactRoot` correctly resolves root + subfolder for standalone, child, and grandchild specs
- Deep-review on a nested phase writes iterations to `{root}/review/{phase}/iterations/`
- Deep-research on a nested phase writes iterations to `{root}/research/{phase}/iterations/`
- Reducer reads state from the root-level path, not the child-local path
- `grep -r '{spec_folder}/review/' .opencode/command/spec_kit/assets/` returns 0 hits (all replaced with computed paths)
- All 8 agent definition files (4 runtimes x 2 skills) reference the root-level convention
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. Risks & Dependencies

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Existing specs with nested review/ folders break | Resolver falls back to local `{specFolder}/review/` if root resolution fails |
| Risk | Root detection fails for unusual folder structures | Use `spec.md` presence as the parent indicator; stop at the `specs/` directory boundary |
| Dependency | 026 manual consolidation is already done | This change prevents future nesting, doesn't migrate past specs |
<!-- /ANCHOR:risks -->
