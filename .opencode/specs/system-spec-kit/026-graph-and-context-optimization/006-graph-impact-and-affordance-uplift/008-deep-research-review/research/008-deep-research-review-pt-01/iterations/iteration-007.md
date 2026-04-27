---
_memory:
  continuity:
    next_safe_action: "Iter 008 should drill 010/007 T-A..T-F closure integrity against shipped code, prioritizing the 33 claimed closures and known F12/F14/F17 contradictions."
---
# Iteration 007 — 010/006 umbrella docs vs code reality

**Focus:** Audit doc claims against code on main; flag drift.
**Iteration:** 7 of 10
**Convergence score:** 0.79

## Section A verdicts (root README)
- A1 — CONFIRMED-MATCHES-CODE. Root README claims 60 native MCP tools and 51 `spec_kit_memory` tools at `README.md:1261` and `README.md:1300`. `TOOL_DEFINITIONS` contains 51 exported entries at `mcp_server/tool-schemas.ts:875-938`.
- A2 — CONFIRMED-MATCHES-CODE. `detect_changes` is described as wired into the Code Graph MCP surface at `README.md:538-540`; code confirms schema, dispatcher, and Zod registration at `tool-schemas.ts:636-647`, `code_graph/tools/code-graph-tools.ts:20-29`, `code_graph/tools/code-graph-tools.ts:75-80`, and `schemas/tool-input-schemas.ts:619`.
- A3 — CONFIRMED-MATCHES-CODE. Blast-radius docs claim `depthGroups`, `riskLevel`, `minConfidence`, `ambiguityCandidates`, and `failureFallback` at `README.md:533-535`; code surfaces these fields in `code_graph/handlers/query.ts:986-1008` and `code_graph/handlers/query.ts:1298-1302`, with `minConfidence` in the public schema at `tool-schemas.ts:576-584`.
- A4 — CONFIRMED-MATCHES-CODE. Trust badges are documented as per-result additive fields with fail-open/profile preservation at `README.md:420-430`; code defines and attaches `trustBadges` in `formatters/search-results.ts:179-191`, `formatters/search-results.ts:331-338`, `formatters/search-results.ts:751-788`, and preserves the shape in `lib/response/profile-formatters.ts:54-59`.
- A5 — CONFIRMED-MATCHES-CODE with one known external caveat. Root README says affordance evidence uses structured hints, strips unsafe/free-form content, and routes through `derived_generated` plus `graph_causal` at `README.md:660-662`; code confirms normalizer/fusion/lane routing at `skill_advisor/lib/scorer/fusion.ts:143-155`, `skill_advisor/lib/scorer/fusion.ts:241-242`, `skill_advisor/lib/scorer/lanes/derived.ts:39-61`, and `skill_advisor/lib/scorer/lanes/graph-causal.ts:34-43`. The known F14-iter5 caveat remains: Python rejects `conflicts_with` affordances while TS still accepts them.

## Section B verdicts (SKILL.md + system-spec-kit/README.md)
- B1 — DRIFT-FROM-CODE for tool counts, CONFIRMED-MATCHES-CODE for `detect_changes` and blast-radius details. `SKILL.md` still says `context-server.ts` has 48 tools across 7 layers at `.opencode/skill/system-spec-kit/SKILL.md:568` and "18 most-used of 47 total" at `SKILL.md:572`, but the canonical export is 51 at `tool-schemas.ts:875-938`. Its `detect_changes` and blast-radius rows match shipped wiring and fields at `SKILL.md:770-773`.
- B2 — CONFIRMED-MATCHES-CODE. `system-spec-kit/README.md` now carries the 51 canonical-source note at `README.md:62`, lists `detect_changes` as wired at `README.md:109` and `README.md:121`, describes blast-radius enrichment at `README.md:119`, affordance lanes at `README.md:133`, and trust badges at `README.md:404-414`; those match the cited code surfaces.

## Section C verdicts (mcp_server README)
- C1 — DRIFT-FROM-CODE. The architecture table claims total 51 and lists L8/L9 at `mcp_server/README.md:1285-1287`, but the detailed "Tool Reference" promises tools are listed by layer at `mcp_server/README.md:608` and only has 40 `#####` tool sections. It omits detailed sections for `skill_graph_*`, `advisor_*`, and `deep_loop_graph_*` even though those are in `TOOL_DEFINITIONS` at `tool-schemas.ts:920-937`.
- C2 — CONFIRMED-MATCHES-CODE at the summary layer. The L8/L9 architecture breakdown at `mcp_server/README.md:1285-1287` matches the exported groups in `tool-schemas.ts:915-937`.
- C3 — CONFIRMED-MATCHES-CODE. `detect_changes` is documented as MCP-wired at `mcp_server/README.md:552` and `mcp_server/README.md:1173-1182`; code confirms the handler export, dispatcher case, schema, and Zod validator at `code_graph/handlers/index.ts:11`, `code_graph/tools/code-graph-tools.ts:20-29`, `code_graph/tools/code-graph-tools.ts:75-80`, `tool-schemas.ts:636-647`, and `schemas/tool-input-schemas.ts:619`.
- C4 — DRIFT-FROM-CODE for at least `code_graph_query`. The per-handler text and parameter table omit `blast_radius`, `subjects`, `unionMode`, and `minConfidence` at `mcp_server/README.md:1054-1068`, while schema/code expose them at `tool-schemas.ts:576-584` and `schemas/tool-input-schemas.ts:116-123`, `schemas/tool-input-schemas.ts:676`.

## Section D verdicts (INSTALL_GUIDE)
- D1 — CONFIRMED-MATCHES-CODE. The §4c Python smoke-test path fix landed: after `cd .opencode/skill/system-spec-kit/mcp_server`, the guide runs `python3 skill_advisor/tests/python/test_skill_advisor.py` at `mcp_server/INSTALL_GUIDE.md:516-523`.
- D2 — DRIFT-FROM-CODE for umbrella count, CONFIRMED-MATCHES-CODE for the new capability smoke signatures. The guide still says the server provides 43 tools at `mcp_server/INSTALL_GUIDE.md:5`, contradicting the 51-tool canonical export at `tool-schemas.ts:875-938`. The `detect_changes` smoke uses `{ diff, rootDir }` at `INSTALL_GUIDE.md:486-495`, matching `tool-schemas.ts:642-645`; blast-radius smoke uses `code_graph_query({ operation: "blast_radius", subject, maxDepth, minConfidence })` at `INSTALL_GUIDE.md:503-508`, matching `tool-schemas.ts:576-584`. The memory smoke at `INSTALL_GUIDE.md:466-472` is a natural-language client prompt, not a handler-signature claim.

## Section E verdicts (feature_catalog)
- E1 — CONFIRMED-MATCHES-CODE for the 010/006 index entries. The Phase 012 audit table lists all five authored entries at `feature_catalog/feature_catalog.md:49-55`.
- E2 — CONFIRMED-MATCHES-CODE. No `FEATURE_CATALOG_IN_SIMPLE_TERMS.md` link remains under `feature_catalog/`; the root README now states the companion is a future deliverable at `README.md:1266-1287`.
- E3 — CONFIRMED-MATCHES-CODE with metadata caveat. The five entries exist and cite relevant `mcp_server` sources: detect_changes at `03--discovery/04-detect-changes-preflight.md:41-49`, blast radius at `06--analysis/08-code-graph-edge-explanation-blast-radius-uplift.md:34-45`, affordance evidence at `11--scoring-and-calibration/24-skill-advisor-affordance-evidence.md:32-45`, trust badges at `13--memory-quality-and-indexing/28-memory-causal-trust-display.md:37-45`, and phase runner at `14--pipeline-architecture/25-code-graph-phase-dag-runner.md:47-56`. Caveat: the feature catalog root still has a stale 43-tool command-surface statement at `feature_catalog/feature_catalog.md:171`.

## Section F verdicts (manual_testing_playbook)
- F1 — CONFIRMED-MATCHES-CODE. The index lists 014, 026, 199, 203, and 271 at `manual_testing_playbook/manual_testing_playbook.md:70-76`.
- F2 — CONFIRMED-MATCHES-CODE. Source metadata points to the correct 010 sub-phases: detect_changes/phase-runner to 010/002 at `014-detect-changes-preflight.md:92` and `271-code-graph-phase-dag-runner.md:69`; blast radius to 010/003 at `026-code-graph-edge-explanation-blast-radius-uplift.md:125`; affordance evidence to 010/004 at `199-skill-advisor-affordance-evidence.md:103`; trust badges to 010/005 at `203-memory-causal-trust-display.md:85`.
- F3 — CONFIRMED-MATCHES-CODE. The 011-added blocks are preserved: detect_changes Blocks B/C at `014-detect-changes-preflight.md:44-62`; blast-radius Blocks B/C/D/E at `026-code-graph-edge-explanation-blast-radius-uplift.md:45-77`; affordance Block B at `199-skill-advisor-affordance-evidence.md:50-68`; trust-badge Block B at `203-memory-causal-trust-display.md:42-63`.

## New findings (use IDs F19+ to avoid collision)
- F19 — P2, doc-fix, RQ4. `SKILL.md` has stale 48/47 tool-count claims. Evidence: `.opencode/skill/system-spec-kit/SKILL.md:568` says 48 MCP tools and `SKILL.md:572` says 47 total, while `TOOL_DEFINITIONS` exports 51 entries at `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:875-938`. Remediation: update the server summary and "most-used" wording to the 51-tool canonical count, or avoid total counts outside the canonical source.
- F20 — P2, doc-fix, RQ4. `mcp_server/INSTALL_GUIDE.md` still advertises 43 tools. Evidence: `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:5` says 43 tools; canonical export is 51 at `tool-schemas.ts:875-938`. Remediation: replace the count with the canonical 51-tool note and include L8/L9 in the setup overview.
- F21 — P2, doc-fix, RQ4. `mcp_server/README.md` detailed tool reference is not actually a 51-tool reference. Evidence: `mcp_server/README.md:608` promises tools are listed by architecture layer, but the file has only 40 `#####` tool sections and omits detailed sections for `skill_graph_*`, `advisor_*`, and `deep_loop_graph_*`; the omitted tools are exported at `tool-schemas.ts:920-937`. Remediation: add L8 skill graph/advisor and L9 deep-loop tool sections or retitle the detailed section as a partial reference.
- F22 — P2, doc-fix, RQ4. `mcp_server/README.md` `code_graph_query` handler docs omit the shipped blast-radius parameters. Evidence: the doc lists operations as `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to` and parameters through `maxDepth` at `mcp_server/README.md:1054-1068`; the schema includes `blast_radius`, `subjects`, `unionMode`, and `minConfidence` at `tool-schemas.ts:576-584` and allows those parameters at `schemas/tool-input-schemas.ts:676`. Remediation: update the per-handler section to match the JSON schema.
- F23 — P2, doc-fix, RQ4. `feature_catalog/feature_catalog.md` retains a stale 43-tool command-surface count even though its Phase 012 audit section knows about the new entries. Evidence: `feature_catalog/feature_catalog.md:171` says 43 tools; `tool-schemas.ts:875-938` exports 51. Remediation: update the command-surface contract paragraph to the 51-tool canonical count and clarify command-owned subsets separately from total MCP registry size.

## Negative findings (CONFIRMED-matches-code items)
- Root README's 60-total / 51-spec-kit-memory count matches `TOOL_DEFINITIONS.length`.
- `detect_changes` is now wired as a top-level MCP tool in schema, Zod validation, handler export, and dispatcher.
- Root/SKILL/system README/mcp README `blast_radius` enrichment claims match the shipped response surface for `depthGroups`, `riskLevel`, `minConfidence`, `ambiguityCandidates`, and structured `failureFallback`.
- Trust-badge docs match the merge-per-field, fail-open, per-result payload, response-profile preservation, and additive/no-schema-change implementation.
- Affordance evidence docs match the lane routing and privacy-denylist/counter implementation, except for the known F14-iter5 TS/Python `conflicts_with` asymmetry.
- `INSTALL_GUIDE.md` §4c has the corrected Python path from `mcp_server/` cwd.
- Feature catalog and manual testing playbook indexes include the five 010/006 entries/scenarios.
- Manual playbook 011-added Blocks B/C/D/E are preserved in the relevant scenario files.

## RQ coverage cumulative through iter 7
- RQ1 — Covered for 010/001-006; no new P0/P1 regressions found in this doc-drift pass.
- RQ2 — Covered for known closure-integrity contradictions F12, F14-iter5, and F17; iteration 7 adds no new closure-code contradiction.
- RQ3 — Covered in iters 1-6 for adversarial code boundaries; iteration 7 confirms docs mostly reflect shipped hardening surfaces.
- RQ4 — Expanded substantially in iteration 7 with F19-F23 umbrella doc/catalog drift.
- RQ5 — Covered by iters 1-6; iteration 7 confirms manual playbook coverage rows and 011-added blocks are preserved.

## Next iteration recommendation
Iter 008 should drill 010/007 T-A..T-F closure integrity vs code, especially the 33 claimed closures and the already-known F12/F14/F17 contradictions.

JSONL delta:
```jsonl
{"iter":7,"convergence_score":0.79,"findings":[{"id":"F19","severity":"P2","remediation":"doc-fix","rq":"RQ4","title":"SKILL.md still carries stale 48/47 tool-count claims"},{"id":"F20","severity":"P2","remediation":"doc-fix","rq":"RQ4","title":"INSTALL_GUIDE still advertises 43 tools"},{"id":"F21","severity":"P2","remediation":"doc-fix","rq":"RQ4","title":"mcp_server README detailed tool reference omits 11 of 51 tools"},{"id":"F22","severity":"P2","remediation":"doc-fix","rq":"RQ4","title":"mcp_server README code_graph_query docs omit blast_radius parameters"},{"id":"F23","severity":"P2","remediation":"doc-fix","rq":"RQ4","title":"feature_catalog command-surface paragraph still says 43 tools"}],"checklist_handled":18,"checklist_drift":5,"rq_coverage":{"RQ1":"No new P0/P1 doc-vs-code drift in 010/006 umbrella docs.","RQ2":"No new closure contradiction; known F12/F14/F17 retained.","RQ3":"Docs match shipped hardening surfaces except known F14 TS/Python caveat.","RQ4":"Expanded with F19-F23 doc/catalog drift findings.","RQ5":"Manual playbook index and 011-added blocks confirmed preserved."},"new_p0":0,"new_p1":0,"new_p2":5}
```

EXIT_STATUS=DONE | findings=5 | convergence=0.79 | matches=13/drift=5 | next=iter-008
