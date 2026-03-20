I’ll map scoring + indexability logic first, then sample real generated memories and compare by CLI source patterns. I’m starting by reading the core files and collecting candidate fixtures/tests in one pass.

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ 1 line read

● Read quality-scorer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
  └ 356 lines read

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ 204 lines read

● Search (grep)
  │ "quality|score|indexable|frontmatter|description|continuation|stateless|cli|source|tool"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 files found

✗ Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/0debf4f4-508c-431b-baf3-d0e3b2668ef2/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Read scoring/indexer/workflow logic and extract explicit criteria + thresholds.…
  └ Permission denied and could not request permission from user

● Search (glob)
  │ ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/
  │ *.md"
  └ 9 files found

I found the scorer and indexer; next I’m pinpointing where workflow applies gates and pulling test fixtures to ground the distribution claims.

● Read copilot-tool-output-1773991984484-y4ooog.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1773991984484-y4ooog.txt
  └ L1:200 (155 lines read)

● Search (glob)
  │ "**/fixtures/**/*" in .opencode/skill/system-spec-kit
  └ 83 files found

● Search (glob)
  │ "**/*{quality,index,scorer,memory}*.{test,spec,vitest}.{ts,js,mts,cts}" in
  │ .opencode/skill/system-spec-kit
  └ 58 files found

● Search (grep)
  │ "scoreMemoryQuality|qualityScore|score01|score100|quality gate|skipped_quality_gate|index|indexi
  │ ng|extractQualityScore|extractQualityFlags|sufficiency|contamination|stateless|session
  │ source|session_source|tool_state" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "skipped_quality_gate|quality gate|min.*quality|quality threshold|index
  │ policy|extractQualityScore|qualityScore" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (glob)
  │ "**/tests/**/*.{ts,js,mts,cts}" in .opencode/skill/system-spec-kit
  └ 5 files found

● Read save-quality-gate.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts
  └ 1 line read

● Read memory-indexer-weighting.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts
  └ 80 lines read

● Read memory-search-quality-filter.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts
  └ 177 lines read

● Read memory-sufficiency.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts
  └ 170 lines read

● Read quality-scorer-calibration.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts
  └ 222 lines read

● Read quality-extractors.test.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts
  └ 154 lines read

● Search (grep)
  │ "skipped_quality_gate|scoreMemoryQuality|qualityScoreResult|qualityScore|score01|score100|qualit
  │ yFlags|sufficiency|hadContamination|indexMemory\(|updateMetadataEmbeddingStatus"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 53 lines found

● Search (grep)
  │ "MIN_QUALITY|QUALITY_THRESHOLD|quality threshold|quality
  │ gate|skipped_quality_gate|minQuality|qualityScore|extractQualityScore|skip.*quality" in
  │ **/*.{ts,js,mjs,sh} (.opencode/skill/system-spec-kit)
  └ 5 lines found

✗ Read quality-scorer.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/quality-scorer.ts
  └ Path does not exist

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1:240 (240 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1480:1625 (146 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2090:2275 (186 lines read)

● Read quality-extractors.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts
  └ 45 lines read

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L930:1060 (131 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2330:2475 (146 lines read)

● Search (grep)
  │ "QUALITY_ABORT_THRESHOLD|QUALITY_WARN_THRESHOLD|QUALITY|MIN_QUALITY|shouldIndexMemoryForWorkflow
  │ |decideWorkflowIndexing|indexing disposition|write_skip_index|skip_index|skipped_quality_gate"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 15 lines found

I’ve got the workflow gating flow; now I’ll extract hard thresholds from config/tests and then compute an empirical quality distribution from real memory files, including CLI source tags.

✗ Compute quality distribution from target memory files (shell)
  │ python - <<'PY'
  │ from pathlib import Path
  │ import re, json
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02-
  │ -system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory')…
  └ Permission denied and could not request permission from user

● Read save-quality-gate.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts
  └ 1 line read

● Read memory-save-pipeline-enforcement.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts
  └ 1 line read

● Read ceiling-quality.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts
  └ 523 lines read

● Read config.ts
  │ .opencode/skill/system-spec-kit/scripts/core/config.ts
  └ 369 lines read

● Search (grep)
  │ "^---$|^title:|^description:|^quality_score:|^quality_flags:|^session_source:|^capture_source:|^
  │ source:|^tool_name:|^date:" in *.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory)
  └ 5 lines found

● Search (glob)
  │ ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/
  │ **/*.md"
  └ 9 files found

● Read 14-03-26_15-47__code-issues-found-during-review.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/1
  │ 4-03-26_15-47__code-issues-found-during-review.md
  └ L1:80 (80 lines read)

● Read 15-03-26_12-22__verified-trigger-phrase-yaml-rendering.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/1
  │ 5-03-26_12-22__verified-trigger-phrase-yaml-rendering.md
  └ L1:80 (80 lines read)

● Read 15-03-26_12-22__pass-automated-checks-100-pass-rate-across-lint.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/1
  │ 5-03-26_12-22__pass-automated-checks-100-pass-rate-across-lint.md
  └ L1:80 (79 lines read)

● Read 15-03-26_12-22__pass-automated-validation-is-strong-all-listed.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/1
  │ 5-03-26_12-22__pass-automated-validation-is-strong-all-listed.md
  └ L1:80 (79 lines read)

● Read 17-03-26_14-47__the-march-17-2026-re-analysis-disposition-for.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/1
  │ 7-03-26_14-47__the-march-17-2026-re-analysis-disposition-for.md
  └ L1:80 (80 lines read)

● Read 17-03-26_16-16__post-re-analysis-documentation-maintenance-for.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/1
  │ 7-03-26_16-16__post-re-analysis-documentation-maintenance-for.md
  └ L1:80 (80 lines read)

● Read 17-03-26_16-44__strict-closeout-evidence-refreshed.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/1
  │ 7-03-26_16-44__strict-closeout-evidence-refreshed.md
  └ L1:80 (79 lines read)

● Read 20-03-26_07-47__session-identity-passthrough-via-session-id-cli.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/2
  │ 0-03-26_07-47__session-identity-passthrough-via-session-id-cli.md
  └ L1:80 (80 lines read)

● Read 17-03-26_19-49__bimodal-quality-distribution-in-historical-memory.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/1
  │ 7-03-26_19-49__bimodal-quality-distribution-in-historical-memory.md
  └ L1:80 (80 lines read)

● Search (grep)
  │ "QUALITY_ABORT_THRESHOLD|qualityAbortThreshold|quality_score|min_quality_score|minQualityScore|w
  │ rite_skip_index|skipped_quality_gate|shouldIndexMemory\(|sufficiency|INSUFFICIENT_CONTEXT_ABORT|
  │ QUALITY_GATE_ABORT"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts)
  └ No matches found

● Read quality-scorer.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts
  └ 235 lines read

● Search (grep)
  │ "QUALITY_ABORT_THRESHOLD|qualityAbortThreshold|MIN_QUALITY|0\.15|0\.30|quality_score|index|skip"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts)
  └ 16 lines found

I found a key anomaly already (`quality_score` metadata can be ignored when frontmatter isn’t at byte 0). I’ll now pull the exact indexability gates and any CLI/source signals from tests and broader memory files.

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ 1 line read

● Read save-quality-gate.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts
  └ L1:260 (260 lines read)

● Read memory-save-pipeline-enforcement.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts
  └ L960:1060 (101 lines read)

● Read save-quality-gate.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts
  └ L261:520 (260 lines read)

● Read memory-save-pipeline-enforcement.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts
  └ L430:560 (131 lines read)

● Search (grep)
  │ "quality_score:\s*([0-9]+\.[0-9]+)|quality_flags:|title:|description:|session_source:|capture_so
  │ urce:|source:" in *.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory)
  └ 36 lines found

● Search (grep)
  │ "copilot|claude|codex|gemini|opencode|session_source|capture_source|source:\s|_sourceTranscriptP
  │ ath|Channel \|" in **/memory/*.md (.opencode/specs)
  └ 5 lines found

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L1:260 (259 lines read)

● Read source-capabilities.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts
  └ 82 lines read

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L120:230 (110 lines read)

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L561:860 (189 lines read)

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L261:560 (300 lines read)

● Read claude-code-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/claude-code-capture.vitest.ts
  └ L1:240 (240 lines read)

● Read copilot-cli-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/copilot-cli-capture.vitest.ts
  └ L1:240 (239 lines read)

● Read codex-cli-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/codex-cli-capture.vitest.ts
  └ L1:240 (240 lines read)

● Read generate-context-cli-authority.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts
  └ L1:260 (257 lines read)

● Read save-quality-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ 1 line read

● Search (grep)
  │ "SIGNAL_DENSITY_THRESHOLD|SEMANTIC_DEDUP_THRESHOLD|MIN_CONTENT_LENGTH|runQualityGate|scoreConten
  │ tQuality|weights|threshold|warnOnly|wouldReject"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts)
  └ 36 lines found

● Search (grep)
  │ "runQualityLoop|threshold|0\.6|quality loop|SPECKIT_QUALITY_LOOP" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● List directory .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capt…
  └ 11 files found

● Search (grep)
  │ "copilot-cli-capture|claude-code-capture|codex-cli-capture|gemini-cli-capture|opencode-capture|_
  │ sourceSessionId:|_sourceTranscriptPath:" in **/memory/*.md (.opencode/specs)
  └ 5 lines found

● Search (grep)
  │ "^quality_score:\s*([0-9]+\.[0-9]+)" in **/memory/*.md (.opencode/specs)
  └ 5 lines found

● Search (grep)
  │ "\| Channel \|" in **/memory/*.md (.opencode/specs)
  └ 5 lines found

● Read save-quality-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ L90:220 (131 lines read)

● Read save-quality-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ L430:560 (131 lines read)

● Read save-quality-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ L610:735 (118 lines read)

● Read metadata.json
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/m
  │ etadata.json
  └ 218 lines read

● Search (grep)
  │ "_source:\s*'copilot-cli-capture'|_source:\s*'codex-cli-capture'|_source:\s*'claude-code-capture
  │ '|_source:\s*'gemini-cli-capture'|session_source|capture_source" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 8 lines found

● Search (grep)
  │ "_sourceTranscriptPath:\s*"[^"]+"|_sourceSessionId:\s*"[^"]+"|quality_score:\s*[0-9]+\.[0-9]+|\|
  │ Channel \|" in **/memory/*.md (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ 5 lines found

● Read memory-render-fixture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts
  └ L500:660 (161 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L340:490 (151 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1980:2085 (106 lines read)

● Read stateless-enrichment.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts
  └ L1:240 (240 lines read)

● Search (grep)
  │ "QUALITY_ABORT_THRESHOLD|0\.15|qualityAbortThreshold" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 7 lines found

● Search (grep)
  │ "inject.*source|sourceProvenance|_sourceTranscriptPath|_sourceSessionId|session_source|capture_s
  │ ource|source:\s" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "^_sourceTranscriptPath:\s*".+"" in **/memory/*.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ 8 lines found

● Search (grep)
  │ "^quality_score:\s*([0-9]+\.[0-9]+)" in **/memory/*.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ 5 lines found

● Search (grep)
  │ "(^|\s)(claude|copilot|codex|gemini|opencode)-(cli-)?capture" in **/memory/*.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ No matches found

● Search (grep)
  │ "^_sourceSessionId:\s*".+"" in **/memory/*.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ 8 lines found

● Search (grep)
  │ "\| Channel \|\s*(.+)\|" in **/memory/*.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ 5 lines found

● Search (grep)
  │ "simulation|stateless|fallback|insufficient_capture|CONTAMINATION_GATE_ABORT|QUALITY_GATE_ABORT|
  │ INSUFFICIENT_CONTEXT_ABORT" in **/*.{ts,js,md} (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

I’m now sampling the `016-multi-cli-parity` memory corpus directly so we can compare quality scores and provenance by CLI, not just infer from code.

● List directory .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capt…
  └ 8 files found

● Read 18-03-26_14-14__claude-code-p1-result-captured-tool-used-mcp.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-mult
  │ i-cli-parity/memory/18-03-26_14-14__claude-code-p1-result-captured-tool-used-mcp.md
  └ L1:90 (90 lines read)

● Read 18-03-26_13-49__claude-code-p1-result-captured-tool-used-mcp.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-mult
  │ i-cli-parity/memory/18-03-26_13-49__claude-code-p1-result-captured-tool-used-mcp.md
  └ L1:90 (90 lines read)

● Search (grep)
  │ "^title:|^description:|^quality_score:|^quality_flags:|^_sourceTranscriptPath:|^_sourceSessionId
  │ :|\| Channel \|" in *.md (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-
  │ session-capturing/016-multi-cli-parity/memory)
  └ 42 lines found

✗ Read memory
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-capture-quality-parity/memory
  └ Path does not exist

✗ Search (grep)
  │ "claude|copilot|codex|gemini" in *.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-capture-quality-parity/memory)
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spe
    c-kit/022-hybrid-rag-fusion/025-capture-quality-parity/memory: IO error for operation on
    /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-ki
    t/022-hybrid-rag-fusion/025-capture-quality-parity/memory: No such file or directory (os error
    2)

✗ Search (grep)
  │ "^title:|^description:|^quality_score:|^quality_flags:|^_sourceTranscriptPath:|^_sourceSessionId
  │ :|\| Channel \|" in *.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-capture-quality-parity/memory)
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spe
    c-kit/022-hybrid-rag-fusion/025-capture-quality-parity/memory: IO error for operation on
    /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-ki
    t/022-hybrid-rag-fusion/025-capture-quality-parity/memory: No such file or directory (os error
    2)

● Read 17-03-26_19-49__bimodal-quality-distribution-in-historical-memory.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/1
  │ 7-03-26_19-49__bimodal-quality-distribution-in-historical-memory.md
  └ L1:60 (60 lines read)

● Read file-helpers.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts
  └ L1:260 (180 lines read)

● Read 17-03-26_16-44__strict-closeout-evidence-refreshed.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/1
  │ 7-03-26_16-44__strict-closeout-evidence-refreshed.md
  └ L1:60 (59 lines read)

● Search (grep)
  │ "validateDescription|getDescriptionTierRank|placeholder|activity-only|semantic|high-confidence"
  │ (.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts)
  └ 16 lines found

Findings for **Q11**:

1) **Scoring criteria**  
Two scorers exist. Legacy scorer (0–100) weights triggers/topics/file descriptions/content length/HTML leakage/dedup, then applies contamination + sufficiency caps (`scripts/core/quality-scorer.ts:185-356`). V2 scorer (0.0–1.0) starts at 1.0, penalizes failed V1–V12 rules, applies insufficiency/contamination caps, and adds small message/tool/decision bonuses (`scripts/extractors/quality-scorer.ts:102-220`).

2) **Indexable threshold**  
Workflow indexing requires: template pass, sufficiency pass, and `qualityScore01 >= QUALITY_ABORT_THRESHOLD` (default `0.15`) (`scripts/core/workflow.ts:150-201, 2213-2221`, `scripts/core/config.ts:239,303`). Also blocked by validation disposition `write_skip_index/abort_write` (`scripts/memory/validate-memory-quality.ts:416-446`).

3) **Actual sampled range (target folder)**  
In `010-perfect-session-capturing/memory`: declared `quality_score` range is **0.82–1.00** (8 files at 1.00, 1 at 0.82).  
But one file has text prepended before frontmatter, so parser-at-byte-0 can read effective quality as 0 (`.../17-03-26_19-49...md:1-4`, `shared/parsing/quality-extractors.ts:5-27`).

4) **Low-quality patterns**  
Short/generic sessions, missing triggers/topics, placeholder/generic descriptions, duplicate observations, contamination, and insufficient evidence are penalized (`scripts/core/quality-scorer.ts:185-323`, `scripts/utils/file-helpers.ts:26-147`, `scripts/tests/memory-sufficiency.vitest.ts`).  
Stateless/simulation paths are riskier for frontmatter displacement due prepended warnings (`scripts/core/workflow.ts:2168-2177, 2251-2256`).

5) **CLI comparison**  
In sampled multi-CLI-parity memories, only **Claude-provenanced** files are explicit (`_sourceTranscriptPath` under `.claude`), and they score 1.00 (one flagged contamination) (`016-multi-cli-parity/memory/*claude*.md`).  
I don’t see evidence here that one CLI is consistently lower-quality; dataset is too sparse/imbalanced.


Total usage est:        1 Premium request
API time spent:         8m 44s
Total session time:     9m 7s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex            2.0m in, 22.9k out, 1.8m cached (Est. 1 Premium request)
