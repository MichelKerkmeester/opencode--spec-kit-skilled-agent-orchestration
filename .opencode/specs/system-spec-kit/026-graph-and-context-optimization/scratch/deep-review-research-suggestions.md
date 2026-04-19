# Further Deep-Review / Deep-Research Suggestions

> Working analysis doc. §1-5 cover the 026 packet after the 2026-04-18 consolidation. §6 covers system-spec-kit as a whole (templates, validator, gates, skill-advisor, canonical-save pipeline). Each target has rationale, scope, and a ready-to-dispatch `/spec_kit:deep-review` or `/spec_kit:deep-research` block.

---

## 1. Executive Summary

The 026 train has eighteen active phases. Foundational packets `001-014` and the thematic `016-foundational-runtime` + `017-sk-deep-cli-runtime-execution` + `018-cli-executor-remediation` all shipped to main. Only `015-deep-review-and-remediation` remains in progress — the 120-iteration review landed, but the 11-workstream remediation has **not** been executed.

Three signal classes argue for further passes:

1. **Unaudited code** — `017/002-runtime-matrix` shipped cli-copilot + cli-gemini + cli-claude-code without its own research pass (only sibling `001-executor-feature` got the 30-iter dogfood that seeded 018). `018` shipped PASS but was never independently reviewed.
2. **Stale review** — the 243 findings in `015-deep-review-and-remediation/review/review-report.md` were produced **before** 016/017/018 shipped. Many P1 items likely collapsed when 016 landed the readiness-contract, shared-provenance, retry-budget, and caller-context primitives. A delta-review would give an accurate residual list.
3. **Flagged follow-ups** — root `implementation-summary.md §Known Limitations` (description.json rich-content regen, qualityFlags iterable bug) and `018/spec.md §3.2 Out of Scope` (Q4 NFKC robustness, retry-budget numeric calibration) name investigations the packets deferred by design.

---

## 2. What's Already Covered (so we don't redo it)

| Audit | Scope | Where |
|-------|-------|-------|
| 120-iter doc+code review | Packets 009, 010, 012, 014 | `015/review/review-report.md` |
| 50-iter foundational research | Packets 002, 003, 005, 008, 010, 014 | `016/001-initial-research/` |
| 7-iter meta-review of 016 remediation | 016 Waves A-D | `review/016-foundational-runtime-pt-01/review-report.md` |
| 7-iter segment-2 research extension | Foundational-runtime cluster D/E | `research/016-foundational-runtime-pt-01/segment-2-synthesis.md` |
| 30-iter deep-research dogfood | 017/001-executor-feature | `research/017-sk-deep-cli-runtime-execution-pt-01/` |
| 10-iter deep-review of 017 remediation | 017 (foundational-runtime ex-phase) | `review/017-review-remediation/` (per commit `44b82d11e`) |

No pass has covered: `017/002-runtime-matrix`, post-ship `018`, or the consolidated 015→018 arc.

---

## 3. Ranked Candidates

### Tier 1 — Ship Next

#### DR-1 — Delta-review: 015's 243 findings against current main [DEEP-REVIEW]

**Why**: 015 shipped the review (243 findings: 1 P0, 114 P1, 133 P2) but Workstream 0 never executed. Meanwhile, 016 shipped ten runtime primitives that almost certainly addressed a non-trivial subset of those P1s incidentally. Without a delta-review, Workstream 0's Phase 0 Scope-Boundary lane and Phase 0b Path-Boundary lane risk redoing work that already landed.

**Scope** (4 review dimensions, 7-10 iterations sufficient):
- For each of the 243 findings in `015/review/review-report.md`: re-check the cited file+line against current `main`.
- Classify as `ADDRESSED` (cite commit), `STILL_OPEN` (cite current evidence), `SUPERSEDED` (cite replacement design), or `UNVERIFIED` (evidence gone, needs fresh look).
- Produce `015/review/delta-report-2026-04.md` with counts and a narrowed residual remediation backlog.

**Dispatch block:**
```
/spec_kit:deep-review :confirm

Scope: 015-deep-review-and-remediation delta-review. Re-audit all 243 findings
in 015/review/review-report.md against current main (post-016/017/018 ship).
For each finding: verify the cited file:line still reproduces the defect or
confirm the defect was addressed by an interim commit.

Review dimensions: correctness, security, contracts, documentation.
Iterations: 7-10. Converge on a delta classification (ADDRESSED/STILL_OPEN/
SUPERSEDED/UNVERIFIED) for every finding.

Output: 015/review/delta-report-2026-04.md with counts per class, links to
the commits that addressed each ADDRESSED item, and the narrowed STILL_OPEN
backlog as the actual Workstream 0+ starting point.

Executor: cli-codex gpt-5.4 high fast (matches the original 120-iter review
profile for audit parity).
```

---

#### RR-1 — Q4 NFKC robustness research [DEEP-RESEARCH]

**Why**: 018 spec `§3.2 Out of Scope` explicitly says "Q4 NFKC robustness research... stays a future research slice." Phase 016 T-SAN-01/02/03 added NFKC normalization at Gate 3 and in `sanitizeRecoveredPayload`, but no research pass has explored canonical-equivalence attack surfaces. Relevant because sanitizer bypass would invalidate several security invariants in 016 (HookStateSchema `.bad` quarantine, trigger-phrase sanitizer).

**Scope** (15-20 iterations):
- NFKC vs NFKD boundary tests against Unicode 15 and 16 tables.
- Canonical-equivalence class exhaustion for ASCII-looking glyphs (e.g., `ﬀ` → `ff`, fullwidth Latin, mathematical alphanumerics).
- Round-trip stability under the sanitizer chain (`sanitizeRecoveredPayload` → `trigger-phrase-sanitizer` → schema validation).
- Attacker-controlled trigger-phrase constructions that survive `NFKC` but bypass the lexical filter.
- Cross-platform normalization drift (macOS HFS+ pre-NFD, Windows codepage).

**Dispatch block:**
```
/spec_kit:deep-research :confirm

Scope: Q4 NFKC robustness. Research the attack and failure surface for the
NFKC normalization boundary added in 016 T-SAN-01/02/03. Treat sanitizer
bypass as the primary adversary model.

Sources: sanitizeRecoveredPayload, trigger-phrase-sanitizer, Gate 3 prompt
classifier (gate-3-classifier.ts), schema validation paths in memory-save.
Check Unicode 15/16 equivalence tables and known canonical-equivalence
attacks in the CVE corpus for comparable sanitizers.

Iterations: 15-20. Converge on a residual-threat inventory with concrete
exploit constructions + proposed hardening (either extended normalization,
or a post-normalization deny-list for high-risk equivalence classes).

Output: research/018-q4-nfkc-robustness/research.md + iteration-NNN.md
files. No code changes in this pass; implementation follows in a sibling
remediation packet.

Executor: cli-codex gpt-5.4 high fast.
```

---

#### RR-2 — description.json rich-content regen strategy [DEEP-RESEARCH]

**Why**: Root `implementation-summary.md §Known Limitations #4` flags that the H-56-1 fix triggers `generate-description.js` auto-regen, which overwrites hand-authored rich content with the minimal template. This is a recurring pain point — it was observed on 017's own `description.json` during implementation, and it implies every rich `description.json` in the 026 tree is one canonical-save away from getting clobbered. Phase 018 R4 added parse/schema split + merge-preserving repair but did not solve the regen-overwrite problem itself.

**Scope** (8-12 iterations):
- Catalogue all fields in `description.json` and classify each as `derived` (safe to regen) vs `authored` (must preserve).
- Evaluate 4+ preservation strategies: opt-in/opt-out regen flag, hash-based change detection, schema-versioned authored layer with derived overlay, field-level merge policy driven by content-type marker.
- Audit the 29-of-86 "rich" description.json files in the 026 tree for the authored-content patterns that must survive.
- Recommend one strategy with a migration path and validation fixture plan.

**Dispatch block:**
```
/spec_kit:deep-research :confirm

Scope: description.json rich-content preservation under canonical-save regen.
The H-56-1 fix in 016/002-infrastructure-primitives restored metadata writes,
but generate-description.js auto-regen still overwrites hand-authored fields
in rich description.json files (29 of 86 packet files in 026 tree per 018
research.md §5).

Sources: .opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts,
all 86 description.json files under .opencode/specs/, 018/002-cluster-consumers
T-CNS-04/T-CNS-05 code (continuity-freshness validator + lastUpdated backfill),
018 Wave B description-repair-helper.

Iterations: 8-12. Converge on one preservation strategy with a concrete
migration path, schema changes, and the validation fixtures needed to prevent
regression.

Output: research/018-description-regen-strategy/research.md with the
recommended strategy, the rejected alternatives with rationale, and a
proposed remediation wave for the follow-up packet.

Executor: cli-codex gpt-5.4 high fast.
```

---

### Tier 2 — Opportunistic

#### DR-2 — Deep review of 017/002-runtime-matrix [DEEP-REVIEW]

**Why**: Sub-phase 001 got a 30-iter deep-research pass that seeded 018. Sub-phase 002 shipped three more executor kinds (cli-copilot, cli-gemini, cli-claude-code), the `EXECUTOR_KIND_FLAG_SUPPORT` flag-compatibility matrix, and the 3-concurrent Copilot cap — all without its own review. ADR-007 kept runtime recursion detection as docs-only, which is a live gap.

**Scope** (7-10 iterations):
- EXECUTOR_KIND_FLAG_SUPPORT matrix completeness (no false-accepts on invalid combinations, no false-rejects on valid ones).
- Cross-CLI delegation contract drift across all 5 kinds (native, cli-codex, cli-copilot, cli-gemini, cli-claude-code).
- 3-concurrent Copilot cap enforcement under async dispatch (does the cap survive `Promise.all` on 5+ iterations?).
- service-tier rejection correctness on non-codex kinds (Zod path).
- Audit JSONL `executor: {kind, model, reasoningEffort, serviceTier}` provenance parity — every kind writes the same shape.

**Dispatch block:**
```
/spec_kit:deep-review :confirm

Scope: 017-sk-deep-cli-runtime-execution/002-runtime-matrix. Sibling sub-phase
001-executor-feature got a 30-iter deep-research dogfood; 002 shipped three
new executor kinds (cli-copilot, cli-gemini, cli-claude-code) + EXECUTOR_KIND_
FLAG_SUPPORT matrix + 3-concurrent Copilot cap without its own audit.

Review dimensions: correctness (flag matrix, Zod rejection), security
(cross-CLI delegation, recursion risk per ADR-007), contracts (provenance
parity across 5 kinds), documentation (ADR completeness vs runtime behavior).
Iterations: 7-10.

Output: review/017-runtime-matrix-post-ship/review-report.md with P0/P1/P2
findings. Remediation, if any, belongs in a sibling to 018.

Executor: cli-codex gpt-5.4 high fast.
```

---

#### DR-3 — Adversarial review of 018 Wave A-F landed fixes [DEEP-REVIEW]

**Why**: 018 shipped R1-R11 via cli-codex dogfooding with 116/116 scoped tests green — but scoped tests verify stated intent, not adversary-controlled failure modes. No independent post-ship review has adversarially exercised Wave A first-write JSONL provenance, Wave B merge-preserving description-repair, or Wave E indented-fence evidence-marker parser.

**Scope** (7-10 iterations, adversarial dimension):
- Wave A (R1-R2): can an executor spoof identity on late writes? Does the first-write invariant hold under concurrent dispatch?
- Wave B (R4-R5): does merge-preserving repair produce deterministic output for malformed specimens? What happens on partial-write → repair → partial-write cycles?
- Wave E (R9): does the fence parser regress on Windows CRLF inputs, BOM-prefixed markdown, or markdown inside fenced code blocks?
- Wave F (R8, R10, R11): does the retry-telemetry leak PII in the reason field? Do caller-context assertions still hold under `setImmediate` + `timers/promises` mix?

**Dispatch block:**
```
/spec_kit:deep-review :confirm

Scope: 018-cli-executor-remediation post-ship adversarial review. Waves A-F
shipped R1-R11 with 116/116 scoped tests green; this pass targets failure
modes outside the stated intent.

Review dimensions: security (identity spoofing, PII leak), correctness
(concurrent-write invariants, repair determinism), contracts (fence parser
on CRLF/BOM, caller-context under async mix), regression (partial-write
cycles). Iterations: 7-10. Adversarial mode active.

Output: review/018-post-ship-adversarial/review-report.md. Any P0 finding
is a hotfix candidate.

Executor: cli-codex gpt-5.4 high fast.
```

---

### Tier 3 — Longer Horizon

#### DR-4 — Cross-packet integration review of 015→018 arc [DEEP-REVIEW]

**Why**: The 2026-04-18 consolidation grouped 015-018 into thematic packets, but no single review has audited the boundaries between them. Likely findings: 016's readiness-contract invariants vs 017's executor-dispatch preconditions, 017's AsyncLocalStorage caller-context vs 018's first-write JSONL provenance, 018's description-repair-helper vs 016's `generate-description.js` regen.

**Why defer**: architectural hygiene, not release-blocking. Do after Tier 1 Wave lands.

---

#### RR-3 — Retry-budget + continuity-threshold empirical calibration [DEEP-RESEARCH]

**Why**: 018 Wave F added retry telemetry but kept `MAX_RETRIES=3` and the 10-minute continuity threshold as heuristic. Empirical calibration is explicitly deferred in 018 spec pending a telemetry collection window.

**Why defer**: needs ~2-4 weeks of real telemetry first. Cannot run this research today without the data.

---

#### RR-4 — Cross-CLI delegation governance research [DEEP-RESEARCH]

**Why**: 017/002 ADR-007 kept runtime recursion detection as docs-only. No research on whether cross-CLI delegation (cli-codex → cli-copilot subtask → cli-gemini sub-subtask) produces auditable handoff signatures or creates unbounded recursion.

**Why defer**: low immediate risk (no reports of recursion issues); revisit if DR-2 surfaces evidence.

---

#### RR-5 — Foundational-runtime primitive interaction map [DEEP-RESEARCH]

**Why**: 016 introduced 10+ primitives (OperationResult, HookStateSchema, predecessor CAS, migrated marker, 4-state TrustState, COMMAND_BRIDGES, AsyncLocalStorage caller-context, readiness-contract, shared-provenance, retry-budget). Their intended contracts are ADR'd; the actual call graph has not been derived from runtime.

**Why defer**: architectural health exercise, no known incident driving it. Keep in the backlog.

---

## 4. Recommendation Matrix

| Target | Tier | Type | Leverage | Unblocks |
|--------|------|------|----------|----------|
| **DR-1 delta-review 015 findings** | 1 | Deep Review | HIGH | Accurate 015 Workstream 0 scope; release-readiness |
| **RR-1 Q4 NFKC research** | 1 | Deep Research | HIGH | Latent sanitizer-bypass threat model |
| **RR-2 description.json regen strategy** | 1 | Deep Research | HIGH | Recurring rich-content loss on every canonical save |
| DR-2 runtime-matrix review | 2 | Deep Review | MEDIUM-HIGH | Unreviewed shipped executor code |
| DR-3 018 adversarial review | 2 | Deep Review | MEDIUM | Adversary-mode validation of 018 PASS verdict |
| DR-4 cross-packet integration | 3 | Deep Review | MEDIUM | Architectural hygiene (non-blocking) |
| RR-3 retry-budget calibration | 3 | Deep Research | MEDIUM | Needs telemetry window; revisit in 2-4 weeks |
| RR-4 cross-CLI governance | 3 | Deep Research | LOW-MEDIUM | Hypothetical recursion risk |
| RR-5 primitive interaction map | 3 | Deep Research | LOW | Drift prevention |

---

## 5. Suggested Execution Order

1. **DR-1** first — cheapest and unlocks 015. Cuts phantom remediation work from the 243-finding backlog before anyone touches Workstream 0.
2. **RR-2 + RR-1 in parallel** — independent lanes. RR-2 blocks nothing but causes ongoing pain; RR-1 is latent security.
3. **DR-2** once Tier 1 is in flight — fills the doc gap on `002-runtime-matrix`.
4. **DR-3** after DR-2 — adversarial audit of the downstream remediation.
5. Tier 3 items are backlog; revisit after Tier 1+2 lands.

Each Tier 1 candidate above ships with a copy-paste-ready `/spec_kit:deep-review` or `/spec_kit:deep-research :confirm` dispatch block. Pick one, confirm executor profile (default: `cli-codex gpt-5.4 high fast` for audit parity with the original passes), and dispatch.

---

## 6. System-Spec-Kit (Beyond the 026 Packet)

The 026 packet has audited specific system-spec-kit subsystems — 016 covered MCP runtime foundations, 017/018 covered the CLI executor surface, 015 audited packets 009/010/012/014. But the system-spec-kit skill **as a whole** (templates v2.2, validator ruleset, Gate 1-4 enforcement, skill-advisor routing, canonical-save pipeline, cross-runtime agent directories) has not been audited end-to-end since the v2.2 template rollout.

Three signal classes argue for a skill-wide pass:

1. **Routing classifiers are unmeasured** — `skill_advisor.py` (Gate 2, confidence ≥ 0.8 → mandatory) and `gate-3-classifier.ts` (Gate 3, HARD block) route every non-trivial task. No offline evaluation of accuracy, false-positive rate, or false-negative rate has been done. CLAUDE.md explicitly acknowledges known false-positives (`analyze/decompose/phase` tokens) but the residual error rate is unknown.
2. **Template/validator coupling is implicit** — templates under `templates/level_1/` through `level_3/` emit anchors; the validator demands matching headers. When templates evolve, validator expectations must follow. No single audit has checked this coupling end-to-end.
3. **Canonical-save pipeline contract** — after the H-56-1 fix, `/memory:save` writes metadata through `generate-context.js → description.json → graph-metadata.json → memory index`. Root validator runs already show clock-drift warnings (`CONTINUITY_FRESHNESS deltaMs=-8455798` treated as benign). Is the "benign" classification correct, or is it masking real state divergence?

### Tier 1 — Ship Next

#### SSK-RR-1 — Gate 3 classifier + skill-advisor routing accuracy research [DEEP-RESEARCH]

**Why**: Both are classifiers that gate every non-trivial task. Gate 3 is HARD-block (mis-route = wrong spec folder or skipped Gate 3 entirely). Gate 2 at confidence ≥ 0.8 mandates skill invocation (mis-route = wrong skill or no skill). CLAUDE.md admits false-positive tokens (`analyze`, `decompose`, `phase`) but the residual error surface is unquantified.

**Scope** (12-15 iterations):
- Build a labeled corpus of ~200 real prompts from the last 60 days (source: transcript logs if accessible, or representative synthetic set derived from CLAUDE.md examples + edge cases).
- For each prompt, compute the Gate 3 classifier verdict and the `skill_advisor.py` top-1 recommendation + confidence.
- Compare against a human-labeled ground truth (Gate 3: is this a write action? Skill advisor: which skill is correct?).
- Report precision / recall per classifier, enumerate false-positive and false-negative classes, recommend threshold or rule changes.

**Dispatch block:**
```
/spec_kit:deep-research :confirm

Scope: Accuracy research for Gate 3 classifier and skill-advisor routing.
Both classifiers gate every non-trivial task. Gate 3 is HARD-block.
Skill-advisor at confidence >= 0.8 mandates skill invocation.

Sources: .opencode/skill/system-spec-kit/shared/gate-3-classifier.ts,
.opencode/skill/skill-advisor/scripts/skill_advisor.py, CLAUDE.md
§2 Gates 1-4, existing false-positive notes (analyze/decompose/phase).

Method: build a labeled corpus of ~200 prompts (real + edge cases),
compute classifier verdicts, compare to human ground truth. Report
precision/recall/F1 per classifier, enumerate error classes, propose
threshold or rule changes. Iterations: 12-15.

Output: research/system-spec-kit-routing-accuracy/research.md with the
labeled corpus, classifier verdict matrix, error taxonomy, and ranked
rule-change proposals. Dispatch the proposals as a follow-up remediation
packet only after convergence.

Executor: cli-codex gpt-5.4 high fast.
```

---

#### SSK-DR-1 — Template v2.2 + validator ruleset joint audit [DEEP-REVIEW]

**Why**: Templates under `.opencode/skill/system-spec-kit/templates/level_{1,2,3}/` and the validator at `scripts/spec/validate.sh` are coupled by design but evolve separately. Recent validator output on the 026 root shows `PHASE_LINKS` warnings on 015/016/017/018 missing `| **Parent Spec** | ../spec.md |` — which is a template-v2.2-mandated field that child-packet specs don't consistently carry. Either the validator is over-strict or the templates under-emit. Both need joint review.

**Scope** (10-12 iterations):
- Enumerate every anchor and required field in every template (level_1, level_2, level_3, core + addendum).
- Enumerate every validator rule that depends on template output (FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS_PRESENT, TEMPLATE_HEADERS, PHASE_LINKS, SPEC_DOC_INTEGRITY, ANCHORS_VALID, CROSS_ANCHOR_CONTAMINATION, POST_SAVE_FINGERPRINT, CONTINUITY_FRESHNESS, MERGE_LEGALITY, NORMALIZER_LINT, EVIDENCE_MARKER_LINT, TOC_POLICY).
- Cross-reference: does every validator rule map to a template-emitted field? Does every template field have a validator check?
- Identify: orphan rules (validator enforces what templates don't emit), orphan fields (templates emit what validator ignores), duplicate coverage (multiple rules check the same invariant), and gaps (invariants neither templates nor validator enforce).
- Review dimensions: correctness, contracts, documentation. Adversarial not required; this is a hygiene pass.

**Dispatch block:**
```
/spec_kit:deep-review :confirm

Scope: Template v2.2 + validator ruleset joint audit. The templates under
.opencode/skill/system-spec-kit/templates/level_{1,2,3}/ and the validator
at scripts/spec/validate.sh (rules: FILE_EXISTS, PLACEHOLDER_FILLED,
SECTIONS_PRESENT, TEMPLATE_HEADERS, PHASE_LINKS, SPEC_DOC_INTEGRITY,
ANCHORS_VALID, CROSS_ANCHOR_CONTAMINATION, POST_SAVE_FINGERPRINT,
CONTINUITY_FRESHNESS, MERGE_LEGALITY, NORMALIZER_LINT, EVIDENCE_MARKER_LINT,
TOC_POLICY) evolve separately but are coupled. Identify orphan rules,
orphan fields, duplicate coverage, and unenforced invariants.

Review dimensions: correctness (rule-to-field mapping completeness),
contracts (template emit vs validator demand), documentation (CORE +
ADDENDUM architecture match). Iterations: 10-12.

Output: review/system-spec-kit-template-validator/review-report.md with
per-rule and per-field coverage tables, plus a ranked list of rule or
template changes. Any finding that would simplify the validator or eliminate
a false-positive class is P1.

Executor: cli-codex gpt-5.4 high fast.
```

---

#### SSK-RR-2 — Canonical-save pipeline invariant research [DEEP-RESEARCH]

**Why**: After H-56-1 shipped, `/memory:save` writes through `generate-context.js → description.json → graph-metadata.json → memory index`. Root validator runs already surface `CONTINUITY_FRESHNESS deltaMs=-8455798` (continuity timestamp newer than graph-metadata by 8.4M ms / ~2.3 hours) treated as "benign clock drift." But the 026 root validation also showed `EVIDENCE_MARKER_LINT: 1 malformed`, and `SPEC_DOC_INTEGRITY: 15 references missing` in recursive mode (child packets point at files under skill trees that don't exist in this checkout). Are these real divergences or expected artifacts? No single invariant spec exists.

**Scope** (12-15 iterations):
- Enumerate every state write performed during `/memory:save` (plan-only and full-auto modes): frontmatter fields touched, `description.json` fields written, `graph-metadata.json` `derived.*` fields updated, memory index rows inserted/updated, checkpoint state.
- Derive the intended invariants across those writes (e.g., `description.json.lastUpdated === max(frontmatter._memory.continuity.last_updated_at across packet docs)`).
- Observe actual invariant holding across a representative packet sample (26 active packets in the 026 tree).
- Classify each observed divergence as: expected (docs say so), benign (harmless artifact), latent (could mask real bug), real (drops state).
- Propose invariant assertions to bake into the validator + the save pipeline, with migration notes for any existing packet-local drift.

**Dispatch block:**
```
/spec_kit:deep-research :confirm

Scope: Canonical-save pipeline invariant research. The /memory:save pipeline
writes frontmatter, description.json, graph-metadata.json, and the memory
index. No single invariant spec exists. Root validator runs already show
benign-classified drift (CONTINUITY_FRESHNESS deltaMs=-8455798 treated as
clock skew).

Sources: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts,
scripts/spec-folder/generate-description.ts, scripts/core/workflow.ts (H-56-1
fix at :1259 + :1333), scripts/core/post-save-review.ts, validator rules
CONTINUITY_FRESHNESS + POST_SAVE_FINGERPRINT + SPEC_DOC_INTEGRITY.

Method: enumerate every state write. Derive intended invariants. Observe
actual invariant holding across the 26 active 026-tree packets. Classify
divergences (expected / benign / latent / real). Iterations: 12-15.

Output: research/system-spec-kit-canonical-save-invariants/research.md with
the invariant catalogue, divergence classification, and proposed validator
assertions + save-pipeline migration notes.

Executor: cli-codex gpt-5.4 high fast.
```

---

### Tier 2 — Opportunistic

#### SSK-DR-2 — Skill ↔ Command ↔ Agent boundary audit [DEEP-REVIEW]

**Why**: Gate 4 (HARD block) says iterative research/review loops MUST use skill-owned commands (`/spec_kit:deep-research`, `/spec_kit:deep-review`), not agents directly. But the CLAUDE.md skill ecosystem lists skills, commands, and agents overlapping at several boundaries (e.g., `sk-deep-research` skill, `@deep-research` agent, `/spec_kit:deep-research` command — three names, one concept). Review target: enumerate every skill/command/agent and their invocation surface; find overlap, duplication, or contract drift.

**Scope** (7-10 iterations): every `.opencode/skill/*/SKILL.md`, every `.opencode/command/*/`, every `.opencode/agent/*` (plus `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` if populated). Map callers/callees. Report P0 for broken Gate 4 enforcement, P1 for redundancy, P2 for naming clarity.

---

#### SSK-RR-3 — Cross-runtime portability research [DEEP-RESEARCH]

**Why**: CLAUDE.md §5 Runtime Agent Directory Resolution says pick `.opencode/agent/` vs `.claude/agents/` vs `.codex/agents/` vs `.gemini/agents/` based on active runtime. But most system-spec-kit internals (templates, validator, MCP server) are runtime-neutral in intent but OpenCode-first in practice. Research target: which pieces actually work cross-runtime unmodified, which are coupled, and what portability debt exists.

**Scope** (10-12 iterations): enumerate every cross-runtime touchpoint (agent directories, MCP server wiring, command dispatch, skill invocation, memory storage). Test or dry-run on all four runtimes where possible. Report portability debt per touchpoint + prioritized decoupling backlog.

---

### Tier 3 — Longer Horizon

- **SSK-RR-4: Template v3.0 evolution research** — empirical analysis of template section signal-per-line across the 86 spec folders. Which sections add noise? Which anchors are ceremonial vs load-bearing? Propose v3.0 template set with measured justification for each change.
- **SSK-RR-5: Completion-verification protocol efficacy** — does `checklist.md` P0/P1/P2 tagging plus the completion-verification rule actually prevent drift? Empirical: how often does an item marked `[x]` fail later QA or get retracted?
- **SSK-RR-6: Memory tier + importance-tier calibration** — `importance_tier: critical/important/high/medium/low` drives retrieval ranking. Is the ranking empirically aligned with retrieval usefulness? Requires retrieval trace telemetry first.
- **SSK-RR-7: Validator strict-mode noise analysis** — the validator generates many warnings on child packets (22 PHASE_LINKS on the 026 root alone). Which warnings are signal vs ambient noise? Which should be downgraded / upgraded / removed?

---

## 7. System-Spec-Kit Recommendation Matrix

| Target | Tier | Type | Leverage | Prerequisite |
|--------|------|------|----------|--------------|
| **SSK-RR-1 Gate 3 + skill-advisor accuracy** | 1 | Deep Research | HIGH | Labeled corpus (can synthesize) |
| **SSK-DR-1 template/validator joint audit** | 1 | Deep Review | HIGH | None |
| **SSK-RR-2 canonical-save invariants** | 1 | Deep Research | HIGH | None |
| SSK-DR-2 skill/command/agent boundary | 2 | Deep Review | MEDIUM | None |
| SSK-RR-3 cross-runtime portability | 2 | Deep Research | MEDIUM | Codex + Gemini runtime access |
| SSK-RR-4 template v3.0 evolution | 3 | Deep Research | MEDIUM | Usage telemetry |
| SSK-RR-5 completion-verification efficacy | 3 | Deep Research | MEDIUM | Checklist retraction history |
| SSK-RR-6 memory tier calibration | 3 | Deep Research | LOW-MEDIUM | Retrieval telemetry |
| SSK-RR-7 validator noise analysis | 3 | Deep Research | LOW-MEDIUM | None |

---

## 8. Combined Execution Order (026 + System-Spec-Kit)

**Sprint 1 (026 close-out)**: DR-1 delta-review 015 → (parallel) RR-2 description.json regen strategy + RR-1 Q4 NFKC research.

**Sprint 2 (system-spec-kit hygiene)**: SSK-DR-1 template/validator joint audit → (parallel) SSK-RR-1 Gate 3 + skill-advisor accuracy.

**Sprint 3 (opportunistic)**: DR-2 runtime-matrix review + DR-3 018 adversarial + SSK-RR-2 canonical-save invariants (can move earlier if drift incidents surface).

**Backlog**: Tier 3 items from both sections. Revisit when telemetry windows land or incident evidence arrives.

This ordering lets the 026 packet formally close out first, then shifts the audit focus to the skill-wide hygiene that the 026 consolidation has surfaced but did not resolve.
