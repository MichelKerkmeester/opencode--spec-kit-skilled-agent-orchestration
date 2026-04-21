# Iteration 002 - Security

Focus: security. Scope stayed on the static checker code.

Files read:
- `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh`

Verification:
- Scoped vitest command passed.
- `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh --json` exited 0 with no errors.

Findings:

| ID | Severity | Finding | Code evidence |
| --- | --- | --- | --- |
| F003 | P1 | Router resource paths are normalized only by prefix and suffix. A path such as `references/../../some-file.md` still starts with `references/` and ends with `.md`; the existence check then evaluates `skill_dir / resource`, which can escape the skill directory. This weakens the static checker as a containment guard for router resources. | `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:70`, `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:100`, `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:106`, `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:260` |

Ruled out:
- No command injection path found in the shell option parser or embedded Python invocation. The script does not interpolate SKILL.md content into shell commands.
