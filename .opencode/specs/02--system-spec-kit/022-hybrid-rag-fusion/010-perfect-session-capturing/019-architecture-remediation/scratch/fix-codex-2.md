Removed the dead references and orphaned artifacts you listed.

- Commented out the deleted remediation step and added the TODO in [heal-ledger-mismatch.sh](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh#L103).
- Removed the stale inventory entry from [evals/README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/README.md#L57).
- Removed the stale list item from [lib/README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/lib/README.md#L32).
- Dropped the snake_case aliases from the export block in [folder-detector.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts#L1618).
- Deleted the six orphaned build artifacts under `scripts/core/` and `scripts/evals/`.

Verification passed with `bash -n` on the shell script, a repo-local TypeScript check for `scripts/` (`./node_modules/.bin/tsc --noEmit --composite false -p scripts/tsconfig.json`), `git diff --check`, and explicit checks that the deleted files no longer exist. I did not run the broader test suite.