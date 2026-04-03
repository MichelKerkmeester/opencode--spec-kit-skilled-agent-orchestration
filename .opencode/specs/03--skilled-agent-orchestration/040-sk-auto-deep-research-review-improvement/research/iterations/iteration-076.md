# Iteration 076
## Focus
AutoAgent CLI mode routing and user-facing orchestration.

## Questions Evaluated
- How does the user pick between deep research, agent editing, and workflow editing?
- What assumptions does the CLI make about cloned repos, models, and runtime setup?

## Evidence
- `external/AutoAgent-main/autoagent/cli.py:46-235`
- `external/AutoAgent-main/README.md:244-263`
- `external/AutoAgent-main/README.md:269-323`

## Analysis
The CLI surface is straightforward: `auto main` opens the full suite, `auto deep-research` opens a lighter research mode, and the user can switch between `user mode`, `agent editor`, and `workflow editor`. The README also spells out model-specific startup examples and clone settings. That is friendly for operators, but it means the runtime behavior is partly encoded in environment defaults and repo-clone assumptions rather than one canonical lifecycle contract.

## Findings
- The public CLI is easy to understand and intentionally split by user intent.
- Mode selection is explicit, which makes the UX approachable.
- The command surface still depends on separate setup conventions for different modes and providers.

## Compatibility Impact
The internal system should keep this kind of simple mode selection, but it should not let startup ergonomics become the source of truth for lifecycle state. Disk artifacts should own the real session state.

## Next Focus
Inspect the case-resolution loop and retry behavior, because that shows how AutoAgent escalates when the first pass does not solve the task.
