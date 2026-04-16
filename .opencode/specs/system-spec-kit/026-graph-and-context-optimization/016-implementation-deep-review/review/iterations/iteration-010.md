# Iteration 10 - correctness - pipeline

## Dispatcher
- iteration: 10 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:37:30Z

## Files Reviewed
- .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
- .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts
- .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts
- .opencode/skill/system-spec-kit/scripts/setup/install.sh
- .opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts
- .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts
- .opencode/skill/system-spec-kit/scripts/spec/create.sh
- .opencode/skill/system-spec-kit/scripts/spec/validate.sh
- .opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts
- .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/template-mustache-sections.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js
- .opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js
- .opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js
- .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js
- .opencode/skill/system-spec-kit/package.json
- .opencode/skill/system-spec-kit/scripts/package.json

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`generate-context` can silently retarget an explicit multi-segment spec path to a different packet by basename.**
   - Evidence: `validateArguments()` falls back to `findChildFolderSync(path.basename(specFolderArg))` for any invalid-looking target, not just bare child names, and then mutates `CONFIG.SPEC_FOLDER_ARG` to the first unique match it finds (`.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:477-487:validateArguments`). The resolver performs a recursive search across all specs roots and nested category/parent/child structures (`.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts:39-127:findChildFolderSync`), and the shipped tests explicitly verify that global deep search behavior (`.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:786-815`). That means a typo in the parent/category portion of an explicit target can redirect the save into an unrelated packet that happens to share the same leaf folder name.
   - Test gap: the authority suite only asserts failure for a totally invalid token like `not-a-spec-folder`; it does not cover a valid-looking but wrong multi-segment path (`.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:276-289`).

```json
{
  "claim": "generate-context violates explicit target authority by rebinding an invalid multi-segment spec path to any unique child folder with the same basename, which can write continuity into the wrong packet.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:477-487",
    ".opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts:39-127",
    ".opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:786-815"
  ],
  "counterevidenceSought": "Looked for a guard that limits basename fallback to bare child-name inputs or rejects explicit multi-segment paths before calling findChildFolderSync; none is present.",
  "alternativeExplanation": "The fallback was likely intended as a convenience for bare child-folder references, but it currently also fires for explicitly scoped paths after validation fails.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if upstream callers never pass explicit multi-segment targets and the tool contract is changed to document basename rebinding as intended behavior."
}
```

2. **Interrupting `generate-context` can be reported as a successful auto-save.**
   - Evidence: the signal handler exits with status `0` whenever lock release succeeds (`.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:147-159:handleSignalShutdown`). The Claude stop hook treats `spawnSync(...).status === 0` as a completed auto-save and logs success without checking whether the child exited because of a signal path (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:85-105:runContextAutosave`). In practice, a timeout/SIGTERM can therefore discard the save while still producing a success-shaped outcome.
   - Test gap: the only signal-related test checks listener accumulation, not exit semantics on SIGINT/SIGTERM (`.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:291-301`).

```json
{
  "claim": "generate-context returns a success exit code on SIGINT/SIGTERM, allowing session-stop autosave to log an interrupted save as completed.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:147-159",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:85-105"
  ],
  "counterevidenceSought": "Looked for wrapper logic that inspects result.signal/result.error or any tests asserting non-zero interrupt exits; the current hook only keys off status === 0.",
  "alternativeExplanation": "The zero exit may have been intended as a graceful shutdown path for interactive use, but it is unsafe once the script is used as a subprocess in autosave pipelines.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade if all callers ignore process status and independently verify that the expected continuity artifacts were written before reporting success."
}
```

### P2 Findings
- **`test-template-comprehensive.js` is a misleading coverage surface for the renderer.** It defines a local `renderTemplate()` stub instead of importing the production renderer (`.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:143-156`), and it is not wired into the package test commands (`.opencode/skill/system-spec-kit/scripts/package.json:10-19`). That file can stay green while `scripts/renderers/template-renderer.ts` regresses, so it should not be treated as meaningful rendering coverage.

## Traceability Checks
- `generate-context`'s public contract and authority tests say explicit CLI targets should remain authoritative, but the current validation path rebases invalid explicit paths by leaf-name search, so the implementation does not match that contract.
- `create.sh` and `validate.sh` were checked for subfolder/phase plumbing and recursive validation aggregation; I did not find a correctness defect in the reviewed slices there.

## Confirmed-Clean Surfaces
- **`scripts/memory/rank-memories.ts`** - input parsing, archived-folder filtering, and stats accounting are internally consistent; I did not find an obvious scoring or JSON-shape bug in the reviewed implementation.
- **`scripts/spec-folder/directory-setup.ts` / `scripts/spec-folder/index.ts`** - path sanitization plus leaf-name validation is coherent and safely re-exported.
- **`scripts/spec/validate.sh`** - exit-code mapping, TS-rule bridge handling, and recursive phase aggregation look correct in the reviewed paths, with matching focused tests present.
- **`scripts/setup/install.sh`** - path resolution, build/install sequencing, native-module recheck, and opencode.json mutation were consistent in the reviewed flow.

## Next Focus
- Iteration 11 should probe **security + shell execution** around `create.sh`, `validate.sh`, installer helpers, and any subprocess boundaries that consume user-controlled paths or JSON.
