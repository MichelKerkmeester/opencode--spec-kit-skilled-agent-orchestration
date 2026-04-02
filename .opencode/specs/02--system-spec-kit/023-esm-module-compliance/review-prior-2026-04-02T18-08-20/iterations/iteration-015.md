# Iteration 015

## Scope
Scripts/tooling reliability and command output contracts (`scripts/` and spec shell tooling).

## Verdict
findings

## Findings

### P1
1. `generate-context` mixes human logs with machine-readable JSON on stdout.
- Evidence:
  - ../../../../skill/system-spec-kit/scripts/memory/generate-context.ts:550
  - ../../../../skill/system-spec-kit/scripts/memory/generate-context.ts:364
  - ../../../../skill/system-spec-kit/scripts/memory/generate-context.ts:365

2. `check-completion.sh --json` emits JSON to stderr with success exit and empty stdout.
- Evidence:
  - ../../../../skill/system-spec-kit/scripts/spec/check-completion.sh:379
  - ../../../../skill/system-spec-kit/scripts/spec/check-completion.sh:385

### P2
1. CLI contract mismatch between folder-detector help and parser behavior.
- Evidence:
  - ../../../../skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1249
  - ../../../../skill/system-spec-kit/scripts/memory/generate-context.ts:419
  - ../../../../skill/system-spec-kit/scripts/memory/generate-context.ts:424

2. `progressive-validate` suggestion extraction can silently drop findings when stdout/stderr are merged.
- Evidence:
  - ../../../../skill/system-spec-kit/scripts/spec/progressive-validate.sh:501
  - ../../../../skill/system-spec-kit/scripts/spec/progressive-validate.sh:509
  - ../../../../skill/system-spec-kit/scripts/spec/progressive-validate.sh:516
  - ../../../../skill/system-spec-kit/scripts/spec/progressive-validate.sh:540

3. `create.sh` output can over-report `description.json` presence.
- Evidence:
  - ../../../../skill/system-spec-kit/scripts/spec/create.sh:1077
  - ../../../../skill/system-spec-kit/scripts/spec/create.sh:1083
  - ../../../../skill/system-spec-kit/scripts/spec/create.sh:1184
