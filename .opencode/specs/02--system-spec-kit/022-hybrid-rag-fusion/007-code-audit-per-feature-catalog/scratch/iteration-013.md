● skill(sk-code--review)

● skill(sk-code--opencode)

I’m loading the audit scope and security-relevant server surfaces first, then I’ll verify the claimed mismatches against the actual code paths and input-validation boundaries.

✗ memory_match_triggers
  └ Permission denied and could not request permission from user

● Search (grep)
  │ "tool-schemas|scope-governance|sqlite|better-sqlite3|prepare\(|db\.prepare|readFile|writeFile|un
  │ link|rm\(|rename\(|mkdir|path\.resolve|realpath|scope
  │ enforcement|tenantId|userId|agentId|sharedSpaceId|auth" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/**/022-implement-and-remove-deprecated-features
  │ /spec.md"
  └ No matches found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/**/*.{ts,js,json}"
  └ 6 files found

✗ search Spec Kit Memory MCP handler input validation, tool schemas, scope governance, auth boundar…
  └ Permission denied and could not request permission from user

● Search (grep)
  │ "022-implement-and-remove-deprecated-features|AUDIT FINDINGS|MISMATCH|F11|F15|F21|F23" in
  │ **/*.md (.opencode/skill/system-spec-kit)
  └ 3 lines found

● Search (grep)
  │ "tool-schemas|scope-governance" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 20 files found

● Search (grep)
  │ "prepare\(|\.run\(|\.get\(|\.all\(|sql\`|SELECT |INSERT |UPDATE |DELETE " in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 files found

I found the feature-catalog category stub and the core server/security files. Next I’m drilling into the 022 spec records plus the schema/governance/database/file-operation code paths to verify the audit claims line-by-line.

● List directory .opencode/specs
  └ 7 files found

● Read feature_catalog.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md
  └ L1:120 (119 lines read)

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-
  │ category-stub.md
  └ L1:120 (10 lines read)

● Search (grep)
  │ "022-implement-and-remove-deprecated-features" in **/* (.opencode/specs)
  └ 19 files found

● Search (grep)
  │ "AUDIT FINDINGS|MATCH|PARTIAL|MISMATCH" in **/spec.md (.opencode/specs)
  └ 44 files found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/022-im
  │ plement-and-remove-deprecated-features/spec.md
  └ L1:260 (172 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/016
  │ -tooling-and-scripts/spec.md
  └ L1:260 (197 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/017
  │ -governance/spec.md
  └ L1:260 (190 lines read)

● Read agent-03-catalog-gaps.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-rel
  │ ease-fixes-alignment-preparation/scratch/archive-audit-agents/agent-03-catalog-gaps.md
  └ L1:260 (73 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L1:260 (260 lines read)

● Read tool-input-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts
  └ L1:260 (237 lines read)

● Read scope-governance.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts
  └ L1:320 (320 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L1:320 (265 lines read)

● Search (grep)
  │ "validateToolInputSchema|inputSchema|toolDefinitions|callTool|server\.tool|registerTool|schemas"
  │ (.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 4 lines found

● Read shared-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
  └ L1:340 (340 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L1:360 (360 lines read)

● Search (grep)
  │ "readFile|writeFile|unlink|rm\(|rename\(|mkdir|realpath|resolve\(|normalize\(|join\(" in
  │ **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’ve got the catalog/spec context now. I’m narrowing on three likely risk areas: schema/runtime validation gaps, shared-memory auth boundary trust, and whether any DB/file operations bypass parameterization or canonical containment.

● Search (grep)
  │ "export function (buildScopeFilter|filter|assert|reviewGovernanceAudit|validateGovernedIngest|no
  │ rmalizeScopeContext|isScopeEnforcementEnabled)|function
  │ (buildScopeFilter|filter|assert|reviewGovernanceAudit)"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts)
  └ 5 lines found

● Search (grep)
  │ "actorUserId|actorAgentId|resolveAdminActor|shared_memory_status|shared_space_membership_set|sha
  │ red_space_upsert" in **/*.{ts,js,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "prepare\(`[\s\S]*\$\{|prepare\("[^"]*\$\{|prepare\('\[^']*\$\{" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "validateFilePath|createFilePathValidator|ALLOWED_BASE_PATHS|specFolder|pathString|isSafePath|re
  │ solve\(|realpath|canonical" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read scope-governance.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts
  └ L500:780 (188 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L250:420 (170 lines read)

● Search (grep)
  │ "handleMemoryIngestStart|handleCheckpoint|handleMemorySave|filePath|paths:|deleteAfter" in
  │ **/*.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 5 lines found

● Search (grep)
  │ "prepare\(`[^`]*\$\{" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "prepare\([^\n]*\+|\.exec\([^\n]*\+" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 3 lines found

● Search (grep)
  │ "x-requiredAnyOf|additionalProperties:
  │ false|actorUserId|actorAgentId|sharedSpaceId|filePath|specFolder"
  │ (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
  └ 5 lines found

● Search (grep)
  │ "export async function handle(MemoryIngestStart|CheckpointRestore|CheckpointCreate|MemoryDelete|
  │ MemoryIndexScan|MemorySave)|function handle(MemoryIngestStart|CheckpointRestore|CheckpointCreate
  │ |MemoryDelete|MemoryIndexScan|MemorySave)" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 6 lines found

● Search (grep)
  │ "validateFilePathLocal|createFilePathValidator\(|validateFilePath\(|ALLOWED_BASE_PATHS" in
  │ **/*.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 7 lines found

● Search (grep)
  │ "fs\.promises\.(writeFile|unlink|rm|rename|mkdir)|writeFile\(|unlink\(|rm\(|rename\(|mkdir\(" in
  │ **/*.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 4 lines found

● Read memory-ingest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
  └ L120:240 (121 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L90:280 (191 lines read)

● Read shared-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
  └ L560:660 (50 lines read)

● Search (grep)
  │ "export function createFilePathValidator|function createFilePathValidator|validateFilePath" in
  │ **/*.ts (.opencode/skill/system-spec-kit/mcp_server/utils)
  └ 2 lines found

● Search (grep)
  │ "validateFilePath|contains traversal|allowed base|canonical|realpath" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read validators.ts
  │ .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts
  └ L100:180 (52 lines read)

● Search (grep)
  │ "function hasTraversalSegment|export function hasTraversalSegment" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 1 line found

● Search (grep)
  │ "allowedSharedSpaceIds|assertSharedSpaceAccess\(|createScopeFilterPredicate\(|shared_space_id"
  │ in **/*.ts (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 37 lines found

● Read shared-spaces.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts
  └ L480:580 (101 lines read)

● Search (grep)
  │ "shared_space_upsert|shared_space_membership_set|shared_memory_status|actorUserId|actorAgentId"
  │ (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
  └ 9 lines found

● Search (grep)
  │ "shared_space_upsert|shared_space_membership_set|shared_memory_status|actorUserId|actorAgentId"
  │ (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ 22 lines found

● Search (grep)
  │ "dispatchTool\(|case 'shared_space_upsert'|case 'shared_space_membership_set'|case
  │ 'shared_memory_status'" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 6 lines found

● Read shared-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
  └ L338:560 (223 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L410:490 (81 lines read)

● Read lifecycle-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts
  └ L1:120 (66 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L490:620 (117 lines read)

● Search (grep)
  │ "validateToolInputSchema\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 26 lines found

● Search (grep)
  │ "function validateToolArgs|export function
  │ validateToolArgs|getToolSchema|ToolSchemaValidationError"
  │ (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ 8 lines found

● Search (grep)
  │ "validateInputLengths\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 6 lines found

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L564:660 (97 lines read)

● Read scope-governance.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts
  └ L430:510 (81 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L730:1010 (281 lines read)

● Read memory-ingest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
  └ L1:90 (90 lines read)

● Search (grep)
  │ "filePath.includes\('\.\.'\)|hasTraversalSegment|realpathSync\(|path\.resolve\(|startsWith\(`\$\
  │ {basePath\}\$\{path\.sep\}`\)" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "export function validateFilePath|const validateFilePath|function validateFilePath" in
  │ **/*path-security*.{ts,js}
  └ 1 file found

● Search (grep)
  │ "validateFilePath\(" in **/*path-security*.{ts,js}
  └ 12 lines found

● Read path-security.ts
  │ .opencode/skill/system-spec-kit/shared/utils/path-security.ts
  └ L1:120 (107 lines read)

● Read unit-path-security.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/unit-path-security.vitest.ts
  └ L1:140 (112 lines read)

● Search (grep)
  │ "Feature catalog:|MODULE:" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read 11-feature-catalog-code-references.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-
  │ references.md
  └ L1:220 (56 lines read)

I’ve got enough structure to start validating the claimed mismatches directly. I’m now doing two concrete checks: whether the “feature catalog references” coverage numbers still match the tree, and whether the phase 022 deprecated-feature inventory matches files that actually exist.

✗ Count feature-catalog comment coverage (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit')
  │ files=[]…
  └ Permission denied and could not request permission from user

✗ Check deprecated target file presence (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit')
  │ targets = ['graph-calibration','temporal-contiguity','consumption-logger','channel-attribution…
  └ Permission denied and could not request permission from user

● Search (grep)
  │ "graph-calibration|temporal-contiguity|consumption-logger|channel-attribution|fusion-lab|eval-ce
  │ iling" in **/*.{md,ts,js} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
  └ L1:60 (60 lines read)

● Read trigger-extractor.ts
  │ .opencode/skill/system-spec-kit/shared/trigger-extractor.ts
  └ L1:60 (60 lines read)

● Search (grep)
  │ "handlers/index\.ts|shared/trigger-extractor\.ts|scripts/utils/workspace-identity\.ts|verify_ali
  │ gnment_drift\.py" (.opencode/skill/system-spec-kit)
  └ 16 files found

● Read workspace-identity.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/workspace-identity.ts
  └ L1:80 (79 lines read)

● Read verify_alignment_drift.py
  │ .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py
  └ L1:120 (120 lines read)

● Search (grep)
  │ "fusion-lab|fusion shadow V2|shadow V2" (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "graph-calibration" (.opencode/skill/system-spec-kit)
  └ 9 files found

● Search (grep)
  │ "temporal-contiguity" (.opencode/skill/system-spec-kit)
  └ 11 files found

● Search (grep)
  │ "consumption-logger" (.opencode/skill/system-spec-kit)
  └ 54 files found

● Search (grep)
  │ "channel-attribution" (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "eval-ceiling|full-context ceiling eval|ceiling-quality" (.opencode/skill/system-spec-kit)
  └ 5 files found

● Read 04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md
  │ .opencode/skill/system-spec-kit/feature_catalog/17--governance/04-shared-memory-rollout-deny-by-
  │ default-membership-and-kill-switch.md
  └ L1:160 (69 lines read)

● Search (grep)
  │ "graph-calibration\.ts|temporal-contiguity\.ts|consumption-logger\.ts|channel-attribution\.ts|fu
  │ sion-lab\.ts|eval-ceiling\.ts|fusion-lab"
  │ (.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md)
  └ No matches found

● Search (grep)
  │ "graph-calibration|temporal-contiguity|consumption-logger" in **/*.{ts,js,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 44 lines found

● Search (grep)
  │ "channel-attribution|eval-ceiling|fusion-lab" in **/*.{ts,js,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Read shared-memory-handlers.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts
  └ L1:220 (219 lines read)

● Search (grep)
  │ "007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec\.md"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ 3 files found

● Search (grep)
  │ "022-implement-and-remove-deprecated-features"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog)
  └ 6 files found

● Search (grep)
  │ "shared_memory_status|allowedSharedSpaceIds|getAllowedSharedSpaceIds|tenantId:
  │ args\.tenantId|userId: args\.userId|agentId: args\.agentId"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts)
  └ 18 lines found

● Read shared-memory-handlers.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts
  └ L220:340 (121 lines read)

● Search (grep)
  │ "handleSharedMemoryStatus|allowedSharedSpaceIds|userId: 'user-owner'|agentId: 'agent-1'"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts)
  └ 3 lines found

● Search (grep)
  │ "shared_memory_status|actorUserId|actorAgentId"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts)
  └ 21 lines found

● Read shared-memory-handlers.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts
  └ L436:468 (33 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L348:406 (59 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L418:478 (61 lines read)

● Search (grep)
  │ "shared_memory_status\(|handleSharedMemoryStatus\(|getAllowedSharedSpaceIds\(" in **/*.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 12 lines found

● Search (grep)
  │ "IN \(\$\{placeholders\}\)|prepare\(`SELECT .* WHERE id IN \(\$\{placeholders\}\)`"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 1 line found

● Search (grep)
  │ "\.exec\(`|\.exec\("|\.exec\('" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 5 lines found

● Search (grep)
  │ "\.exec\(`|\.exec\("|\.exec\('" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 6 lines found

● Search (grep)
  │ "LIMIT \?\)|WHERE .* = \?|\.all\(\.\.\.params|\.get\(\.\.\.params"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts)
  └ 3 lines found

