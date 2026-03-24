1. `SEVERITY: P1`  
`FILE:` [package.json](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/package.json#L6)  
`ISSUE:` `@spec-kit/mcp-server/api` is exported to `dist/api.js`, but the built package only contains `dist/api/index.js`. Any script importing the bare `.../api` entrypoint fails at module resolution. This currently breaks `generate-description` and `rebuild-auto-entities` immediately.  
`EVIDENCE:`
```json
"exports": {
  ".": "./dist/context-server.js",
  "./*.js": "./dist/*.js",
  "./*": "./dist/*.js"
}
```

```text
$ node .../scripts/dist/spec-folder/generate-description.js --help
Error: Cannot find module '.../node_modules/@spec-kit/mcp-server/dist/api.js'
```

2. `SEVERITY: P1`  
`FILE:` [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1509)  
`ISSUE:` The memory save pipeline swallows that broken `@spec-kit/mcp-server/api` import and silently skips `description.json` regeneration plus `memorySequence` tracking after a save. The smoke test wrote the memory file, but per-folder tracking degraded with only a warning.  
`EVIDENCE:`
```ts
const { loadPerFolderDescription: loadPFD, savePerFolderDescription: savePFD, generatePerFolderDescription: genPFD } = await import(
  '@spec-kit/mcp-server/api'
);
...
} catch (descErr: unknown) {
  console.warn(`[workflow] description.json tracking error: ${descErr instanceof Error ? descErr.message : String(descErr)}`);
}
```

```text
[workflow] description.json tracking error: Cannot find module '.../node_modules/@spec-kit/mcp-server/dist/api.js'
```

3. `SEVERITY: P1`  
`FILE:` [input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L705)  
`ISSUE:` `generate-context` advertises `preflight`/`postflight` JSON support, and the shared types still model those fields, but the raw-input allowlist omits them. In file/JSON mode they are warned as unknown and dropped before the workflow runs.  
`EVIDENCE:`
```ts
const KNOWN_RAW_INPUT_FIELDS: Set<string> = new Set([
  'specFolder', 'spec_folder', 'SPEC_FOLDER',
  'filesModified', 'files_modified',
  'sessionSummary', 'session_summary',
  'keyDecisions', 'key_decisions',
  'nextSteps', 'next_steps',
  'technicalContext',
  'triggerPhrases', 'trigger_phrases',
  'importanceTier', 'importance_tier',
  'contextType', 'context_type',
  'projectPhase', 'project_phase',
  'toolCalls', 'exchanges',
  'FILES', 'observations',
  'userPrompts', 'user_prompts',
  'recentContext', 'recent_context',
]);
```

```ts
// generate-context.ts help text
JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
```

4. `SEVERITY: P1`  
`FILE:` [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L381)  
`ISSUE:` `--session-id` is parsed and documented, but never forwarded into `runWorkflow`, `loadCollectedData`, or `collectSessionData`. The flag is effectively dead, so deterministic transcript selection cannot work from this CLI.  
`EVIDENCE:`
```ts
if (argv[i] === '--session-id' && i + 1 < argv.length) {
  sessionId = argv[i + 1].trim() || null;
}
...
await runWorkflow({
  dataFile: parsed.collectedData ? undefined : CONFIG.DATA_FILE ?? undefined,
  specFolderArg: CONFIG.SPEC_FOLDER_ARG ?? undefined,
  collectedData: parsed.collectedData ?? undefined,
  loadDataFn: parsed.collectedData
    ? undefined
    : () => loadCollectedData({}),
  collectSessionDataFn: collectSessionData,
});
```

5. `SEVERITY: P1`  
`FILE:` [scripts-registry.json](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json#L425)  
`ISSUE:` The registry still advertises `opencode-capture`, but the referenced build artifact no longer exists. Anything relying on the registry loader for this entry gets a dead path.  
`EVIDENCE:`
```json
{
  "name": "opencode-capture",
  "path": "scripts/dist/extractors/opencode-capture.js",
  "description": "OpenCode session capture"
}
```

```text
$ test -f .opencode/skill/system-spec-kit/scripts/dist/extractors/opencode-capture.js
missing
```

6. `SEVERITY: P2`  
`FILE:` [channel-attribution.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/eval/channel-attribution.js#L1)  
`ISSUE:` Source/dist alignment currently fails because there are 6 orphaned built files with no matching source. This is release-hygiene debt and makes the published build harder to trust.  
`EVIDENCE:`
```text
Source/dist alignment check FAILED: 6 orphaned dist file(s):

  dist/lib/eval/channel-attribution.js
  dist/lib/eval/eval-ceiling.js
  dist/lib/manage/pagerank.js
  dist/lib/parsing/entity-scope.js
  dist/lib/search/context-budget.js
  dist/lib/storage/index-refresh.js
```

`SUMMARY:` P0: 0, P1: 5, P2: 1

`VERIFICATION:` `validate.sh` behaved correctly on valid/invalid fixtures, `validate_document.py` passed on `sk-doc/SKILL.md`, `skill_advisor.py --health` passed, targeted `vitest` tests passed, and a hermetic smoke run confirmed `generate-context.js` still writes the memory file, updates `metadata.json`, and touches the index DB notification path.
