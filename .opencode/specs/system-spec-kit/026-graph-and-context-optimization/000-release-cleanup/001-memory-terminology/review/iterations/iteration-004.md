# Iteration 004 - Maintainability

## Dimension

Maintainability. Focus: closure verification for iteration 3 findings, phrasing consistency across mirrors, documentation quality after the bulk substitution pass, safe follow-on change clarity, and `spec.md` / `phrasing-audit.md` vocabulary alignment.

## Closure Verification

### P1-003 - README TOC anchor integrity

PASS with note.

Evidence:
- Exact user command returned `2`, but both matches are binary database artifacts: `.opencode/skill/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite-wal` and `.opencode/skill/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`.
- Text scan with `rg -n --glob '!scripts/node_modules/**' '\(#[0-9]+--[a-z0-9-]+\)' .opencode/skill/system-spec-kit/` returned zero text hits.
- README overview links now use the single-hyphen heading style in text scope; no packet-owned README/TOC text file showed the prior double-hyphen anchor pattern.

Adjudication: P1-003 is closed for README/TOC text integrity. The exact grep command is not a reliable text-only closure check because it scans SQLite binaries.

### P2-001 - substitution polish drift

FAIL. This closure is not complete.

Evidence:
- `grep -rE 'spec-doc record record' .opencode/skill/system-spec-kit/ 2>/dev/null | wc -l` returned `2`.
- `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:51` still says `the spec-doc record record is written immediately`.
- `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:22` still says `remove the spec-doc record record`.
- The adjective-prefixed scan still finds packet-owned non-cognitive source hits, including `.opencode/skill/system-spec-kit/scripts/core/quality-gates.ts:28`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1499`, `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:21`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:91`, and `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:278`.

Adjudication: The prompt says remaining closure hits are P0 regressions. P2-001 is therefore not closed and escalates to P0 for this iteration.

## Files Sampled

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/phrasing-audit.md`
- `.opencode/skill/system-spec-kit/README.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`
- `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md`
- `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md`
- `.opencode/skill/system-spec-kit/feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md`
- `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md`
- `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md`
- `.opencode/skill/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`
- `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts`
- `.opencode/skill/system-spec-kit/scripts/core/quality-gates.ts`
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`

## Findings by Severity

### P0

#### P0-004 [P0] Closure regression: residual bulk-substitution targets remain in packet-owned docs and source

- File: `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:51`
- Claim: Iteration 3 closure claimed all `spec-doc record record` duplicates and adjective-prefixed legacy `memory` phrases were removed, but packet-owned text still contains both classes.
- EvidenceRefs: `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:51`, `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:22`, `.opencode/skill/system-spec-kit/scripts/core/quality-gates.ts:28`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1499`, `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:21`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:91`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:278`.
- CounterevidenceSought: Re-ran the exact closure scans, then rechecked with `rg -n` excluding `scripts/node_modules/**` and `cognitive/**`. The duplicate hits are in feature-catalog markdown; the adjective-prefixed hits are in packet-owned scripts, handler/schema prose, tests, and architecture docs, not only third-party or cognitive-literature carve-outs.
- AlternativeExplanation: Some residual `memory` tokens are frozen identifiers, product names, trigger phrases, test fixture strings, or cognitive loanwords. That explanation does not cover the duplicate `spec-doc record record` text or the non-cognitive comments/descriptions caught by the exact closure regex.
- FinalSeverity: P0.
- Confidence: High.
- DowngradeTrigger: Downgrade only if the review owner explicitly narrows the closure rule to markdown-only and excludes source comments/descriptions from the requested scan. Under the prompt as written, any remaining hit is a P0 regression.

### P1

None.

### P2

#### P2-002 [P2] Nearby catalog/schema prose still mixes old and modernized nouns, reducing follow-on edit clarity

- File: `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:24`
- Evidence: The same delete catalog entry that now says `spec-doc record` at line 22 still says `per-memory causal edge cleanup`, `per-memory mutation ledger entries`, and `all memories in the folder` at line 24. Tool-schema prose also preserves broad labels such as `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:222` (`spec kit memory database`) next to modernized `indexed spec docs`, `constitutional rules`, and `spec-doc records` at lines 48, 55, and 229.
- Recommendation: After the P0 cleanup, run a focused vocabulary pass across adjacent paragraphs and schema descriptions so each local concept uses one noun consistently: record rows as `spec-doc records`, corpus/store as `indexed continuity`, rule rows as `constitutional rules`, and identifiers/tool names left frozen.

## Verdict

FAIL.

Reason: P2-001 closure verification failed and the prompt escalates remaining closure hits to P0. P1-003 is closed for text README/TOC scope, with a binary-database false positive in the exact grep command. No new P1 findings were found.

`hasAdvisories=true` because P2-002 remains as a non-blocking maintainability advisory after the P0 regression is fixed.

## Next Dimension

Convergence or remediation verification. The next pass should first re-run the closure scans after P0-004 is fixed, then perform a short stabilization pass over the maintainability advisory surface.
