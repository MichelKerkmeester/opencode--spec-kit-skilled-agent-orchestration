# Iteration 003

## Focus

Continue the 015 delta-review by batch-auditing the reconsolidation follow-ons, hook-state durability, post-insert enrichment, and playbook/manual-testing clusters that iteration 002 left mostly in `UNVERIFIED`.

## Actions Taken

1. Re-read the prior batch results in `iteration-001.md` and `iteration-002.md` to keep the reconsolidation/path-boundary carryovers separate from the new cluster work.
2. Re-scanned the 015 source report for the target clusters in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/015-deep-review-and-remediation/review-report.md` (`reconsolidation`, `skill_graph_scan`, `skill_graph_query`, hook coverage, and playbook/script-eval anchors).
3. Verified the current hook-state and Claude/Gemini stop-hook implementations in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts`.
4. Verified the current enrichment and reconsolidation primitives in `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`.
5. Verified the current skill-graph disclosure surface in `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts` and `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`, and confirmed that the old script-eval surfaces named in 015 no longer exist on current main (`.opencode/skill/sk-doc/scripts/manual-playbook-runner.ts`, `.opencode/skill/sk-doc/scripts/compile-skill-graph.ts`, `.opencode/skill/sk-doc/scripts/compile-skill-graph.cjs` are absent).

## Findings Batch-Audited

- `10 x P1/P2 / hook-state + Claude stop-hook durability cluster`  
  Classification: `SUPERSEDED`  
  Replacement primitives: `HookStateSchema` + `.bad` quarantine + single atomic `updateState()` autosave contract  
  Current-main evidence: the hook state now parses through Zod-backed `HookStateSchema` and quarantines malformed state files to `*.bad` (`hook-state.ts:25`, `:55`, `:302-315`, `:337-359`), while the Claude stop hook explicitly documents and enforces the "single atomic updateState call" / "no torn-state window" invariant before autosave (`session-stop.ts:87-94`, `:310-311`, `:478-497`). These are replacement primitives, not small in-place patches to the 015-reviewed helper path.

- `7 x P1/P2 / post-insert + enrichment-status cluster`  
  Classification: `SUPERSEDED`  
  Replacement primitives: `EnrichmentStepStatus` / `EnrichmentStatus` + `runEnrichmentStep()` pipeline + retry-budget ledger  
  Current-main evidence: enrichment no longer collapses outcomes into a single boolean; it tracks per-step enum status (`post-insert.ts:49`, `:73`, `:106`), routes each phase through `runEnrichmentStep()` (`post-insert.ts:233`, `:306`, `:323`, `:345`, `:369`, `:402`), and derives execution/retry state from the retry-budget primitives (`post-insert.ts:27-30`, `:287-293`, `:430-482`, `:538-561`). That makes the 015 enrichment-status complaints design-obsolete rather than live one-line regressions.

- `6 x P1/P2 / reconsolidation follow-on cluster beyond the P0`  
  Classification: `SUPERSEDED`  
  Replacement primitives: scope-filtered reconsolidation + conflict abort status + governance-envelope-aware create-record metadata  
  Current-main evidence: reconsolidation now carries explicit abort states (`reconsolidation.ts:76-108`, `:936-978`) and keeps complement/conflict as first-class controlled exits (`reconsolidation.ts:628`, `:678-683`, `:749-760`, `:967`), while create-record builds scope metadata explicitly before persistence (`create-record.ts:60-65`, `:158-171`). Together with the earlier P0 closure, the remaining complement-window findings read as superseded by the new state machine rather than still attached to the 015-era bridge assumptions.

- `4 x P2 / skill-graph query disclosure cluster`  
  Classification: `SUPERSEDED`  
  Replacement primitive: skill-graph response scrubber in `handlers/skill-graph/query.ts`  
  Current-main evidence: the underlying DB model still contains internal `sourcePath` and `contentHash` fields (`skill-graph-db.ts:27-36`, `:665-666`), but the query handler now strips those fields before serializing any response (`query.ts:187-190`). That moves the old "raw SkillNode leak" findings onto a deprecated response shape rather than the active tool surface.

- `3 x P1/P2 / playbook + manual-testing script-eval cluster`  
  Classification: `SUPERSEDED`  
  Replacement primitive: document-first manual testing / no live runner surface on current main  
  Current-main evidence: the scripts named by the 015 findings no longer exist on current main (`manual-playbook-runner.ts`, `compile-skill-graph.ts`, and `compile-skill-graph.cjs` are absent under `.opencode/skill/sk-doc/scripts/`). With the executable surface removed, the old `Function(...)`-style concerns are no longer attached to a shipping code path.

- `4 x P1/P2 / residual attribution-gap cluster around skill-graph hardening`  
  Classification: `UNVERIFIED`  
  Evidence gap: current main clearly contains a workspace-root guard for `skill_graph_scan` (`handlers/skill-graph/scan.ts`), but this iteration did not recover a concrete 016/017/018 addressing commit tying that guard to the 015 findings. The same attribution gap remains for the broader skill-graph hardening wave because the live handler is safer, but the exact target-wave closure proof is still missing.

## Cumulative Tally

- Findings audited in this iteration: `34`
- Cumulative audited after iteration 003: `65 / 242`
- Cumulative tally: `ADDRESSED=10`, `STILL_OPEN=2`, `SUPERSEDED=35`, `UNVERIFIED=18`
- Remaining unaudited findings after this pass: `177`

## Residual Backlog So Far

- `P1 / resolveDatabasePaths boundary cluster` remains `STILL_OPEN` from iteration 002. Current-main evidence still points at `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:54-56` and `:75-78`.
- `P1/P2 / skill-graph hardening attribution cluster` remains `UNVERIFIED` until a concrete addressing commit is tied to the current `handlers/skill-graph/scan.ts` guard.

## Questions Answered

- `Q1` partial: the cumulative tally now covers `65 / 242` findings, with the biggest movement this iteration coming from `SUPERSEDED` cluster closures rather than new `ADDRESSED` commits.
- `Q3` partial: the hook-state, post-insert, reconsolidation follow-on, and skill-graph query clusters are no longer best described as live 015-style bugs on current main; they have been replaced by newer primitives or removed surfaces.
- `Q5` partial: the residual backlog is narrower. The only confirmed live carryovers remain the two `resolveDatabasePaths` findings, while the skill-graph attribution gap is still evidence-limited rather than a confirmed defect.

## Next Focus

Finish the remaining P1 attribution backlog by tying current `skill_graph_scan` / validator-path guards to concrete commits, then start the first deliberate P2-only sample outside the already-collapsed reconsolidation and hook/enrichment clusters.
