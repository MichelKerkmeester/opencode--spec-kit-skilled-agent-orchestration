● skill(sk-code--review)

I’m gathering the audit evidence first, then I’ll trace the cross-cutting decisions against the actual remediation and source state so the findings are evidence-backed.

✗ memory_match_triggers
  └ Permission denied and could not request permission from user

● Read review_core.md
  │ .agents/skills/sk-code--review/references/review_core.md
  └ L1:220 (98 lines read)

● Read code_quality_checklist.md
  │ .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ L1:220 (162 lines read)

● Read security_checklist.md
  │ .agents/skills/sk-code--review/references/security_checklist.md
  └ L1:220 (206 lines read)

● List directory ~/.copilot/session-state/0b932fa3-3030-4210-9d4e-5f37bcd3966b
  └ 7 files found

I’ve loaded the review rubric. Next I’m mapping the exact spec folders and source modules tied to the 019/021 cross-cutting audit so I can verify each claimed mismatch against code, not just the markdown.

✗ Run skill advisor and create session plan (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep audit of Spec Kit Memory MCP server
  │ feature catalog cross-cutting review for 019-decisions-and-deferrals and
  │ 021-remediation-revalidation. Verify remediation priorities, deprecated modules actioned
  │ state, deferred item tracking, and cross references in .opencode/skill/system-spec-kit."
  │ --threshold 0.8 && cat > …
  └ Permission denied and could not request permission from user

✗ search cross-cutting audit decisions deferrals remediation revalidation graph calibration tempora…
  └ Permission denied and could not request permission from user

● Search (glob)
  │ "**/{019*,021*,009*,010*,011*,013*,016*}/spec.md"
  └ 68 files found

● Search (glob)
  │ "**/FEATURE_CATALOG.md"
  └ 1 file found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019
  │ -decisions-and-deferrals/spec.md
  └ L1:260 (248 lines read)

● Search (grep)
  │ "AUDIT FINDINGS|F11|F15|F21|F23|shadow scoring|graph calibration|fusion policy shadow|assistive
  │ reconsolidation|temporal-contiguity|graph-calibration|deprecated|deferred|revalidation|remediati
  │ on backlog|catalog references"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog)
  └ 5 lines found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021
  │ -remediation-revalidation/spec.md
  └ L1:320 (319 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1:260 (190 lines read)

I’ve confirmed the two cross-cutting specs and the top-level catalog. Now I’m drilling into the exact mismatch claims and the source/module state so I can test whether the remediation summary is internally consistent.

● Search (grep)
  │ "F11|F15|F21|F23|temporal-contiguity|graph-calibration|shadow scoring|fusion policy
  │ shadow|assistive reconsolidation|catalog references|MISMATCH|PARTIAL|AUDIT FINDINGS"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/01
  │ 0-graph-signal-activation/spec.md)
  └ 8 lines found

● Search (grep)
  │ "F11|F15|F21|F23|temporal-contiguity|graph-calibration|shadow scoring|fusion policy
  │ shadow|assistive reconsolidation|catalog references|MISMATCH|PARTIAL|AUDIT FINDINGS"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/01
  │ 1-scoring-and-calibration/spec.md)
  └ 7 lines found

● Search (grep)
  │ "F11|F15|F21|F23|temporal-contiguity|graph-calibration|shadow scoring|fusion policy
  │ shadow|assistive reconsolidation|catalog references|MISMATCH|PARTIAL|AUDIT FINDINGS"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/01
  │ 3-memory-quality-and-indexing/spec.md)
  └ 12 lines found

● Search (grep)
  │ "F11|F15|F21|F23|temporal-contiguity|graph-calibration|shadow scoring|fusion policy
  │ shadow|assistive reconsolidation|catalog references|MISMATCH|PARTIAL|AUDIT FINDINGS"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/01
  │ 6-tooling-and-scripts/spec.md)
  └ 8 lines found

● Search (glob)
  │ "**/*{temporal-contiguity,graph-calibration*,shadow*,reconsolidation*,*catalog*references*}*.{ts
  │ ,js,md}" in .opencode/skill/system-spec-kit
  └ 29 files found

● Search (grep)
  │ "temporal-contiguity|graph-calibration|shadow scoring|fusion policy shadow|assistive
  │ reconsolidation|deprecated|@deprecated|graph-calibration-profiles"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read temporal-contiguity.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts
  └ L1:240 (182 lines read)

● Read temporal-contiguity.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts
  └ L1:220 (199 lines read)

● Read 11-temporal-contiguity-layer.md
  │ .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contigui
  │ ty-layer.md
  └ L1:260 (46 lines read)

● Read graph-calibration.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts
  └ L1:280 (280 lines read)

● Read graph-calibration.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts
  └ L1:240 (240 lines read)

● Read 15-graph-calibration-profiles.md
  │ .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/15-graph-calibration
  │ -profiles.md
  └ L1:280 (47 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/011
  │ -scoring-and-calibration/spec.md
  └ L190:240 (43 lines read)

● Search (grep)
  │ "vectorSearchWithContiguity|getTemporalNeighbors|buildTimeline|temporal-contiguity|isGraphCalibr
  │ ationEnabled|applyCalibrationProfile|loadCalibrationProfile|shouldActivateLouvain|graph-calibrat
  │ ion" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read copilot-tool-output-1774387282849-frhstk.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774387282849-frhstk.txt
  └ L1:220 (219 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/016
  │ -tooling-and-scripts/spec.md
  └ L150:210 (48 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013
  │ -memory-quality-and-indexing/spec.md
  └ L206:236 (30 lines read)

Two big inconsistencies are already surfacing: the cross-cutting specs say deprecated graph modules are dead, but the runtime still imports them; and the remediation meta-phase still claims zero mismatches overall. I’m now checking whether the backlog severity and traceability claims also miss known live contradictions.

● Read 11-feature-catalog-code-references.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-
  │ references.md
  └ L1:260 (56 lines read)

● Search (grep)
  │ "Feature catalog:|MODULE:" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 files found

● Search (grep)
  │ "Feature catalog:" (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 5 lines found

● Read 21-assistive-reconsolidation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/21-assistive-rec
  │ onsolidation.md
  └ L1:260 (55 lines read)

● Read reconsolidation-bridge.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
  └ L1:260 (259 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:140 (140 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L50:120 (71 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L1:260 (260 lines read)

● Read 18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-r
  │ anking-bounded-proposals-and-rollback.md
  └ L1:260 (55 lines read)

● Read shadow-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts
  └ L1:260 (260 lines read)

● Read shadow-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts
  └ L230:420 (191 lines read)

● Read assistive-reconsolidation.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts
  └ L1:280 (228 lines read)

● Read reconsolidation-bridge.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
  └ L300:430 (111 lines read)

● Search (grep)
  │ "runShadowScoring|logShadowComparison|compareShadowResults|isShadowFeedbackEnabled|isAssistiveRe
  │ consolidationEnabled|SPECKIT_ASSISTIVE_RECONSOLIDATION|SPECKIT_MEMORY_ADAPTIVE_RANKING"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 100 lines found

● Search (grep)
  │ "^### " (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 80 lines found

● Read copilot-tool-output-1774387323820-qucgjd.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774387323820-qucgjd.txt
  └ L1:120 (120 lines read)

● Read copilot-tool-output-1774387323816-zu47g9.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774387323816-zu47g9.txt
  └ L1:120 (120 lines read)

I’ve confirmed the “deprecated” story is overstated: both so-called dead graph modules are still wired into the live search pipeline. I’m doing one last pass on traceability and remediation bookkeeping to separate true blockers from stale audit commentary.

● Search (grep)
  │ "Shadow evaluation system for feedback learning|Adaptive shadow ranking, bounded proposals, and
  │ rollback|Assistive reconsolidation|Temporal contiguity layer|Graph calibration profiles and
  │ community thresholds|Feature catalog code references"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 7 lines found

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L388:500 (113 lines read)

● Read 02-relative-score-fusion-in-shadow-mode.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-
  │ in-shadow-mode.md
  └ L1:220 (50 lines read)

● Search (grep)
  │ "temporal-contiguity|graph-calibration|shadow evaluation system for feedback learning|adaptive
  │ shadow ranking|assistive reconsolidation|feature catalog code references|deprecated
  │ modules|MISMATCH" (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-
  │ feature-catalog/021-remediation-revalidation/spec.md)
  └ 9 lines found

● Search (grep)
  │ "temporal-contiguity|graph-calibration|Deferred|DEF-00|deprecated|dead|no imports found|open for
  │ future scheduling|blind spots" (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-co
  │ de-audit-per-feature-catalog/019-decisions-and-deferrals/spec.md)
  └ 12 lines found

● Read 11-feature-catalog-code-references.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-
  │ references.md
  └ L16:24 (9 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L3858:3876 (19 lines read)

● Read copilot-tool-output-1774387323820-qucgjd.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774387323820-qucgjd.txt
  └ L1:20 (20 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/016
  │ -tooling-and-scripts/spec.md
  └ L160:168 (9 lines read)

● Read 20-shadow-feedback-holdout-evaluation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/20-shadow-feedback-h
  │ oldout-evaluation.md
  └ L1:240 (47 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L2926:2958 (33 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013
  │ -memory-quality-and-indexing/spec.md
  └ L210:216 (6 lines read)

● Read 21-calibrated-overlap-bonus.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/21-calibrated-overla
  │ p-bonus.md
  └ L1:220 (49 lines read)

● Search (grep)
  │ "isGraphCalibrationProfileEnabled|isTemporalContiguityEnabled"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
  └ 2 lines found

● Search (grep)
  │ "applyCalibrationProfile\(|vectorSearchWithContiguity\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline)
  └ 3 lines found

● Search (grep)
  │ "isGraphCalibrationProfileEnabled|isGraphCalibrationEnabled"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts)
  └ 5 lines found

● Search (grep)
  │ "74%|191|257|every non-test|not yet universal" (.opencode/skill/system-spec-kit/feature_catalog/
  │ 16--tooling-and-scripts/11-feature-catalog-code-references.md)
  └ 1 line found

● Search (grep)
  │ "Default OFF|auto-merge|shadow-archive|Default ON" (.opencode/skill/system-spec-kit/feature_cata
  │ log/13--memory-quality-and-indexing/21-assistive-reconsolidation.md)
  └ 6 lines found

● Search (grep)
  │ "Default OFF|auto-merge|Default ON|automatically merged"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 31 lines found

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L636:695 (59 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L250:285 (36 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L176:188 (12 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L368:378 (11 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1786:1806 (21 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1698:1716 (19 lines read)

# 1. Summary

P0: 0

P1: 3

P2: 1

Files reviewed: 18

Dimension coverage: correctness and traceability deep pass; maintainability cross-check; security spot-check found no direct security defect in scoped files.

# 2. Findings

### CR-001 [P1] Cross-cutting docs incorrectly classify `temporal-contiguity` and `graph-calibration` as deprecated/dead
- Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/spec.md:196-197`; `.opencode/specs/.../021-remediation-revalidation/spec.md:146-151`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:41-42,645-651,685-691`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:67,263-271`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:181-186,368-375`.
- Impact: the audit backlog is built on a false premise. Both features are still wired into live runtime paths and are default-on/graduated, so marking them as dead/deprecated can misdirect remediation and future removals.
- Fix recommendation: reclassify both as active features in 019/021 and remove the “dead/no imports found” assertions unless the runtime wiring is first removed.

### CR-002 [P1] Revalidation meta-phase still certifies `0 MISMATCH` while a live catalog contradiction remains untracked
- Evidence: `.opencode/specs/.../021-remediation-revalidation/spec.md:20,99,105-112,186-193`; `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:2930-2934`; `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/21-assistive-reconsolidation.md:8,14,21,29`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:363-377`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:479-484`; `.opencode/specs/.../013-memory-quality-and-indexing/spec.md:212-214`.
- Impact: 021 understates remediation scope. The top-level catalog says assistive reconsolidation is “auto-merge” and default OFF, but the dedicated feature file and source show shadow-archive behavior and default ON. That contradiction is not in the remediation matrix.
- Fix recommendation: refresh 021 against the current top-level catalog and per-feature files, add F21 to the backlog, and recalculate MATCH/PARTIAL/MISMATCH totals.

### CR-003 [P1] `016/F11` was marked MATCH even though the catalog’s primary traceability narrative contradicts its own measured coverage
- Evidence: `.opencode/specs/.../016-tooling-and-scripts/spec.md:162`; `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:3862-3866`; `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md:18-22`.
- Impact: the audit certifies traceability as complete when the source docs explicitly say the convention is only “approximately 74%” and “not yet universal.” That makes the remediation status for catalog references unreliable.
- Fix recommendation: downgrade F11 from MATCH, then align the top-level catalog wording with the measured-coverage statement in the dedicated feature file.

### CR-004 [P2] Deferred-item tracking is incomplete because deep-research follow-ups are documented but not promoted into the deferral ledger
- Evidence: `.opencode/specs/.../019-decisions-and-deferrals/spec.md:183-188,238-240`; `.opencode/specs/.../021-remediation-revalidation/spec.md:211-245`.
- Impact: cross-cutting work is described, but not tracked in the same explicit DEF-style structure. That weakens closure tracking for blind spots, uncataloged files, and graduated-flag drift.
- Fix recommendation: convert BS/DR follow-ups into explicit deferred items or remediation tickets with owner, priority, and closure criteria.

# 3. Cross-references checked

- `019-decisions-and-deferrals` ↔ `010-graph-signal-activation` audit claims ↔ `feature_catalog` entries ↔ live pipeline wiring in `stage1-candidate-gen.ts` and `stage2-fusion.ts`
- `021-remediation-revalidation` ↔ `013-memory-quality-and-indexing` ↔ assistive reconsolidation feature file ↔ `reconsolidation-bridge.ts` and `search-flags.ts`
- `021-remediation-revalidation` ↔ `016-tooling-and-scripts` ↔ top-level `FEATURE_CATALOG.md` ↔ dedicated `11-feature-catalog-code-references.md`
- Shadow terminology sanity check: `12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md` is retired, while `11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md` is still live

# 4. Dimension-specific notes

**Correctness:** strongest problems are audit/meta-doc correctness, not runtime security. The cross-cutting specs currently misstate live feature state.

**Security:** no direct auth/privacy/runtime security defect found in scoped files.

**Traceability:** biggest gap is self-contradictory traceability coverage reporting (`every file` vs `74%`).

**Maintainability:** “shadow” and “deprecated” terminology is overloaded across features, which likely contributed to the false deprecation/remediation conclusions.

