● Todo added: Read spec, checklist, and target source files for cache/compatibility audit

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md
  └ 197 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md
  └ 126 lines read

● Grep "cache|rebuild|description\.json|specFolder|specId|folderSlug|parentChain|\bid\b|\btitle\b|\b
status\b|\blevel\b|\bparent\b" in {workflow.ts,config.ts}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core)
  └ 75 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1-180
  └ 180 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 930-1035
  └ 106 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1210-1255
  └ 46 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts lines 1-320
  └ 320 lines read

● Grep "ensureDescriptionCache|generateFolderDescriptions|loadPerFolderDescription|savePerFolderDesc
ription|description\.json|memorySequence|memoryNameHistory|specId|folderSlug|parentChain" in
**/*.{ts,sh} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1773089871001-q5vw8x.txt
  lines 1-220
  └ 111 lines read

● Grep "function (ensureDescriptionCache|generateFolderDescriptions|loadPerFolderDescription|savePer
FolderDescription|isCacheStale)|export function
(ensureDescriptionCache|generateFolderDescriptions|loadPerFolderDescription|savePerFolderDescription
|isCacheStale)|memorySequence|memoryNameHistory|specId|folderSlug|parentChain" in **/*.{ts,sh}
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit)
  └ 5 lines found

● Grep "export function ensureDescriptionCache|function ensureDescriptionCache|export function
generateFolderDescriptions|function generateFolderDescriptions|export function
loadPerFolderDescription|function loadPerFolderDescription|export function
savePerFolderDescription|function savePerFolderDescription|export function isCacheStale|function
isCacheStale" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts)
  └ 5 lines found

● Grep "interface PerFolderDescription|type PerFolderDescription|interface DescriptionCache|type
DescriptionCache" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts)
  └ 2 lines found

● Grep "specId|folderSlug|parentChain|memorySequence|memoryNameHistory"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts)
  └ 20 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts lines 1-90
  └ 90 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts lines 430-520
  └ 91 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts lines 560-690
  └ 131 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts lines 790-860
  └ 71 lines read

● Grep "loadDescriptionCache|saveDescriptionCache|folders\s*:\s*\[|version|generated"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts)
  └ 16 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts lines 720-790
  └ 71 lines read

● Grep "descriptions\.json|old-format|backward|legacy|consumer shape|version 1"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts)
  └ 4 lines found

● Grep "description\.json" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 1 line found

● Grep ""version"|"generated"|"folders"|"specFolder"|"description"|"keywords"|"lastUpdated"" in
descriptions.json (/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs)
  └ 80 lines found

● Glob "**/descriptions.json" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
  └ 2 files found

● Grep "DescriptionCache|folders: FolderDescription\[]|specFolder: string;" in **/*.{ts,md}
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit)
  └ 5 lines found

✗ Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-improve-stateless-mode/descripti
  on.json
  Path does not exist

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-speckit-quality-and-standards/de
  scription.json
  └ 17 lines read

● Grep ""id"\s*:|"name"\s*:|"title"\s*:|"status"\s*:|"level"\s*:|"parent"\s*:|"specFolder"\s*:|"spec
Id"\s*:|"folderSlug"\s*:|"parentChain"\s*:" in **/description.json
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs)
  └ 5 lines found

● Glob "**/description.json" in /Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion
  └ 13 files found

● Grep ""specFolder"\s*:" in **/description.json (/Users/michelkerkmeester/MEGA/Development/Opencode
 Env/Public/.opencode/specs)
  └ 5 lines found

● Grep ""id"\s*:" in **/description.json (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs)
  └ No matches found

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts lines 90-170
  └ 81 lines read

● Grep
"collectDiscoveredSpecState|isPerFolderDescriptionStale|descriptionMtime|spec\.md|description\.json"
 (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts)
  └ 43 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts lines 170-260
  └ 91 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts lines 210-280
  └ 71 lines read

● Grep "description\.json|specId|folderSlug|parentChain" in **/*.ts
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 15 lines found

● Grep "description\.json|specId|folderSlug|parentChain" in **/*.ts
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Grep "backward compatibility|mixed
mode|description.json|old-format|legacy|ensureDescriptionCache|generateFolderDescriptions" in
**/*.vitest.ts (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Grep "workflow-memory-tracking|memory tracking|description.json" in **/*.vitest.ts
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit)
  └ 3 files found

● Read .opencode/skill/system-spec-kit/mcp_server/tests/workflow-memory-tracking.vitest.ts lines
  1-240
  └ 115 lines read

● Grep "mixed mode|backward compatibility|ensureDescriptionCache|old-format|legacy|description.json"
 (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts)
  └ 23 lines found

● Grep "mixed mode|stale|description.json|ensureDescriptionCache|generateFolderDescriptions"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts)
  └ 70 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts lines 740-990
  └ 250 lines read

● Grep "optional|missing.*specId|missing.*folderSlug|missing.*parentChain|old
format|legacy|compatib" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts)
  └ 1 line found

● Grep "optional|missing.*specId|missing.*folderSlug|missing.*parentChain|old
format|legacy|compatib" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/workflow-memory-tracking.vitest.ts)
  └ No matches found

● Todo started: read-spec-and-code

● Run targeted folder discovery tests
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  tests/folder-discovery.vitest.ts tests/folder-discovery-integration.vitest.ts
  tests/workflow-memory-tracking.vitest.ts --reporter=verbose
  └ 7 lines...

● SQL: Insert missing audit todo
  └ 2 row(s) inserted. Last inserted row ID: 4.

● Read /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1773090027535-2ipktm.txt
  lines 1-260
  └ 224 lines read

● Probe legacy per-folder schema handling
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx tsx -e "import fs from
  'node:fs'; import os from 'node:os'; import path from 'node:path'; import {
  loadPerFolderDescription, savePerFolderDescription } from './lib/search/folder-discovery.ts';
  const dir = fs.mkdtempSync(path.join(os.tmpdir(),'speckit-legacy-')); ...
  └ 10 lines...

● Re-run performance threshold test
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  tests/folder-discovery-integration.vitest.ts -t 'T046-27: generateFolderDescriptions scan
  completes in <2s for 500 folders' --reporter=verbose
  └ 106 lines...

● Grep "memorySequence|memoryNameHistory|specId|folderSlug|parentChain"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 4 lines found

● Probe legacy per-folder schema handling again
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx tsx -e "import fs from
  'node:fs'; import os from 'node:os'; import path from 'node:path'; import {
  loadPerFolderDescription, savePerFolderDescription } from './lib/search/folder-discovery.ts';
  const dir = fs.mkdtempSync(path.join(os.tmpdir(),'speckit-legacy-')); ...
  └ 9 lines...

● Read .opencode/skill/system-spec-kit/mcp_server/specs/descriptions.json lines 1-20
  └ 5 lines read

● Grep "descriptions\.json|version|generated|folders" in descriptions.json
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/specs)
  └ 3 lines found

● Probe legacy schema and save output
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/mcp_server' && out=$(mktemp) && npx tsx -e "import
  fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import {
  loadPerFolderDescription, savePerFolderDescription } from './lib/search/folder-discovery.ts';
  const dir = fs.mkdtempSync(path.join(os.tmpdir(),'speckit-legacy-')); ...
  └ 10 lines...

✗ write_bash
  <unable to send input. no command with id: audit-shell is currently running>

● Probe legacy per-folder schema to temp file
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/mcp_server' && OUT=$(mktemp) && OUT="$OUT" npx tsx
  -e "import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import {
   loadPerFolderDescription, savePerFolderDescription } from './lib/search/folder-discovery.ts';
   const dir = fs.mkdtempSync(path.join(os.tmpdir(),'speckit-legacy-')); ...
  └ 10 lines...

● Probe legacy schema and write artifact
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/mcp_server' && OUT='/Users/michelkerkmeester/.copil
  ot/session-state/8249fc81-fbbd-451f-b92c-0e4e4ee9c931/files/legacy-schema-probe.json' &&
  OUT="$OUT" npx tsx -e "import fs from 'node:fs'; import os from 'node:os'; import path from
  'node:path'; import { loadPerFolderDescription, savePerFolderDescription } from ...
  └ 12 lines...

✗ Read ~/.copilot/session-state/8249fc81-fbbd-451f-b92c-0e4e4ee9c931/files/legacy-schema-probe.json
  Path does not exist

● List directory ~/.copilot/session-state/8249fc81-fbbd-451f-b92c-0e4e4ee9c931/files

● Read .opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts lines
  817-838
  └ 22 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts lines
  559-705
  └ 147 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts lines 928-984
  └ 57 lines read

● Todo completed: produce-findings

### FINDING-01: Legacy per-folder `description.json` files are accepted but never upgraded to the new schema
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:458-469,635-658; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1221-1238`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** A per-folder `description.json` is treated as valid/fresh even when it only has the old base fields (`specFolder`, `description`, `keywords`, `lastUpdated`). `generateFolderDescriptions()` will aggregate it into the centralized cache unchanged, and `workflow.ts` will later increment `memorySequence` / `memoryNameHistory` and save the same object back without ever backfilling `specId`, `folderSlug`, or `parentChain`.
- **Expected Behavior:** Old-format per-folder files should remain readable, but they should be normalized or regenerated so the persisted file also satisfies the new schema required by REQ-006 while preserving backward compatibility from REQ-004.
- **Root Cause:** `loadPerFolderDescription()` makes `specId`, `folderSlug`, `parentChain`, `memorySequence`, and `memoryNameHistory` optional, freshness checks do not treat missing new fields as stale, and the workflow save path mutates/saves the loaded object verbatim.
- **Suggested Fix:** Normalize legacy per-folder records before use: either (a) make missing `specId`/`folderSlug`/`parentChain` force regeneration through `generatePerFolderDescription()`, or (b) add a normalization step on load/save that computes missing identity fields from `folderPath` + `basePath` and writes the upgraded schema back atomically.

### FINDING-02: Centralized cache rebuild currently misses the documented 500-folder performance target
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:450-489; .opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:822-836`
- **Severity:** LOW
- **Category:** PERFORMANCE
- **Current Behavior:** The targeted benchmark for centralized rebuild failed twice in this audit: `generateFolderDescriptions([specsDir])` took about **2754ms** and **2953ms** for 500 folders, violating the enforced `<2s` test threshold in `T046-27` (and missing the spec’s stricter `<500ms` NFR by a wide margin).
- **Expected Behavior:** Centralized rebuild from per-folder files should stay within the documented scan budget for 500 folders.
- **Root Cause:** The rebuild path performs multiple synchronous filesystem operations per folder (`discoverSpecFolders` traversal, `loadPerFolderDescription`, staleness checks, fallback spec parsing, and possible auto-repair writes), which compounds at scale.
- **Suggested Fix:** Reduce repeated disk I/O in the rebuild path: reuse discovery/staleness data instead of re-statting/re-reading per folder, avoid auto-repair writes during aggregation, and reserve write-back/backfill for an explicit maintenance step or a separate lazy repair path.

### SUMMARY - Total: 2, Critical: 0, High: 0, Medium: 1, Low: 1


Total usage est:        1 Premium request
API time spent:         5m 55s
Total session time:     6m 25s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 2.1m in, 16.8k out, 1.8m cached (Est. 1 Premium request)
