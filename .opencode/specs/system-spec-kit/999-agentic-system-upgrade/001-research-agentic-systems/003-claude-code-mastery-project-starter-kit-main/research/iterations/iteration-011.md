# Iteration 011 — Instruction Layering And Personal Overrides

## Research question
Should `system-spec-kit` keep treating nearly all operator behavior as repository-level governance, or does the external repo's global/project/local split suggest a simpler instruction architecture?

## Hypothesis
The external repo will show a cleaner separation between universal rules, project rules, and user preferences, while `system-spec-kit` will still need a stronger repo-wide source of truth because it coordinates multiple runtimes and governed workflows.

## Method
Compared the external repo's global `CLAUDE.md`, project `CLAUDE.md`, personal `CLAUDE.local.md`, and personal hook override example to this repo's root `CLAUDE.md`, Claude-specific supplement, and Claude hook config.

## Evidence
- The external repo explicitly separates universal security rules into `global-claude-md/CLAUDE.md`, project rules into checked-in `CLAUDE.md`, and personal preferences into gitignored `CLAUDE.local.md`, with a matching `.claude/settings.local.json.example` for user-local hook overrides. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/CLAUDE.md:16-40] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.local.md:1-71] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.local.json.example:1-42]
- The external scaffold command operationalizes that split: it offers one-time installation of global Claude config into `~/.claude/`, then keeps project scaffolding and local overrides separate. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/new-project.md:25-44]
- The local repo centralizes most behavior in the root `CLAUDE.md`, including Gate 1/2/3, memory-save rules, and completion verification, while `.claude/CLAUDE.md` is intentionally tiny and only explains hook-aware recovery. [SOURCE: CLAUDE.md:107-175] [SOURCE: .claude/CLAUDE.md:1-14]
- The local Claude config already has a user-local file, but it is purely a hook/env config surface and not a documented user-preference contract analogous to `CLAUDE.local.md`. [SOURCE: .claude/settings.local.json:1-52]

## Analysis
The external repo gets one thing very right: users can tell which instructions are universal, which are project-specific, and which are purely personal. `system-spec-kit` currently asks the root rulebook to do nearly all of that work. That is defensible for governed multi-runtime behavior, but it raises the cognitive load on every session because operational policy and personal working style share the same conceptual layer. The external split suggests a simpler mental model: stable repo governance stays central, but personal preference capture should move into an explicit, gitignored layer instead of being buried in ad hoc local config edits or runtime-specific habits.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Root `CLAUDE.md` carries almost all behavior, `.claude/CLAUDE.md` only adds recovery notes, and `.claude/settings.local.json` is a technical override surface rather than a user-facing preference document.
- **External repo's approach:** Global security policy, project rules, and personal preferences each get their own file and intended audience.
- **Why the external approach might be better:** It reduces operator ambiguity and lets personal preferences evolve without pressuring the checked-in rulebook.
- **Why system-spec-kit's approach might still be correct:** Cross-runtime governance really does need one authoritative repo-level source of truth, especially when Spec Kit gates and memory workflows must stay consistent.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Keep the root `CLAUDE.md` authoritative, but add a documented gitignored personal-override contract such as `CLAUDE.local.md` or a runtime-agnostic equivalent for communication, testing, and output preferences.
- **Blast radius of the change:** medium
- **Migration path:** Introduce the personal layer as optional first, point `.claude/CLAUDE.md` and user docs to it, and only later trim duplicated "personal preference" guidance from the root rulebook.

## Conclusion
confidence: high

finding: `system-spec-kit` should keep its repo-level rulebook, but it should simplify operator UX by adding an explicit personal-preference layer instead of forcing that concern into the same conceptual space as repo governance.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `CLAUDE.md`, `.claude/CLAUDE.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define which preference classes are safe to make user-local and which must remain governed
- **Priority:** should-have

## Counter-evidence sought
I looked for a hidden local equivalent to `CLAUDE.local.md` in this repo and only found hook/env overrides, not a comparable user-facing preference layer. [SOURCE: .claude/settings.local.json:1-52]

## Follow-up questions for next iteration
If user-local preferences become explicit, should command/help surfaces also become profile-aware?
Does the external repo's profile system imply a broader simplification opportunity around how `system-spec-kit` exposes its documentation lifecycle?
