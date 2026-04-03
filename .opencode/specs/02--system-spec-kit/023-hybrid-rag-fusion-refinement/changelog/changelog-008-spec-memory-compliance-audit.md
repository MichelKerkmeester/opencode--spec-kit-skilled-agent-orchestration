## [v0.8.0] - 2026-03-31

This audit matters because it turns the spec and memory foundation back into something people can trust before building more work on top of it. The work covered 186 folders and 135 memory files, repaired the in-scope spec library to zero validation errors, rebuilt the search database from a clean baseline, and confirmed the metadata-format repair after the MCP server (the local memory-service process) restart.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit` (Level 2)

---

## Documentation (4)

The biggest risk was quiet document drift. When core structure rules slip across hundreds of files, the library stops being something people and tools can trust.

### Baseline audit

**Problem:** Before the repair work started, there was no dependable map of how much of the library had drifted out of compliance. Active folders, archived folders, and phase folders were failing for different reasons, which made it easy to spend time on the wrong fixes first.

**Fix:** The audit started by measuring the whole library and grouping failures by pattern. That turned a vague cleanup into a ranked repair plan, so each repair wave could focus on the highest-volume problems first and show whether the library was actually getting healthier.

### Bulk spec repair

**Problem:** Across the library, frontmatter (the metadata block at the top of a file) and anchor markers (named labels that help tools jump to the right section) had drifted out of shape. Small defects like missing markers, unclosed sections, and outdated headings added up to a system that validated poorly and was hard to automate reliably.

**Fix:** The repair normalized those repeated structural problems at scale. After the cleanup, the spec set could be checked, navigated, and reused much more consistently instead of failing for hundreds of small structural mistakes.

### Clearer project summaries

**Problem:** Many implementation summaries explained what changed but did not clearly say what still needed follow-up. That leaves the next person with a clean story on paper while the real limits stay hidden.

**Fix:** The audit made those summaries more honest about remaining gaps and follow-up work. That improves handoff quality because future work starts with the limits already stated instead of rediscovering them later.

### Template marker restoration

**Problem:** A small set of core audit documents no longer said which template they came from. Without that lineage, reviewers cannot easily tell whether a file is complete or whether it has drifted away from the structure it was supposed to follow.

**Fix:** The missing template-source markers were restored in four core audit documents. That makes future checks easier to trust because reviewers can compare each file against the right starting point.

---

## Search (2)

Search quality depends on clean saved context underneath it. This phase treated the index like a library catalog, remove the broken cards first, then rebuild the catalog from clean records.

### Hard-block memory cleanup

**Problem:** Dozens of memory files had hard-block failures (errors severe enough to stop a memory from being accepted safely). Leaving them in place would keep poisoning future indexing runs and blur the line between valid history and broken records.

**Fix:** The audit removed every hard-blocked file, then rechecked what remained. That left a smaller but trustworthy memory set, so future indexing starts from content the system can actually use.

### Clean rebuild from zero

**Problem:** The search database still contained orphaned search vectors (search-index entries with no matching memory record). A partial repair would have left too much doubt about whether later results came from clean data or from leftover debris.

**Fix:** The database was cleaned, backed up, and rebuilt from zero so search starts from repaired files rather than from old residue. After the rebuild, the system had a fresh baseline instead of a patched-over one.

---

## Architecture (1)

### Hybrid repair strategy

**Problem:** The repair touched too many files for hand editing alone, but too many edge cases for blind automation alone. Either extreme would have made the cleanup slower or less trustworthy.

**Fix:** The phase split repetitive structural cleanup from judgment-heavy review. Automation handled the bulk repairs, while separate helper runs handled the folder-level decisions that needed closer inspection, keeping the audit fast without turning it into an opaque mass edit.

---

## Bug Fixes (1)

### Search metadata format mismatch

**Problem:** During the rebuild, one set of search labels was being stored in two different shapes. That mismatch could make the local memory service stumble when it tried to read repaired records, which undercut confidence in the rebuilt index.

**Fix:** The service now accepts both shapes, so repaired memories can be read without hitting that crash path. The immediate repair was verified after the MCP server restart, while the broader follow-up search check was still marked as pending in the implementation summary.

---

## Testing (2)

Large cleanups only matter if the results can be checked, not just described.

### Validation sweep

**Problem:** Without a final sweep, the team would still be trusting the repair process instead of the repaired library itself.

**Fix:** Repeated strict validation confirmed that every in-scope folder reached zero errors. The only excluded tree was the one intentionally left out because it was under active work.

### Database health verification

**Problem:** A rebuilt index can still look healthy while hiding leftover records or restart-only issues.

**Fix:** Post-rebuild health checks confirmed that the leftover search-index records were gone, the rebuilt database was healthy, and the repaired service could start again with the metadata-format fix loaded. That gives the audit a checked stopping point instead of a hopeful one.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Active folders with validation errors | 97 | 0 |
| Archived folders with validation errors | 65 | 0 |
| Hard-block memory files | 46 | 0 |
| Orphaned search-index records | 2 | 0 |
| Indexed memories in database | 1004 | 1134 |

No new automated test files were added. Verification came from strict validation sweeps, memory-quality rechecks, orphan cleanup confirmation, post-rebuild health checks, and the MCP server restart check for the metadata-format repair.

---

<details>
<summary>Technical Details: Files Changed (17 total)</summary>

### Source (10 files)

| File | Changes |
| ---- | ------- |
| `.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts` | Ran the bulk frontmatter normalization pass across 2,081 files. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/scratch/fix-anchors.py` | Inserted missing anchor markers, repaired unclosed anchors, and removed duplicate legacy anchors during the audit. |
| `.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts` | Removed orphaned search-index records before the rebuild. |
| `.opencode/skill/system-spec-kit/scripts/dist/memory/reindex-embeddings.js` | Rebuilt the memory database from zero after filesystem cleanup. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` | Added the source-side metadata guard for the search-label format mismatch. |
| `.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.js` | Added the compiled runtime copy of the same metadata guard. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts` | Added source-side handling for search labels stored in array form. |
| `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/learned-feedback.js` | Added the compiled runtime copy of the same array-safe handling. |
| `.opencode/skill/system-spec-kit/mcp_server/dist/lib/governance/scope-governance.js` | Included in the compiled-runtime audit surface for surrounding search and governance checks during this compliance packet. |
| `.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-search.js` | Included in the compiled-runtime audit surface for surrounding rebuilt-search checks during this compliance packet. |

### Tests (0 files)

No new automated test files were added in this phase. Verification used strict validation sweeps, post-cleanup memory checks, orphan cleanup confirmation, database health checks, and the recorded MCP server restart verification for the metadata-format repair.

### Documentation (7 files)

| File | Changes |
| ---- | ------- |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/spec.md` | Restored the `SPECKIT_TEMPLATE_SOURCE` marker and kept the audit scope aligned with the active packet. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/plan.md` | Restored the `SPECKIT_TEMPLATE_SOURCE` marker and preserved the ranked repair plan. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/tasks.md` | Restored the `SPECKIT_TEMPLATE_SOURCE` marker and tracked the execution wave details. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/checklist.md` | Restored the `SPECKIT_TEMPLATE_SOURCE` marker and recorded verification checkpoints. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/implementation-summary.md` | Recorded final audit counts, the restart-based verification note, and the broader follow-up search check as pending. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/research/discovery-summary.md` | Captured baseline error counts and the folder breakdown used to prioritize repair waves. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/research/hard-block-memories.txt` | Captured the deletion set for memory files that could not safely stay in the rebuilt corpus. |

</details>

---

## Upgrade

No migration required.

If a local MCP server process is still running older code in memory, restart it once so the metadata-format repair is loaded. This release records that restart verification, not a full end-to-end follow-up search retest.
