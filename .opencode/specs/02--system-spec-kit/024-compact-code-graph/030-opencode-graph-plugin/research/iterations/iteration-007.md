# Research Iteration 007: Startup, Resume, and Provenance Refinement

## Focus

Use `opencode-lcm` to find net-new improvements for startup, resume, and provenance behavior in the existing compact code graph runtime.

## Findings

### Provenance Needs Two Layers, Not One

The real missing concept is not only "more provenance", but two different provenance planes:

1. **surface provenance**
   - which runtime surface emitted the payload
2. **data provenance**
   - whether the payload is live, cached, imported, rebuilt, or rehomed

Our current system already records the emitting surface and, on the compact-recovery path, a cache marker, but it does not model the second plane in a first-class way. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:33-39`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:108-115`]

### Imported State Should Not Be Treated As Ready Until Rebuilt

`opencode-lcm` treats import as a rebuild pipeline:

- import rows
- backfill/repair derived state
- refresh indexes
- then reuse the imported data

The useful pattern for us is a state transition like:

- `imported-unverified`
- `rebuilt`
- `ready`

rather than importing state and immediately presenting it as plain `ready`. [SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:205-217`] [SOURCE: `external/opencode-lcm-master/tests/migration-snapshot.test.mjs:170-233`]

### Earlier Path-Safety Summary Was Too Flat

The first-pass research simplified path safety too much. In the plugin:

- relative snapshot paths are workspace-confined
- absolute external paths are intentionally allowed for portability

That means any future snapshot provenance should distinguish:

- in-workspace relative import
- absolute external import

instead of flattening both into a single "safe import" concept. [SOURCE: `external/opencode-lcm-master/src/workspace-path.ts:3-20`] [SOURCE: `external/opencode-lcm-master/tests/migration-snapshot.test.mjs:242-338`]

### Resume Payloads Need More Lineage Evidence

`opencode-lcm`'s compact resume note carries richer lineage and activity signals than our current startup/resume summaries:

- root session
- parent session
- lineage depth
- files touched
- recent archived activity

Our current startup and resume outputs mostly stop at:

- last spec folder
- a truncated summary
- graph freshness/counts
- generic next actions

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:91-105`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:44-87`] [SOURCE: `external/opencode-lcm-master/src/store.ts:3242-3273`]

## Recommendations

1. Add a unified provenance envelope to `session-prime`, `session_bootstrap`, `session_resume`, and `session_health`.
2. If snapshot import lands later, expose imported state as provisional until rebuild/doctor work completes.
3. Report whether imported payloads came from a workspace-relative path or an absolute external path.
4. Enrich startup/resume payloads with lineage/worktree/working-set evidence, not only freshness labels.

## Duplication Check

This is new relative to earlier packet research because it adds:

- the distinction between surface provenance and data provenance
- an `imported-unverified -> rebuilt -> ready` lifecycle
- the correction that path safety is relative-safe but absolute-portable
- a more specific lineage/worktree payload model for startup/resume surfaces
