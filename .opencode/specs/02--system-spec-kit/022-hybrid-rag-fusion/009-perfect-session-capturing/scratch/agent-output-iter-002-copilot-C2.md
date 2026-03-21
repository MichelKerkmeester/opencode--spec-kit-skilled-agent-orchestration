✗ memory_match_triggers
  └ Permission denied and could not request permission from user

✗ Run skill advisor for routing (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Assess documentation and user experience for
  │ saved but not indexed behavior in system-spec-kit specs and scripts" --threshold 0.8
  └ Permission denied and could not request permission from user

● Search (grep)
  │ "console\.|logger\.|warn|warning|error|index|search|save|quality|skipped|failed|not
  │ indexed|semantic|MCP|memory" (.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts)
  └ 44 lines found

● Search (grep)
  │ "console\.|logger\.|warn|warning|error|index|search|save|quality|skipped|failed|not
  │ indexed|semantic|MCP|memory" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "saved but not indexed|not indexed|index(ed|ing)? failed|indexing
  │ failed|searchable|semantic|memory_save|memory_index_scan|manual
  │ index|re-save|quality|soft-fail|soft fail|warning|WARN|ERROR" in
  │ {spec.md,research.md,018-runtime-contract-and-indexability/spec.md}
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing)
  └ No matches found

I found relevant code hits and now I’m drilling into exact documentation text and user-facing log strings so we can answer each deliverable precisely.

● Search (grep)
  │ "saved but not indexed|not
  │ indexed|indexability|index|searchable|memory_index_scan|memory_save|quality
  │ gate|quality|skipped|manual index|recover|recovery|soft-fail|soft fail"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/018-run
  │ time-contract-and-indexability/spec.md)
  └ 23 lines found

● Search (grep)
  │ "saved but not indexed|not
  │ indexed|indexability|index|searchable|memory_index_scan|memory_save|quality
  │ gate|quality|skipped|manual index|recover|recovery|soft-fail|soft fail" (.opencode/specs/02--sys
  │ tem-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research.md)
  └ 25 lines found

● Search (grep)
  │ "saved but not indexed|not
  │ indexed|indexability|index|searchable|memory_index_scan|memory_save|quality
  │ gate|quality|skipped|manual index|recover|recovery|soft-fail|soft fail" (.opencode/specs/02--sys
  │ tem-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md)
  └ 16 lines found

● Search (grep)
  │ "console\.(log|warn|error)\(|structuredLog\(|indexingStatus|skipped_quality_gate|skipped_index_p
  │ olicy|skipped_embedding_unavailable|failed_embedding|not indexed|searchable|memory
  │ index|indexing|save" (.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts)
  └ 23 lines found

● Search (grep)
  │ "console\.(log|warn|error)\(|structuredLog\(|indexingStatus|skipped_quality_gate|skipped_index_p
  │ olicy|skipped_embedding_unavailable|failed_embedding|not indexed|searchable|memory
  │ index|indexing|save" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 50 lines found

● Search (grep)
  │ "saved but not
  │ indexed|skipped_quality_gate|skipped_index_policy|memory_index_scan|indexed|searchable|indexing
  │ status|metadata.json|quality gate" in **/*.md (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ L60:84 (25 lines read)

● Read research.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research
  │ .md
  └ L56:76 (21 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2243:2341 (99 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md
  └ L44:56 (12 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md
  └ L60:92 (28 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/018-runt
  │ ime-contract-and-indexability/spec.md
  └ L80:110 (30 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2138:2164 (26 lines read)

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ L1:60 (60 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L140:205 (66 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1:70 (70 lines read)

● Read 12-session-capturing-pipeline-quality.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
  │ eline-quality.md
  └ L1:220 (220 lines read)

● Search (grep)
  │ "write_skip_index|saved successfully without semantic indexing|Run "npm run rebuild"|semantic
  │ indexing will be skipped|skipped_index_policy|skipped_quality_gate|deferred indexing|pending" in
  │ **/*.md
  └ 6 lines found

Nice, I have the core signals. I’ll now pull a few precise excerpts on metadata/recovery wording so the audit can cite exact user-visible behavior.

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ L149:190 (41 lines read)

● Read 12-session-capturing-pipeline-quality.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
  │ eline-quality.md
  └ L214:290 (77 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L90:140 (51 lines read)

● Search (grep)
  │ "npm run rebuild" in **/*.md (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "Run "npm run rebuild"|saved successfully without semantic
  │ indexing|write_skip_index|skipped_index_policy|skipped_quality_gate|semantic indexing will be
  │ skipped|deferred indexing|embedding_status = 'pending'" in **/README.md (.opencode)
  └ 1 line found

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L560:660 (101 lines read)

● Search (grep)
  │ "write_skip_index|indexing status|policy-aware skipped-index status|operator docs|contract" (.op
  │ encode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md)
  └ 21 lines found

● Search (grep)
  │ "skip indexing|semantic indexing skipped|write_skip_index|indexingStatus|metadata\.json"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/018-run
  │ time-contract-and-indexability/spec.md)
  └ 3 lines found

● Search (grep)
  │ "const warn =|function warn\(|const log =|function log\("
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 2 lines found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/018-runt
  │ ime-contract-and-indexability/spec.md
  └ L36:56 (21 lines read)

● Read 12-session-capturing-pipeline-quality.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
  │ eline-quality.md
  └ L286:360 (75 lines read)

● Search (grep)
  │ "write_skip_index|skipped_index_policy|semantic indexing will be skipped|rebuild|retry
  │ indexing|metadata\.json|embedding\.status|indexing status|searchable via BM25/FTS5" in **/*.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing)
  └ 5 lines found

Here’s the audit result for **Q8 (docs + UX)**.

1. **Documented?**  
Yes, mostly. It is explicitly documented as intentional policy in phase 018 (`write_skip_index` / `write_and_index`) in  
`.opencode/specs/.../018-runtime-contract-and-indexability/spec.md:40-56, 82-91`.  
It is also reflected in the feature catalog (`V2 ... writeable but intentionally skips semantic indexing`) at  
`.opencode/skill/system-spec-kit/feature_catalog/.../12-session-capturing-pipeline-quality.md:80-86`.  
But `research.md` still contains older wording (`qualityValidation.valid` gate) that now reads stale (`research.md:62-64`).

2. **User-visible messages (exact):**  
`QUALITY_GATE_WARN: Save continuing, but semantic indexing will be skipped due to validation rules: ...` (`workflow.ts:2155-2157`)  
`Context saved successfully!` (`workflow.ts:2245`)  
`Index policy: skipping semantic indexing for this file` (`workflow.ts:2324`)  
On embedding failure:  
`Warning: Embedding failed: ...`  
`Context saved successfully without semantic indexing`  
`Run "npm run rebuild" to retry indexing later` (`workflow.ts:2337-2339`)  
Also possible: `Warning: Embedding generation returned null - skipping indexing` (`memory-indexer.ts:73`).

3. **How user discovers “saved but not searchable”:**  
Via warnings/logs above and `metadata.json` embedding status (`skipped_index_policy`, `skipped_quality_gate`, `failed_embedding`, etc.) written by `updateMetadataEmbeddingStatus` (`memory-indexer.ts:156-177`).  
If `silent` mode is used, console warnings are suppressed (`workflow.ts:1301-1302`), so discovery relies on returned `indexingStatus`.

4. **Documented recovery path?**  
Partially. For runtime embedding failure, yes: `npm run rebuild` (`workflow.ts:2339`).  
For policy-based skip (`write_skip_index`), no clear operator runbook (“fix X then re-index/re-save”) is surfaced in these docs.

5. **Recommendation:**  
Treat this as **expected behavior** (intentional write/index contract), but improve docs + UX: add one operator table mapping each `indexingStatus` to concrete recovery steps (re-save with higher quality vs manual reindex path).

