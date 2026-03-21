Deleted 28 stale compiled artifacts under `.opencode/skill/system-spec-kit/scripts` and kept the 2 standalone `.js` files that do not have same-directory `.ts` sources.

Deleted:
- In [scripts/types](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types): `session-types.js`, `session-types.js.map`, `session-types.d.ts`, `session-types.d.ts.map`
- In [scripts/memory](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory): `validate-memory-quality.js`, `validate-memory-quality.js.map`, `validate-memory-quality.d.ts`, `validate-memory-quality.d.ts.map`
- In [scripts/utils](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils): `input-normalizer.js`, `input-normalizer.js.map`, `input-normalizer.d.ts`, `input-normalizer.d.ts.map`, `logger.js`, `logger.js.map`, `logger.d.ts`, `logger.d.ts.map`, `source-capabilities.js`, `source-capabilities.js.map`, `source-capabilities.d.ts`, `source-capabilities.d.ts.map`, `spec-affinity.js`, `spec-affinity.js.map`, `spec-affinity.d.ts`, `spec-affinity.d.ts.map`
- In [scripts/lib](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/lib): `content-filter.js`, `content-filter.js.map`, `content-filter.d.ts`, `content-filter.d.ts.map`

Kept:
- [record-node-version.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/setup/record-node-version.js)
- [template-structure.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/template-structure.js)

Verification: reran your exact `find` command, and it now returns only those two kept standalone `.js` files. I did not run broader tests since this was a targeted artifact cleanup rather than a source-code change.