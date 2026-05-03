## Dimension: security

## Files Reviewed (path:line list)

- `.claude/skills/sk-code-review/references/fix-completeness-checklist.md:12-34` - R5 classification rules; regex/path/security logic is algorithmic unless proven safe with adversarial inputs.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:53-72` - `SKILL_NAME_PATTERN` and `normalizeSkillList` trim, regex-filter, deduplicate, and sort selected skill names.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:75-99` - env and per-call `includeSkills` parsing maps empty/invalid-only lists to `none`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:101-115` - fingerprints serialize only normalized selected skill names.
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:57-85` - `.opencode/skill` paths are matched by one path segment and compared against `includedSkillsList`; selected skill names are not joined into filesystem paths.
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:72-90` - default code-graph policy still rejects broadly excluded paths before applying `.opencode` opt-ins.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:26-38` - scan args expose `includeSkills?: boolean | string[]`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:252-259` - scan handler routes raw args through the shared scope resolver before building the indexer config.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:147-171` - default exclude globs come from the resolved scope policy.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305` - recursive walking calls `shouldIndexForCodeGraph` before glob matching.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1451-1470` - specific-file indexing canonicalizes workspace candidates and applies the same policy guard.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:572-579` - public schema accepts boolean `includeSkills` or an array whose items match `^sk-[a-z0-9-]+$`.
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-500` - Zod schema applies the same selected-skill regex.
- `.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:130-145` - public schema validator applies item validation and string regex checks.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:306-325` - resolver precedence matrix includes selected csv skill lists.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:399-429` - granular selection covers one-name, two-name, empty-list, and csv-env behavior.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:431-460` - deterministic v2 fingerprint round-trip uses sorted selected skills.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:385-407` - scan handler passes normalized granular skill lists into the indexer config.
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:534-640` - tool schema coverage accepts `includeSkills: ['sk-code-review']` and rejects non-boolean string values plus a non-`sk-*` name.

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

## Verdict

PASS - adversarial names containing traversal, dots, NUL/control characters, shell metacharacters, unicode, or non-`sk-*` prefixes fail the anchored regex or normalize to `none`; empty lists and duplicates are safe, and even regex-valid long names are only compared/serialized, not used to derive filesystem paths.
