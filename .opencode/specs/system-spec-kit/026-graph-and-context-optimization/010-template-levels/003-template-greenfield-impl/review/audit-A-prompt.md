# Audit A — `.opencode/agent/` + `.opencode/command/spec_kit/`

You are a fresh agent doing a focused audit. No conversation context.

## Goal

The user is implementing the C+F hybrid manifest-driven greenfield template-system per the design in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md`. The implementation plan + file-by-file blast radius live in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/`.

A binding constraint (ADR-005 in `002/decision-record.md`): **`Level 1/2/3/3+` is the SOLE public/AI-facing vocabulary**. Banned terms on every public/AI-facing surface: `preset`, `capability`, `kind`, `manifest`. Workflow-invariance CI test will fail the build if those leak.

## Your task: audit these directories for impact

Audit ALL files under:
- `.opencode/agent/` (11 markdown files — agent definitions read by the AI runtime)
- `.opencode/command/spec_kit/` (6 markdown command files + `assets/` subdir — slash command definitions read by the AI runtime)

For each file, classify under one of these actions and add a 1-line reason:
- **MODIFY** — must be edited because it (a) references deleted template paths (`templates/level_N`, `core`, `addendum`, `phase_parent`, `compose.sh`, `wrap-all-templates`, root `templates/{handover,debug-delegation,research,resource-map,context-index}.md`), OR (b) contains banned vocabulary (preset/capability/kind/manifest in user/AI-facing context), OR (c) describes the level-folder taxonomy in a way that becomes wrong after the manifest replaces it
- **UNTOUCHED** — no template-path or banned-vocabulary references; safe to leave
- **CITED** — referenced by spec docs but not edited

For each MODIFY, give the SPECIFIC line(s) that need editing + replacement guidance.

## Output format

Plain markdown to stdout. Single section per directory. Tables of `Path | Action | Reason | Lines (if MODIFY)`. Under 800 words. Be specific — quote exact lines.

## Constraints

- Read-only audit. Do NOT edit any file.
- Use `Read`, `Grep`, `Glob` only.
- Write your output to stdout only — the orchestrator captures it.
- Don't recommend net-new scope; only flag impact on the planned implementation.
