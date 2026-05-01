# Audit B — `system-spec-kit/SKILL.md` + `system-spec-kit/README.md`

You are a fresh agent doing a focused audit. No conversation context.

## Goal

The user is implementing the C+F hybrid manifest-driven greenfield template-system per the design in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md`. The implementation plan + file-by-file blast radius live in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/`.

A binding constraint (ADR-005 in `002/decision-record.md`): **`Level 1/2/3/3+` is the SOLE public/AI-facing vocabulary**. Banned terms on every public/AI-facing surface: `preset`, `capability`, `kind`, `manifest`. Workflow-invariance CI test will fail the build if those leak.

## Your task: audit these two files for impact

Audit:
- `.opencode/skill/system-spec-kit/SKILL.md` (991 lines — the skill definition the AI loads)
- `.opencode/skill/system-spec-kit/README.md` (1147 lines — the skill maintainer doc)

For each, identify EVERY:

1. **Reference to deleted paths**: `templates/level_N/`, `templates/core/`, `templates/addendum/`, `templates/phase_parent/`, root-level `templates/handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md`, `compose.sh`, `wrap-all-templates.{ts,sh}`. List line numbers + exact quoted text.

2. **References to taxonomy that becomes wrong**: phrases like "CORE + ADDENDUM v2.2 architecture", "spec-core + level2-verify + level3-arch", "compose.sh writes level outputs", anything describing the build-time composition that won't exist post-implementation.

3. **Banned vocabulary in user/AI-facing context**: `preset`, `capability`, `kind`, `manifest` (case-insensitive). NOTE: SKILL.md is AI-facing; README.md is maintainer-facing (banned terms allowed there per ADR-005).

4. **Content that stays correct**: Level 1/2/3/3+ taxonomy itself stays. `--level N` flag stays. Validator flow stays. `<!-- SPECKIT_LEVEL: N -->` markers stay. Don't flag these.

For each finding, classify the file as:
- **MODIFY** — has at least one reference that becomes wrong post-implementation
- **UNTOUCHED** — no impact

For SKILL.md (AI-facing) MODIFY items, propose replacement language that preserves Level vocabulary while removing references to deleted paths.

For README.md (maintainer-facing) MODIFY items, the new manifest design should be DOCUMENTED, not censored — propose new architecture description for maintainers.

## Output format

Plain markdown to stdout. Two sections (SKILL.md, README.md). Per-finding rows. Under 1200 words. Be specific — line numbers + exact quoted text + replacement guidance.

## Constraints

- Read-only audit. Do NOT edit any file.
- Use `Read`, `Grep`, `Glob` only.
- Write your output to stdout only.
- Don't recommend net-new scope.
