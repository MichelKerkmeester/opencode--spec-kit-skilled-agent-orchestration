● Todo added: Audit feature catalog source files

● Extract source file lists from feature markdown files
  $ python3 - <<'PY'
  import re, pathlib, json
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog')
  features=sorted(root.glob('18--ux-hooks/*.md'))+sorted(root.glob('19--decisions-and-deferrals/...
  └ 48 lines...

● Read .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/01-1-search-pipelin
  e-features-speckit.md
  └ 83 lines read

● Read
  .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring.md

  └ 92 lines read

● Parse source file paths from feature file tables
  $ python3 - <<'PY'
  import re, pathlib
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog')
  features=sorted(root.glob('18--ux-hooks/*.md'))+sorted(root.glob('19--decisions-and-deferrals/...
  └ 32 lines...

● Read /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1772996855046-vw4prb.txt
  └ 1 line read

● Read /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1772996855046-vw4prb.txt
  lines 1-220
  └ 220 lines read

● Summarize feature to source file mapping counts
  $ python3 - <<'PY'
  import re, pathlib, collections
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog')
  features=sorted(root.glob('18--ux-hooks/*.md'))+sorted(root.glob('19--decisions-and-deferrals/...
  └ 51 lines...

● Scan referenced source files for risky coding patterns
  $ python3 - <<'PY'
  import re, pathlib, json
  base=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  # gather files from features...
  └ 44 lines...

● Grep "^parseint-or|^number-or"
(/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1772996896090-s1kjv4.txt)
  └ 1 file found

● Grep "^(parseint-or|number-or|silent-catch|any-cast)"
(/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1772996896090-s1kjv4.txt)
  └ 5 lines found

● Read /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1772996904193-ss7wea.txt
  lines 1-220
  └ 105 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts lines 1-130
  └ 130 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts lines 130-230
  └ 101 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts lines 1-80
  └ 79 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts lines 1-60
  └ 60 lines read

● Grep "03-checkpoint-delete-confirmname-safety.md"
(/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1772996855046-vw4prb.txt)
  └ 1 line found

● Read /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1772996855046-vw4prb.txt
  lines 255-380
  └ 126 lines read

● Grep "confirmName|confirm_name|confirm" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts)
  └ 9 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts lines 250-330
  └ 81 lines read

● Compute feature coverage and bug-to-feature mapping
  $ python3 - <<'PY'
  import re, pathlib, json
  base=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  root=base/'feature_catalog'...
  └ 88 lines...

● Generate condensed per-feature coverage lines
  $ python3 - <<'PY'
  import json, pathlib
  j=json.loads(pathlib.Path('/tmp/feature_audit_summary.json').read_text())
  for f,d in j.items():
      print('FEATURE',f)...
  └ 185 lines...

● Todo completed: feature-catalog-audit

---
FEATURE: 01-shared-post-mutation-hook-wiring.md  
SOURCE_FILES_AUDITED: 69  
BUGS_FOUND: 1

BUG: BUG-UX-001  
FILE: mcp_server/lib/cache/tool-cache.ts:51-53  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Env numeric parsing uses `parseInt(...) || default`, so valid `0` values are treated as falsy and silently replaced by defaults (cannot intentionally set zero TTL / zero entries / zero cleanup interval).  
EVIDENCE: `defaultTtlMs: parseInt(process.env.TOOL_CACHE_TTL_MS || '60000', 10) || 60000`  
SUGGESTED_FIX: Parse once, then use `Number.isNaN(parsed) ? default : parsed` (or clamp explicitly with documented min bounds).

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (65)]: LISTED in respective directory README.md
- [mcp_server/hooks/memory-surface.ts]: MISSING in mcp_server/hooks/README.md
- [mcp_server/hooks/mutation-feedback.ts]: MISSING in mcp_server/hooks/README.md
- [mcp_server/tests/content-normalizer.vitest.ts]: MISSING in mcp_server/tests/README.md
- [mcp_server/tests/retrieval-directives.vitest.ts]: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 02-memory-health-autorepair-metadata.md  
SOURCE_FILES_AUDITED: 183  
BUGS_FOUND: 1

BUG: BUG-UX-001  
FILE: mcp_server/lib/cache/tool-cache.ts:51-53  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Same `parseInt(...) || default` fallback bug; explicit zero env values are ignored.  
EVIDENCE: `maxEntries: parseInt(process.env.TOOL_CACHE_MAX_ENTRIES || '1000', 10) || 1000`  
SUGGESTED_FIX: Use `const v = Number.parseInt(..., 10); final = Number.isNaN(v) ? default : v;`.

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (168)]: LISTED in respective directory README.md
- [15 files]: MISSING in module READMEs (notably hooks + tests README gaps, including response-hints and several vitest files)
---

---
FEATURE: 03-checkpoint-delete-confirmname-safety.md  
SOURCE_FILES_AUDITED: 105  
BUGS_FOUND: 0

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (101)]: LISTED in respective directory README.md
- [mcp_server/tests/content-normalizer.vitest.ts]: MISSING in mcp_server/tests/README.md
- [mcp_server/tests/feedback-denylist.vitest.ts]: MISSING in mcp_server/tests/README.md
- [mcp_server/tests/ground-truth-feedback.vitest.ts]: MISSING in mcp_server/tests/README.md
- [mcp_server/tests/learned-feedback.vitest.ts]: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 04-schema-and-type-contract-synchronization.md  
SOURCE_FILES_AUDITED: 13  
BUGS_FOUND: 0

README_COVERAGE:
- [ALL_SOURCE_FILES (13)]: LISTED in respective directory README.md
---

---
FEATURE: 05-dedicated-ux-hook-modules.md  
SOURCE_FILES_AUDITED: 71  
BUGS_FOUND: 0

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (66)]: LISTED in respective directory README.md
- [mcp_server/hooks/memory-surface.ts]: MISSING in mcp_server/hooks/README.md
- [mcp_server/hooks/mutation-feedback.ts]: MISSING in mcp_server/hooks/README.md
- [mcp_server/hooks/response-hints.ts]: MISSING in mcp_server/hooks/README.md
- [mcp_server/tests/content-normalizer.vitest.ts]: MISSING in mcp_server/tests/README.md
- [mcp_server/tests/retrieval-directives.vitest.ts]: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 06-mutation-hook-result-contract-expansion.md  
SOURCE_FILES_AUDITED: 69  
BUGS_FOUND: 1

BUG: BUG-UX-001  
FILE: mcp_server/lib/cache/tool-cache.ts:51-53  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Zero-valued env overrides are lost due to truthy/falsy defaulting.  
EVIDENCE: `cleanupIntervalMs: parseInt(process.env.TOOL_CACHE_CLEANUP_INTERVAL_MS || '30000', 10) || 30000`  
SUGGESTED_FIX: NaN-check parsing instead of `||`.

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (65)]: LISTED in respective directory README.md
- [4 files]: MISSING in hooks/tests README.md
---

---
FEATURE: 07-mutation-response-ux-payload-exposure.md  
SOURCE_FILES_AUDITED: 17  
BUGS_FOUND: 0

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (16)]: LISTED in respective directory README.md
- [mcp_server/hooks/mutation-feedback.ts]: MISSING in mcp_server/hooks/README.md
---

---
FEATURE: 08-context-server-success-hint-append.md  
SOURCE_FILES_AUDITED: 365  
BUGS_FOUND: 3

BUG: BUG-UX-001  
FILE: mcp_server/lib/cache/tool-cache.ts:51-53  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: `parseInt(...) || default` drops explicit `0` env configuration.  
EVIDENCE: `defaultTtlMs: parseInt(process.env.TOOL_CACHE_TTL_MS || '60000', 10) || 60000`  
SUGGESTED_FIX: NaN-check parse result; optionally clamp bounds explicitly.

BUG: BUG-UX-002  
FILE: mcp_server/lib/session/session-manager.ts:161-162,178-179  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Session TTL / max entries / stale cleanup intervals use the same falsy fallback pattern; explicit `0` config is impossible and silently rewritten to defaults, causing operational behavior drift.  
EVIDENCE: `sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES as string, 10) || 30`  
SUGGESTED_FIX: Replace `||` defaults with `Number.isNaN(parsed)` checks and enforce allowed ranges explicitly.

BUG: BUG-UX-003  
FILE: mcp_server/lib/search/local-reranker.ts:35  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Timeout env parsing uses `Number(...) || 30_000`; explicit `0` (or intentionally disabled timeout semantics) is overridden.  
EVIDENCE: `const RERANKER_TIMEOUT_MS = Number(process.env.SPECKIT_RERANKER_TIMEOUT_MS) || 30_000;`  
SUGGESTED_FIX: `const parsed = Number(...); const timeout = Number.isFinite(parsed) ? parsed : 30_000;`.

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (331)]: LISTED in respective directory README.md
- [34 files]: MISSING in hooks/tests README.md (includes all three hook modules and multiple test files like local-reranker, reporting-dashboard, stage2-fusion, etc.)
---

---
FEATURE: 09-duplicate-save-no-op-feedback-hardening.md  
SOURCE_FILES_AUDITED: 178  
BUGS_FOUND: 1

BUG: BUG-UX-001  
FILE: mcp_server/lib/cache/tool-cache.ts:51-53  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Explicit zero-valued env overrides are discarded by falsy fallback.  
EVIDENCE: `parseInt(..., 10) || 60000` pattern in tool cache config.  
SUGGESTED_FIX: Parse + NaN guard, not truthiness.

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (164)]: LISTED in respective directory README.md
- [14 files]: MISSING in hooks/tests README.md
---

---
FEATURE: 10-atomic-save-parity-and-partial-indexing-hints.md  
SOURCE_FILES_AUDITED: 155  
BUGS_FOUND: 1

BUG: BUG-UX-001  
FILE: mcp_server/lib/cache/tool-cache.ts:51-53  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Env value `0` cannot be represented due to `||` defaulting.  
EVIDENCE: `maxEntries: parseInt(..., 10) || 1000`  
SUGGESTED_FIX: Use explicit invalidity checks (`Number.isNaN`) and range validation.

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (144)]: LISTED in respective directory README.md
- [11 files]: MISSING in hooks/tests README.md
---

---
FEATURE: 11-final-token-metadata-recomputation.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 0

README_COVERAGE:
- [ALL_SOURCE_FILES (2)]: LISTED in respective directory README.md
---

---
FEATURE: 12-hooks-readme-and-export-alignment.md  
SOURCE_FILES_AUDITED: 71  
BUGS_FOUND: 0

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (66)]: LISTED in respective directory README.md
- [5 files]: MISSING in hooks/tests README.md
---

---
FEATURE: 13-end-to-end-success-envelope-verification.md  
SOURCE_FILES_AUDITED: 15  
BUGS_FOUND: 0

README_COVERAGE:
- [ALL_SOURCE_FILES (15)]: LISTED in respective directory README.md
---

---
FEATURE: 01-int8-quantization-evaluation.md  
SOURCE_FILES_AUDITED: 0  
BUGS_FOUND: 0

README_COVERAGE:
- [none]: N/A
---

---
FEATURE: 02-implemented-graph-centrality-and-community-detection.md  
SOURCE_FILES_AUDITED: 4  
BUGS_FOUND: 0

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (3)]: LISTED in respective directory README.md
- [mcp_server/tests/community-detection.vitest.ts]: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 03-implemented-auto-entity-extraction.md  
SOURCE_FILES_AUDITED: 12  
BUGS_FOUND: 0

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (11)]: LISTED in respective directory README.md
- [mcp_server/tests/entity-extractor.vitest.ts]: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 04-implemented-memory-summary-generation.md  
SOURCE_FILES_AUDITED: 8  
BUGS_FOUND: 0

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (7)]: LISTED in respective directory README.md
- [mcp_server/tests/memory-summaries.vitest.ts]: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 05-implemented-cross-document-entity-linking.md  
SOURCE_FILES_AUDITED: 7  
BUGS_FOUND: 0

README_COVERAGE:
- [ALL_OTHER_SOURCE_FILES (6)]: LISTED in respective directory README.md
- [mcp_server/tests/entity-linker.vitest.ts]: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 01-1-search-pipeline-features-speckit.md  
SOURCE_FILES_AUDITED: 0  
BUGS_FOUND: 0

README_COVERAGE:
- [none]: N/A
---

---
FEATURE: 02-2-session-and-cache.md  
SOURCE_FILES_AUDITED: 0  
BUGS_FOUND: 0

README_COVERAGE:
- [none]: N/A
---

---
FEATURE: 03-3-mcp-configuration.md  
SOURCE_FILES_AUDITED: 0  
BUGS_FOUND: 0

README_COVERAGE:
- [none]: N/A
---

---
FEATURE: 04-4-memory-and-storage.md  
SOURCE_FILES_AUDITED: 0  
BUGS_FOUND: 0

README_COVERAGE:
- [none]: N/A
---

---
FEATURE: 05-5-embedding-and-api.md  
SOURCE_FILES_AUDITED: 0  
BUGS_FOUND: 0

README_COVERAGE:
- [none]: N/A
---

---
FEATURE: 06-6-debug-and-telemetry.md  
SOURCE_FILES_AUDITED: 0  
BUGS_FOUND: 0

README_COVERAGE:
- [none]: N/A
---

---
FEATURE: 07-7-ci-and-build-informational.md  
SOURCE_FILES_AUDITED: 0  
BUGS_FOUND: 0

README_COVERAGE:
- [none]: N/A
---


Total usage est:        1 Premium request
API time spent:         3m 29s
Total session time:     3m 49s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           889.8k in, 10.3k out, 810.6k cached (Est. 1 Premium request)
