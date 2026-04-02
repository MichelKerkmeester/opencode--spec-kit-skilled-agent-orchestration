# Iteration 004: D4 Maintainability

## Findings

No P0 issues found.

### [P1] `scripts/core/workflow.ts` uses three different dynamic-import degradation contracts for the same `@spec-kit/mcp-server/api` surface
- **File**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:214-228`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1139-1147`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1633-1697`
- **Issue**: The workflow now reaches into the same API family through three separate `await import(...)` call sites, but each one handles failure differently: retry-manager loading falls back to a silent no-op adapter, slug-history loading swallows every exception, and description tracking warns and continues. That makes the ESM boundary harder to maintain because a future export-path or packaging regression can look identical to an expected "optional data missing" case, and there is no shared helper that explains which failures are meant to be ignorable.
- **Evidence**: `loadWorkflowRetryManagerModule()` catches loader and shape errors, stores a string, and returns `FALLBACK_RETRY_MANAGER`; the slug-history import catches all errors with a comment about `description.json` absence even though module-load failures would also be suppressed; the description-tracking import has a third warn-and-continue path with its own retry loop. The behavior differences are real, but they are encoded inline instead of behind named contracts.
- **Fix**: Introduce small loader helpers with explicit intent, such as `loadRequiredRetryManager()`, `loadOptionalFolderDescription()`, and `loadMutableFolderDescriptionStore()`, and narrow the catch blocks so module-load failures are distinguished from downstream data absence.

```json
{
  "type": "claim-adjudication",
  "claim": "The workflow's dynamic imports are a maintainability hazard because the same @spec-kit/mcp-server/api dependency is loaded through multiple ad hoc patterns with inconsistent failure semantics.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:214-228",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1139-1147",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1633-1697"
  ],
  "counterevidenceSought": "The three call sites serve different business needs, and each one intentionally degrades differently today.",
  "alternativeExplanation": "The current inline handling may be a deliberate availability-first design so save workflows keep moving even when optional API helpers are unavailable.",
  "finalSeverity": "P1",
  "confidence": 0.87,
  "downgradeTrigger": "Downgrade if the project explicitly documents these three loader contracts as the intended public pattern and treats the divergence as a stable convention rather than incidental duplication."
}
```

### [P2] `@spec-kit/mcp-server/api` is no longer a minimal barrel, so future ESM boundary changes will carry a broad audit cost
- **File**: `.opencode/skill/system-spec-kit/mcp_server/api/index.ts:4-6`; `.opencode/skill/system-spec-kit/mcp_server/api/index.ts:60-114`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1140-1143`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1633-1635`
- **Issue**: The barrel advertises itself as the single public API surface, but it now re-exports not just script-facing helpers, but also deep folder-discovery, extraction, benchmarking, architecture, collaboration, and capability-flag modules from `../lib/*`. That broadens the implied stable ESM contract and makes it harder for maintainers to know which exports are intentionally public versus merely convenient to surface during migration.
- **Evidence**: The barrel comment says consumers should stop reaching into internals, yet most of the file still re-exports internals directly. The workflow imports the barrel for folder-description helpers, so any change to that barrel now requires extra care not to break unrelated downstream consumers who may be depending on the rest of the catch-all surface.
- **Fix**: Split the barrel into smaller documented entrypoints or add stability-tier comments so script consumers can depend on narrow subpaths instead of the full convenience barrel.

## Notes

- In the reviewed `shared/` and `mcp_server/` ESM files, relative imports consistently use `.js` suffixes. I did not find a new maintainability problem in extension hygiene itself.
- `import.meta.dirname` is applied consistently in the reviewed path-resolution files (`shared/paths.ts`, `mcp_server/core/config.ts`, and `mcp_server/handlers/index.ts`), and I did not find a stray `fileURLToPath` wrapper pattern reintroduced there.
- `mcp_server/handlers/save/index.ts` is a focused barrel and the `handlers/save/` directory is generally extension-clean; the save-area maintainability risk is lower than the workflow/API boundary risk above.

## Summary

- P0: 0 findings
- P1: 1 finding
- P2: 1 finding
- newFindingsRatio: 1.0
- Recommended next focus: D5 Performance on lazy-loading overhead, repeated module loads, and barrel/proxy startup cost
