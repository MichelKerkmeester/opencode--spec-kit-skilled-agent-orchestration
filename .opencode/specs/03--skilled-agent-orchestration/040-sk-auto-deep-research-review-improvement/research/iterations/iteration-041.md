# Iteration 041
## Focus
Review migration/rehome behavior and conflict semantics.

## Questions Evaluated
- Does migration safely rehome legacy scratch artifacts?
- Are conflicting canonical+legacy states handled deterministically?

## Evidence
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:116-146`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:116-146`

## Analysis
Migration is pragmatic and non-destructive for common cases, but conflict handling is mostly declarative (`on_conflict`) while shell command execution path is permissive.

## Findings
- Rehome design is strong for single-source legacy migration.
- A stricter preflight conflict resolver would reduce silent partial migrations.

## Compatibility Impact
Important for non-hook recovery where stale artifacts are common after interrupted sessions.

## Next Focus
Trace runtime orchestrator parity to determine where lifecycle and migration instructions drift per CLI profile.

