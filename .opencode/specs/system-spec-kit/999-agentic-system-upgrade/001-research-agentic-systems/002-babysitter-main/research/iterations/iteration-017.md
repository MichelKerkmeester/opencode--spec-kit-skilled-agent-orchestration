# Iteration 017 — Structured Errors For Spec Kit Operators

Date: 2026-04-10

## Research question
What does Babysitter's error-handling story suggest about `system-spec-kit`'s current operator-facing failures?

## Hypothesis
Babysitter's structured runtime error model will be materially clearer than `system-spec-kit`'s current mix of shell errors, regex-classified CLI failures, and validator output.

## Method
I examined Babysitter's runtime exception system and compared it with error reporting patterns in `generate-context` and the spec validator.

## Evidence
- Babysitter classifies errors by category (`CONFIGURATION`, `VALIDATION`, `RUNTIME`, `EXTERNAL`, `INTERNAL`) and ships template-driven messages with default suggestions and next steps. [SOURCE: external/packages/sdk/src/runtime/exceptions.ts:8-33] [SOURCE: external/packages/sdk/src/runtime/exceptions.ts:61-133]
- It also offers typo correction and command suggestions, plus typed error classes such as `EffectRequestedError`, `ParallelPendingError`, `InvocationCollisionError`, and `MissingProcessContextError`. [SOURCE: external/packages/sdk/src/runtime/exceptions.ts:158-260] [SOURCE: external/packages/sdk/src/runtime/exceptions.ts:328-470]
- `generate-context` currently relies on a broad regex of expected error strings to decide whether to print a simple error versus an "Unexpected Error," which is workable but fragile. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:572-585]
- `validate.sh` provides useful rule-by-rule output, but its operator surface is still command-specific rather than part of a normalized error taxonomy shared across Spec Kit commands and MCP handlers. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-96] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:504-524]

## Analysis
Babysitter is better here because it treats operator guidance as part of the runtime contract. Errors arrive already categorized, with explicit next steps. `system-spec-kit` often emits decent details, but each command invents its own failure semantics. That means operators have to remember the command rather than the error class. [SOURCE: external/packages/sdk/src/runtime/exceptions.ts:61-133] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:572-585]

This is a good adoption candidate because it does not require architectural upheaval. A small shared error envelope for Spec Kit shell commands, command assets, and MCP handlers would immediately improve diagnostics, especially for save, validation, and resume flows. [SOURCE: external/packages/sdk/src/runtime/exceptions.ts:328-470] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:504-524]

## Conclusion
confidence: high

finding: `system-spec-kit` should adopt a structured error taxonomy with shared categories, hints, and remediation steps across its shell commands and MCP handlers. Babysitter shows that operator trust improves when failures describe both *what broke* and *what to do next* in a normalized way.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/mcp_server/`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a shared error schema and a small helper library usable from both Node and shell-adjacent scripts
- **Priority:** should-have

## Counter-evidence sought
I looked for a current shared Spec Kit error taxonomy covering shell commands and MCP handlers and found good local messaging, but not a common category/suggestion model spanning the surfaces. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:572-585] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:504-524]

## Follow-up questions for next iteration
- Are current tests strong enough to validate runtime behavior once richer error contracts exist?
- Which existing workflow tests prove determinism, versus only proving parity across duplicated assets?
- Would a timing guard help prevent some operator-visible failure modes in unattended loops?
