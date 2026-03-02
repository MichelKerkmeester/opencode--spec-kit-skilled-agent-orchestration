# Synthesis Quality & Propagation Audit
## Generated: 2026-03-02
## Agent: Claude Opus 4.6 (leaf agent, depth 1)

---

### Part 1: Propagation Failure Map

Corrections discovered during deep-dives and cross-verification that failed to propagate to `implementation-summary.md`:

| # | Correction | Source (file:section) | Target (impl-summary section) | Status |
|---|-----------|----------------------|-------------------------------|--------|
| 1 | SQL template literals: 3/5 are false positives (downgrade P1 to P2) | `deep-dive-codex-verification.md`: SQL Safety table rows 1-3 | Section 6: "SQL Safety Audit" still lists all 5 as "P1 -- Template literal SQL" | **MISSING** -- Section 6 L166-171 lists all 5 files as P1 with no false-positive annotation |
| 2 | Tool count: 25 documented, not 23 | `deep-dive-codex-verification.md`: Tool Count table ("doc also lists 25") | Executive Summary: "23 MCP tools" (L13) | **MISSING** -- Exec summary still claims "23 MCP tools" verbatim |
| 3 | Signal count: "12 stages, 9 score-affecting" (precise framing) | `deep-dive-codex-verification.md`: Doc Accuracy row 1 | Section 2 says "should be 11" (L59); Section 6 says "12 signals" (L150) | **CONTRADICTED** -- Two different wrong values; Codex's precise "12 stages, 9 score-affecting" absent |
| 4 | Transaction boundary severity: P1 downgraded to P2 | `ultra-think-opus-meta-review.md`: L143 ("Classify as P2 improvement, not P1 requirement") | Section 6 L173-177: "P1 -- Missing transaction boundaries" | **MISSING** -- Still listed as P1 in Section 6; tasks.md was updated (item 17 says P2) but impl-summary was not |
| 5 | retry-manager redundancy debunked (zero functional overlap) | `most-recent-multi-agent-deep-review.md`: Section 1 CRITICAL finding (L22) | Section 1 L39: "retry-manager is a shim over mcp_server (should be in shared/)"; Section 5 L140: "Move retry-manager to shared/" | **CONTRADICTED** -- impl-summary actively recommends the opposite of what code verification proved |
| 6 | Phase D reindex entry point recommendation lost | `wave1-opus-import-map.md`: Phase C (L291) -- "consider having mcp_server export a dedicated reindex() function" | Nowhere in implementation-summary.md | **MISSING** -- Architecturally significant finding completely absent |
| 7 | Stage 2 docblock inconsistency (header=11, docblock=9, code=12) | `ultra-think-opus-meta-review.md`: Mentioned as unresolved | Section 2 or Section 6 of implementation-summary.md | **MISSING** -- Neither section documents this internal inconsistency in stage2-fusion.ts |
| 8 | Observations O-1 through O-5 (what NOT to change) | `wave2-opus-cross-reference.md`: Positive confirmations | implementation-summary.md | **MISSING** -- No positive confirmations recorded; only deficits listed |

**Summary**: 8 propagation failures identified. 0 of the 5 known failures were resolved. 3 additional failures discovered (items 6, 7, 8).

---

### Part 2: Fabricated Claims

| # | Claim | Appeared In | Source Search | Verdict |
|---|-------|-------------|---------------|---------|
| 1 | "C138 token is fabricated / hallucinated by synthesis" | `most-recent-multi-agent-deep-review.md` L214, L224 ("introduces fabricated 'C138' token not in any source") | `wave3-gemini-mcp-standards.md` L32: "Files use requirement/task tokens like `T005`, **`C138`**, `R10`, `P1-015` without mandatory `AI-TRACE` prefix" | **FALSE ACCUSATION** -- C138 DOES appear in the Gemini source file. The deep-review's claim that this was fabricated is itself a fabrication. Gemini G3 consistency audit (line 985 of `/tmp/g3-consistency.txt`) independently confirmed this. |
| 2 | retry-manager "move to shared/" recommendation | `wave1-synthesis.md` L51 (item 9): "Move retry-manager to shared/ (it's a shim over mcp_server)" | `wave1-opus-import-map.md` L64: Original said "Needs investigation: does mcp_server/lib/providers/retry-manager.ts add anything beyond what shared/utils/retry.ts provides?" -- a QUESTION, not a recommendation | **ESCALATED WITHOUT EVIDENCE** -- Opus's tentative "investigate possible redundancy" was synthesized into a definitive "move to shared/". The deep-review (Section 1) proved zero functional overlap between the two modules (generic backoff utility vs. 500-line embedding retry queue with DB ops). The synthesis fabricated certainty from uncertainty. |
| 3 | "retry-manager is a shim" characterization | `implementation-summary.md` L39: "retry-manager is a shim over mcp_server (should be in shared/)" | `wave1-opus-import-map.md` L64: Called it a "pure re-export shim" based on the comment in scripts/lib/retry-manager.ts -- BUT this refers to the scripts/ shim re-exporting from mcp_server, not claiming mcp_server's retry-manager is redundant with shared/ | **MISATTRIBUTED** -- The scripts/ shim IS a re-export (correct), but the synthesis conflated "scripts/lib/retry-manager.ts is a re-export shim" with "mcp_server's retry-manager is redundant with shared/utils/retry". These are entirely different claims. |
| 4 | Gemini claimed "2 undocumented tools" | `deep-dive-gemini-tool-count.md` (referenced in impl-summary Section 6) | `deep-dive-codex-verification.md` L38: "0 undocumented (doc has 25)" | **UNVERIFIED CLAIM PROPAGATED** -- Gemini never identified WHICH 2 tools were supposedly undocumented. The claim was accepted into impl-summary without verification. Codex later proved it false. |

---

### Part 3: AI Bias Patterns

#### Gemini: Severity Over-Escalation

Systematic pattern of assigning severity one notch higher than evidence supports.

| # | Evidence | Gemini Rating | Corrected Rating | Source |
|---|----------|:------------:|:----------------:|--------|
| 1 | SQL template literals -- 3/5 use fixed internal fragments, not user input | P1 | **P2** (code style, no security risk) | `deep-dive-codex-verification.md` L11-22 |
| 2 | MCP server code standards -- all violations are cosmetic (header format, narrative comments) | **P1** ("Major structural compliance") | **P2** (Codex rated identical violation type as P2) | `wave3-gemini-mcp-standards.md` L9 vs `wave3-codex-scripts-standards.md` L9 |
| 3 | Tool count -- claimed 2 undocumented tools | P1 (implicit -- flagged as documentation gap) | **Non-issue** (all 25 documented) | `deep-dive-codex-verification.md` L38 |
| 4 | Eval script location -- recommended moving scripts/evals/ to mcp_server/tests/evals/ | P1 ("Misplaced") | **P2** (Opus: coupling justified for benchmarks) | `wave1-synthesis.md` L21: synthesis resolved in favor of current location |

**Pattern**: Gemini excels at breadth scanning (catches real issues others miss) but consistently over-classifies severity. Every Gemini P1 that was cross-verified by another model was downgraded. Recommendation: treat Gemini P1 ratings as preliminary until independently confirmed.

#### Codex: Session Truncation

Systematic pattern of incomplete analysis due to context/session limits, with the incompleteness often hidden in synthesis.

| # | Evidence | Impact | Source |
|---|----------|--------|--------|
| 1 | Wave 2 existing features: "hit session limit before producing formatted summary" | 3/10 checklist items unverified (tool count, flag count, layer consistency) | `wave2-codex-existing-features.md` L5, L33-37 |
| 2 | Wave 2 synthesis hides truncation: grades Wave 2 as "A- (~91% fidelity)" without disclosing Codex's incomplete coverage | Consumers of synthesis unaware that 30% of Codex's checklist was skipped | `most-recent-multi-agent-deep-review.md` L213 |
| 3 | Codex prioritizes early checklist items; systemic checks at end consistently dropped | Tool count (the item that would have caught the 23 vs 25 error) was in the unverified tail | `wave2-codex-existing-features.md` L35: "Total tool count (23) -- needs manual count" |
| 4 | Deep-dive Codex verification checked only 3/5 SQL files | 2 SQL template findings (consumption-logger.ts, prediction-error-gate.ts) were "not explicitly checked" -- verdict inferred by pattern | `deep-dive-codex-verification.md` rows for items 4-6 vs `ultra-think-opus-meta-review.md` L70-71: "Not explicitly checked" |

**Pattern**: Codex delivers high-quality analysis for items it reaches, but session limits create a systematic tail-drop bias. The synthesis layer compounds this by not flagging incomplete coverage.

#### Opus: Observation-Over-Recommendation

Systematic tendency toward thorough observation with hedged or absent recommendations.

| # | Evidence | Hedging Language | Source |
|---|----------|-----------------|--------|
| 1 | retry-manager redundancy: flagged as "Needs investigation" rather than verifying | "This shim **may be** REDUNDANT **if** the retry-manager in mcp_server just re-exports..." | `wave1-opus-import-map.md` L64 |
| 2 | Transaction boundaries rated P2 with mitigation caveat | "**Worth noting** for future multi-process scenarios" | `wave4-opus-phase017-bugs.md` L376 |
| 3 | specFolderLock limitation: documented but no fix recommended | "This is acknowledged in code comments" -- stops at observation | `wave4-opus-phase017-bugs.md` L374 |
| 4 | reindex entry point: "**consider** having mcp_server export a dedicated reindex() function" | Passive "consider" framing for architecturally significant recommendation | `wave1-opus-import-map.md` L291 |
| 5 | null-typing inconsistency: observed 2 affected locations, no codemod or fix pattern suggested | "using the same convention everywhere **would be** cleaner" -- conditional language | `wave4-opus-phase017-bugs.md` L419 |

**Pattern**: Opus is the most accurately calibrated model (no severity over-escalation, no session truncation). However, it systematically hedges actionable recommendations behind conditional language ("may be", "could be", "worth noting", "consider"). This resulted in the retry-manager question being left unresolved through 4 waves until the deep-review finally verified it.

---

### Part 4: Structural Issues

#### Missing wave4-synthesis.md

- **tasks.md** line 28: `[x] Wave 4 synthesis` -- marked as complete
- **Glob search** for `wave4-synthesis*` in scratch/: **NO FILE FOUND**
- **Existing Wave 4 files**: Only `wave4-opus-phase017-bugs.md` exists, covering both Task 9 and Task 10
- **Waves 1-3**: Each has a dedicated synthesis file (`wave1-synthesis.md`, `wave2-synthesis.md`, `wave3-synthesis.md`)
- **Structural pattern break**: Wave 4 is the only wave without a synthesis document

**Impact**: The `[x]` checkbox in tasks.md implies completion verification was performed. Either:
- (a) Wave 4 synthesis content was folded directly into `implementation-summary.md` Section 4 without creating a standalone file (undocumented deviation from the wave 1-3 pattern), or
- (b) The checkbox was marked prematurely

**Verdict**: Structural integrity violation. The tasks.md completion marker is not backed by an artifact.

#### Additional Structural Issue: G3 Consistency Audit Partially Failed

The `/tmp/g3-consistency.txt` file contains 953 lines of Gemini API rate-limit errors (HTTP 429) before the actual G3 audit content begins at line 954. This indicates:
- The Gemini consistency audit required 4+ retry attempts across multiple API calls
- The output was captured with error logs interleaved, reducing reliability of the file as an audit artifact
- Despite the errors, the G3 content (lines 954-986) is substantive and correctly identifies all 5 known propagation failures

---

### Part 5: Cross-Audit Agreement Matrix

How do the three audit sources (G3 Gemini consistency audit, multi-agent deep review, this synthesis audit) agree?

| Finding | G3 Consistency | Deep Review | This Audit | Agreement |
|---------|:-:|:-:|:-:|-----------|
| SQL 3/5 false positive not propagated | YES (L966) | YES (L71) | YES (#1) | **UNANIMOUS** |
| Tool count 23 not corrected to 25 | YES (L967) | YES (L72) | YES (#2) | **UNANIMOUS** |
| Signal count nuance missing | YES (L968) | YES (L73) | YES (#3) | **UNANIMOUS** |
| Transaction P1->P2 not propagated | YES (L973) | YES (implied L56-61) | YES (#4) | **UNANIMOUS** |
| retry-manager debunked but still recommended | YES (L975) | YES (L22) | YES (#5) | **UNANIMOUS** |
| C138 fabrication claim | G3 says C138 IS in source (L985) | Deep review says C138 is NOT in source (L224) | This audit confirms G3: C138 IS in source | **G3 + THIS AUDIT correct; Deep review wrong** |
| Missing wave4-synthesis.md | YES (L980) | YES (L115) | YES (Part 4) | **UNANIMOUS** |

---

### Recommendations

#### Preventing Propagation Failures in Future Multi-AI Audits

1. **Back-propagation gate**: After any cross-verification deep-dive, require an explicit "propagation checklist" step that updates all upstream documents with corrections. No deep-dive should be considered complete until its corrections appear in the final deliverables.

2. **Synthesis provenance tags**: Every claim in a synthesis document should carry a source tag (e.g., `[SRC: wave3-gemini-mcp-standards.md:L32]`). This makes fabrication detectable by automated diff.

3. **Session-limit disclosure mandate**: When any AI agent hits a session limit, the synthesis MUST disclose this as a coverage caveat. Grade the synthesis fidelity score against verified items only, not total items.

4. **Severity confirmation protocol**: Any finding rated P1 or higher by a single model MUST be confirmed by at least one other model before being accepted at that severity level. Single-model P1 ratings should be listed as "P1 (unconfirmed)".

5. **Wave completeness artifact check**: Before marking a wave checkbox as `[x]`, verify that the expected output file exists. A simple `ls scratch/wave${N}-synthesis.md` check would have caught the missing wave4-synthesis.md.

6. **Hedged recommendation escalation**: When Opus-style models flag something as "needs investigation" or "consider", the synthesis should either (a) immediately investigate it or (b) explicitly track it as an open question. Do not silently convert tentative observations into definitive recommendations.

7. **Meta-review self-consistency**: The meta-review layer (deep-review) should run its own claims against the same source verification standard it applies to the synthesis. The C138 fabrication accusation demonstrates that reviewers can introduce the same class of error they are auditing for.
