● Search (grep)
  │ "abort|validation|validate|quality|gate|halt|stop|throw|error|memory-indexer|index|contract|capa
  │ bilit" in {workflow.ts,memory-indexer.ts} (.opencode/skill/system-spec-kit/scripts/core)
  └ 5 lines found

● Search (grep)
  │ "abort|validation|validate|quality
  │ gate|quality-gate|gate|checklist|schema|indexability|halt|stop" in **/*spec.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ 5 lines found

● Search (grep)
  │ "abort|validation|validate|quality gate|gate|checklist|halt|stop|index|memory-indexer|workflow"
  │ in *.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing)
  └ 5 lines found

● Search (glob)
  │ ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/*.md"
  └ 7 files found

● Search (glob)
  │ ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/{017-stateless-quality-gates,018-runt
  │ ime-contract-and-indexability,019-source-capabilities-and-structured-preference,020-live-proof-a
  │ nd-parity-hardening}/spec.md"
  └ No matches found

I found the core file set; next I’ll locate those phase-spec paths exactly, then extract only abort/validation-related claims and cross-check them against `workflow.ts` and `memory-indexer.ts`.

● Search (grep)
  │ "abort|validation|validate|quality gate|gate|halt|stop|throw new
  │ Error|indexability|schema|contract|capabilit|required source|live proof" in
  │ {workflow.ts,memory-indexer.ts} (.opencode/skill/system-spec-kit/scripts/core)
  └ 51 lines found

● Search (grep)
  │ "abort|validation|validate|quality gate|gate|checklist|halt|stop|indexability|schema|contract"
  │ in {spec.md,plan.md,implementation-summary.md,research.md}
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing)
  └ 5 lines found

● Search (glob)
  │ "**/018-runtime-contract-and-indexability/spec.md"
  └ 1 file found

● Search (glob)
  │ "**/017-stateless-quality-gates/spec.md"
  └ 1 file found

● Search (glob)
  │ "**/019-source-capabilities-and-structured-preference/spec.md"
  └ 1 file found

● Search (glob)
  │ "**/020-live-proof-and-parity-hardening/spec.md"
  └ 1 file found

● Search (grep)
  │ "abort|validation|validate|quality gate|quality-gate|gate|index|indexing|contract|disposition|wa
  │ rning|warn|throw|error|planned|shipped|implemented|phase|stateless|structured" (.opencode/specs/
  │ 02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md)
  └ 5 lines found

● Search (grep)
  │ "abort|validation|validate|quality gate|gate|index|indexing|contract|disposition|warning|warn|th
  │ row|error|planned|shipped|implemented|phase|stateless|structured" (.opencode/specs/02--system-sp
  │ ec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/plan.md)
  └ 5 lines found

● Search (grep)
  │ "abort|validation|validate|quality gate|gate|index|indexing|contract|disposition|warning|warn|th
  │ row|error|planned|shipped|implemented|phase|stateless|structured" (.opencode/specs/02--system-sp
  │ ec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/implementation-summary.md)
  └ 46 lines found

● Search (grep)
  │ "abort|validation|validate|quality gate|gate|index|indexing|contract|disposition|warning|warn|th
  │ row|error|planned|shipped|implemented|phase|stateless|structured" (.opencode/specs/02--system-sp
  │ ec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/research.md)
  └ 5 lines found

● Search (grep)
  │ "abort|validation|validate|quality gate|gate|index|indexing|contract|disposition|warning|warn|th
  │ row|error|planned|shipped|implemented|status|runtime|stateless|structured"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/017-sta
  │ teless-quality-gates/spec.md)
  └ 5 lines found

● Search (grep)
  │ "abort|validation|validate|quality gate|gate|index|indexing|contract|disposition|warning|warn|th
  │ row|error|planned|shipped|implemented|status|runtime|stateless|structured"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/018-run
  │ time-contract-and-indexability/spec.md)
  └ 5 lines found

● Search (grep)
  │ "abort|validation|validate|quality gate|gate|index|indexing|contract|disposition|warning|warn|th
  │ row|error|planned|shipped|implemented|status|runtime|stateless|structured"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/019-sou
  │ rce-capabilities-and-structured-preference/spec.md)
  └ 63 lines found

● Search (grep)
  │ "abort|validation|validate|quality gate|gate|index|indexing|contract|disposition|warning|warn|th
  │ row|error|planned|shipped|implemented|status|runtime|stateless|structured"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/020-liv
  │ e-proof-and-parity-hardening/spec.md)
  └ 60 lines found

● Search (grep)
  │ "determineValidationDisposition|decideSemanticIndexing|validateMemoryTemplateContract|validateMe
  │ moryQualityContent|QUALITY_GATE|write_skip_index|abort_write|structured|stateless|skip.*index|th
  │ row new Error|warning|warn|getSourceCapabilities"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "skipped_quality_gate|skipped_index_policy|indexed|status|reason|index|validation|quality|abort|
  │ write_skip_index|abort_write" (.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts)
  └ 113 lines found

● Count lines in target files (shell)
  │ wc -l .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/{s
  │ pec.md,plan.md,implementation-summary.md,research.md,017-stateless-quality-gates/spec.md,018-run
  │ time-contract-and-indexability/spec.md,019-source-capabilities-and-structured-preference/spec.md
  │ ,020-live-proof-and-parity-hardening/spec.md}
  │ .opencode/skill/system-spec-kit/scripts/core/{workflow.ts,memory-indexer.ts}
  └ 12 lines...

I’ve mapped the target files; now I’m extracting precise claim lines (with line numbers) from docs and the two runtime files so I can classify each claim as accurate/outdated/missing.

● Search (grep)
  │ "Status|phase|abort|QUALITY_GATE|validation|validate|gate|index|indexing|write_skip_index|abort_
  │ write|contract|stateless|structured|warning|warn" (.opencode/specs/02--system-spec-kit/022-hybri
  │ d-rag-fusion/010-perfect-session-capturing/implementation-summary.md)
  └ 52 lines found

● Search (grep)
  │ "Status|phase|abort|QUALITY_GATE|validation|validate|gate|index|indexing|write_skip_index|abort_
  │ write|contract|stateless|structured|warning|warn" (.opencode/specs/02--system-spec-kit/022-hybri
  │ d-rag-fusion/010-perfect-session-capturing/spec.md)
  └ 5 lines found

● Search (grep)
  │ "Status|phase|abort|QUALITY_GATE|validation|validate|gate|index|indexing|write_skip_index|abort_
  │ write|contract|stateless|structured|warning|warn" (.opencode/specs/02--system-spec-kit/022-hybri
  │ d-rag-fusion/010-perfect-session-capturing/plan.md)
  └ 5 lines found

● Search (grep)
  │ "Status|phase|abort|QUALITY_GATE|validation|validate|gate|index|indexing|write_skip_index|abort_
  │ write|contract|stateless|structured|warning|warn" (.opencode/specs/02--system-spec-kit/022-hybri
  │ d-rag-fusion/010-perfect-session-capturing/research.md)
  └ 5 lines found

● Search (grep)
  │ "Status|phase|abort|QUALITY_GATE|validation|validate|gate|index|indexing|write_skip_index|abort_
  │ write|contract|stateless|structured|warning|warn|planned|complete" (.opencode/specs/02--system-s
  │ pec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/017-stateless-quality-gates/spec.md)
  └ 5 lines found

● Search (grep)
  │ "Status|phase|abort|QUALITY_GATE|validation|validate|gate|index|indexing|write_skip_index|abort_
  │ write|contract|stateless|structured|warning|warn|planned|complete"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/018-run
  │ time-contract-and-indexability/spec.md)
  └ 5 lines found

● Search (grep)
  │ "Status|phase|abort|QUALITY_GATE|validation|validate|gate|index|indexing|write_skip_index|abort_
  │ write|contract|stateless|structured|warning|warn|planned|complete"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/019-sou
  │ rce-capabilities-and-structured-preference/spec.md)
  └ 67 lines found

● Search (grep)
  │ "Status|phase|abort|QUALITY_GATE|validation|validate|gate|index|indexing|write_skip_index|abort_
  │ write|contract|stateless|structured|warning|warn|planned|complete"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/020-liv
  │ e-proof-and-parity-hardening/spec.md)
  └ 79 lines found

● Search (grep)
  │ "determineValidationDisposition|validateMemoryTemplateContract|validateMemoryQualityContent|QUAL
  │ ITY_GATE_ABORT|QUALITY_GATE_WARN|write_skip_index|abort_write|decideSemanticIndexing|indexBlocki
  │ ngRuleIds|blockingRuleIds|getSourceCapabilities|throw new Error"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "skipped_quality_gate|skipped_index_policy|indexed|embedding|reason|status"
  │ (.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts)
  └ 84 lines found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/017-stat
  │ eless-quality-gates/spec.md
  └ 281 lines read

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/018-runt
  │ ime-contract-and-indexability/spec.md
  └ 129 lines read

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md
  └ L1:220 (220 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md
  └ L221:303 (83 lines read)

● Read plan.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/plan.md
  └ 221 lines read

● Read research.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/research
  │ .md
  └ 149 lines read

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/019-sour
  │ ce-capabilities-and-structured-preference/spec.md
  └ 124 lines read

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/020-live
  │ -proof-and-parity-hardening/spec.md
  └ 119 lines read

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L150:240 (91 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1988:2175 (187 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2270:2345 (76 lines read)

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ 204 lines read

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1:120 (120 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1300:1390 (91 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1820:1895 (76 lines read)

● Search (grep)
  │ "captureCapabilities|getSourceCapabilities|determineValidationDisposition\(|validationDispositio
  │ n\.|QUALITY_GATE_FAIL|CONTAMINATION_GATE_ABORT|write_skip_index|abort_write"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 54 lines found

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L1:260 (259 lines read)

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L261:560 (300 lines read)

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L560:900 (190 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/018-runt
  │ ime-contract-and-indexability/spec.md
  └ L1:129 (129 lines read)

✗ List phase folders under 010 parent (shell)
  │ find '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing'
  │ -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' | sort | sed 's#^.*/##' | nl -ba
  └ Permission denied and could not request permission from user

● Search (grep)
  │ "abort|validation|qualityValidation.valid|write-only|index|indexing|block|gate|V10|V11|HARD_BLOC
  │ K_RULES|disposition" (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-sess
  │ ion-capturing/research.md)
  └ 5 lines found

● Search (grep)
  │ "runtime|planned|phase|018|019|020|shipped|complete|in progress|validation|gate|abort|index"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/impleme
  │ ntation-summary.md)
  └ 36 lines found

● Search (glob)
  │ ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/[0-9][0
  │ -9][0-9]-*"
  └ No matches found

● List directory .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capt…
  └ 33 files found

● Search (glob)
  │ "**/010-perfect-session-capturing/[0-9][0-9][0-9]-*/spec.md"
  └ 21 files found

● Search (glob)
  │ "**/010-perfect-session-capturing/[0-9][0-9][0-9]-*"
  └ No matches found

Audit complete. Here’s Q7 (docs vs real abort/validation chain).

**1) Abort/validation claims**

- `018/spec.md` explicit dispositions (`abort_write` / `write_skip_index` / `write_and_index`) → **ACCURATE** (`workflow.ts:2137-2162`, `150-200`).
- `018/spec.md` “V10-only can write+index” → **ACCURATE** (`validate-memory-quality.ts:111-117`, `workflow.ts:2287-2314`).
- `017/spec.md` “V10-only proceeds with warning” → **ACCURATE** (`workflow.ts:2158-2162`).
- `017/spec.md` says V8/V9 abort with `QUALITY_GATE_ABORT` → **OUTDATED** (now `CONTAMINATION_GATE_ABORT`, `workflow.ts:2141-2144`).
- `research.md` says indexing still depends on `qualityValidation.valid===true` → **OUTDATED** (`workflow.ts:2287-2328`).
- `implementation-summary.md` says phases 018-020 are doc-only/planned → **OUTDATED** vs shipped runtime (`spec.md:24`, `018/spec.md:25`, `019/spec.md:25`).

**MISSING docs**
- V12 index-blocking behavior (`validate-memory-quality.ts:127-133`, `430-437`).
- Full abort order: template contract → sufficiency → quality threshold → disposition (`workflow.ts:2072-2149`).

**2) Planned vs shipped phase docs**

- **Shipped:** 017, 018, 019 (`Status: Complete` in each spec).
- **Planned/Open:** 020 (`Status: In Progress`).
- **Stale planned narrative:** parent `implementation-summary.md` still frames 018-020 as planned/doc-only.

**3) Drift count**

- **Abort/validation drift items:** **5** outdated claims.
- **Including parent phase-count drift (docs end at 020, tree has 021):** **6** total.

**4) Remaining work**

Moderate: update `implementation-summary.md`, patch 017 abort-label wording + V12 note, refresh `research.md` indexing statement, and optionally extend parent map to 021.  
Estimated **1–2 hours** (plus ~30 min for phase-map sync).

