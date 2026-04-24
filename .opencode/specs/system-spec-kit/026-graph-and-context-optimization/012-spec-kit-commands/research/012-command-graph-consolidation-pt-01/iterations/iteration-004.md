# Iteration 004 — Focus: Q4 + Q7 Delegation UX and Start Interview Shape

## Focus
Build on iteration-003's fail-closed fence, rollback, and lock contract, then answer the remaining UX questions: what `/spec_kit:start` must ask up front, what it should defer, and how `/plan` plus `/complete` can absorb that intake without breaking their current first-message setup contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-003.md:1-10] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-003.md:54-66]

## Findings
1. `/start` should own packet-creation inputs, while `/plan` and `/complete` must retain workflow-governing questions. Today both parent commands decide execution mode before YAML loading, ask for dispatch mode in the consolidated prompt, and keep phase decomposition wired to parent-only optional workflows that run before Step 1. That means moving execution mode, dispatch mode, or phase controls into `/start` would create hidden coupling to parent workflow semantics and make `/start` responsible for choices it cannot execute itself. Minimum parent-owned fields: execution mode, dispatch mode, phase decomposition, `:with-research`, and `:auto-debug`. Minimum `/start`-owned fields: feature/request text when missing, target folder or repair target, level confirm/override, and optional manual relationships. [SOURCE: .opencode/command/spec_kit/plan.md:46-55] [SOURCE: .opencode/command/spec_kit/plan.md:80-110] [SOURCE: .opencode/command/spec_kit/complete.md:47-58] [SOURCE: .opencode/command/spec_kit/complete.md:83-113] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:22-62] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:30-100] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:158-162]
2. Delegation should be inline absorption, not a chained `/start` handoff and not a second prompt with surprise ordering. Both parent commands currently promise that the first response is a single consolidated prompt with no analysis or tool calls before the questions, and the packet spec already requires merged intake with at most one additional turn total when `spec.md` is missing. The least-coupled design is: when `spec.md` is absent or metadata repair is needed, `/plan` or `/complete` inject a compact "start-intake block" into their existing consolidated prompt, create the artifacts, then continue from their normal workflow with returned values (`spec_path`, `level`, `repair_mode`, `manual_relationships`). This preserves today's prompt ordering and avoids forcing the user to run a visibly separate command mid-flow. [SOURCE: .opencode/command/spec_kit/plan.md:41-45] [SOURCE: .opencode/command/spec_kit/plan.md:78-137] [SOURCE: .opencode/command/spec_kit/complete.md:40-45] [SOURCE: .opencode/command/spec_kit/complete.md:81-140] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:146-148] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:158-162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:179-180] [SOURCE: https://yeoman.io/authoring/user-interactions:31-45]
3. The minimum viable `/start` interview should follow generator-style "few required inputs, everything else via defaults or flags" patterns. Cargo `new` and `init` both center on a path plus a small set of optional flags like `--name` and `--vcs`; Create React App similarly takes the app name first and treats template choice as optional; Cookiecutter explicitly separates human-readable prompts from default-driven `no_input` generation. That points to a very small confirm-mode intake:
   - `QS0` request/title only when missing
   - `QS1` target path or create-vs-repair choice
   - `QS2` recommended level confirm/override
   - `QS3` "record relationships?" yes/no gate
   - `QS4+` relation details only if `QS3=yes`

   Everything else should defer: research intent stays with the parent command, execution/dispatch/phase questions stay parent-owned, and `:auto` should accept explicit flags or inferred defaults with zero prompt turns. [SOURCE: https://doc.rust-lang.org/cargo/commands/cargo-new.html:31-58] [SOURCE: https://doc.rust-lang.org/cargo/commands/cargo-init.html:31-60] [SOURCE: https://create-react-app.dev/docs/getting-started/:64-99] [SOURCE: https://cookiecutter.readthedocs.io/en/stable/advanced/human_readable_prompts.html:43-74] [SOURCE: https://cookiecutter.readthedocs.io/en/stable/advanced/suppressing_prompts.html:45-73]
4. Manual graph relationship capture should reuse the existing `manual.depends_on`, `manual.supersedes`, and `manual.related_to` arrays and fill them with small objects, not invent a new metadata layer. Current packet `graph-metadata.json` files already reserve those three arrays, and the packet spec only adds two provenance requirements: each captured relationship must retain `reason` and `source`. The smallest compatible object shape is therefore:

   ```json
   {
     "target": "system-spec-kit/025-nested-changelog-per-spec",
     "reason": "Depends on nested changelog output for completion closeout",
     "source": "user-interview"
   }
   ```

   Recommendation: one optional grouped prompt, "Any packet relationships to record?" If yes, collect one or more entries per relation type using the existing arrays; if no, keep all three arrays empty. Do not add a new top-level `relationships` block, and do not ask this question in `:auto` unless flags or existing context already supply the values. [SOURCE: .opencode/specs/system-spec-kit/025-nested-changelog-per-spec/graph-metadata.json:7-10] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:132-135] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:183-185] [SOURCE: .opencode/command/spec_kit/complete.md:221-223]

## Ruled Out
- A visible chained-command UX where `/plan` or `/complete` tells the user to stop and run `/start` separately before resuming.
- Moving execution mode, dispatch mode, or phase decomposition into `/start`.
- A second free-form metadata interview just for relationships, or a new top-level `relationships` object outside `manual.*`.

## Dead Ends
- The repo still has no live `/spec_kit:start` command implementation to copy, so the answer has to be inferred from adjacent command and YAML contracts rather than lifted from an existing command surface.
- Existing packet `graph-metadata.json` examples only show empty manual arrays, so the object-entry recommendation is spec-compatible but not yet runtime-proven by a populated packet example.
- External generator docs are strong on minimum-input scaffolding and automation defaults, but they do not model this repo's repair-mode or deep-research placeholder-upgrade edge cases.

## Sources
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-003.md`
- `.opencode/command/spec_kit/plan.md`
- `.opencode/command/spec_kit/complete.md`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- `.opencode/specs/system-spec-kit/025-nested-changelog-per-spec/graph-metadata.json`
- `https://doc.rust-lang.org/cargo/commands/cargo-new.html`
- `https://doc.rust-lang.org/cargo/commands/cargo-init.html`
- `https://create-react-app.dev/docs/getting-started/`
- `https://cookiecutter.readthedocs.io/en/stable/advanced/human_readable_prompts.html`
- `https://cookiecutter.readthedocs.io/en/stable/advanced/suppressing_prompts.html`
- `https://yeoman.io/authoring/user-interactions`

## Assessment
- `findingsCount`: `4`
- `newInfoRatio`: `0.34`
- Questions addressed: `Q4`, `Q7`, `Q5`
- Questions answered: `Q4`, `Q7`
- Residual gap: the product-direction answer is now clear, but the repo still needs acceptance-language updates for `REQ-006`, `REQ-007`, and `REQ-009` so the inline intake contract is testable.

## Reflection
- What worked: using the current consolidated-prompt setup in `plan.md` and `complete.md` as the hard UX constraint made it easy to separate parent-owned workflow fields from start-owned packet-creation fields.
- What failed: local packet metadata examples do not yet show populated `manual.*` relationship objects, so the proposed shape is conservative by design rather than copied from a known-good packet.
- What to do differently: the next pass should translate this answer into concrete field names, defaults, and repair-mode branches for the auto/confirm YAMLs and `spec_check_protocol.md`.

## Next Focus
Translate the Q4/Q7 answer into precise acceptance and state-machine language: inline start-intake field names, repair-mode branching, unresolved-TODO re-entry from deep-research placeholders, and the exact audit events needed to keep `REQ-006`, `REQ-007`, and `REQ-009` enforceable.
