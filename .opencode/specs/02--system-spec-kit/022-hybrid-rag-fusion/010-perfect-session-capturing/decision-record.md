---
title: "Decision Record: Perfect Session Capturing"
---
# Decision Record: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## Context

The five-backend native capture matrix was already implemented, and the workspace-identity follow-up fixed the raw-path portability gap. Real validation still exposed one remaining class of integrity bug, though: aligned or same-workspace saves could still look “good enough” to store even when they preserved too little durable context for a future agent to understand what actually happened.

This pass closes that gap by separating four ideas that were previously too entangled:

1. workspace discovery
2. target-spec alignment
3. contamination blocking
4. semantic sufficiency for a durable memory

---

<!-- ANCHOR:dr1 -->
## DR-001: Keep JSON-Mode Authoritative

**Decision:** JSON-mode input remains the only authoritative stateful input source. Every native CLI backend remains stateless-only.

**Why:** Explicit JSON still carries the clearest save intent and the richest schema. Native capture exists to support stateless operation, not to replace structured input.

**Consequences:** Loader behavior still short-circuits on explicit data-file input, and every native backend continues through the shared stateless path.
<!-- /ANCHOR:dr1 -->

---

<!-- ANCHOR:dr2 -->
## DR-002: Keep One Ordered Native Fallback Matrix

**Decision:** The native fallback order remains `OpenCode -> Claude -> Codex -> Copilot -> Gemini -> NO_DATA_AVAILABLE`.

**Why:** Discovery precedence was not the problem. The problems were path identity drift, save-path alignment drift, and missing semantic sufficiency checks after discovery.

**Consequences:** Loader behavior remains deterministic and testable while later gates decide whether the selected content is actually save-worthy.
<!-- /ANCHOR:dr2 -->

---

<!-- ANCHOR:dr3 -->
## DR-003: Make Repo-Local `.opencode` The Canonical Workspace Identity

**Decision:** Native matching resolves the active workspace through the nearest repo-local `.opencode` directory. Repo root, `.opencode`, and git-root forms are compatibility inputs, not primary identities.

**Why:** Different CLIs store the same workspace using different absolute path spellings. Matching raw strings caused false negatives even when the backend artifact belonged to the current project.

**Consequences:** One shared identity helper mediates native matcher acceptance. Equivalent paths are accepted only if they resolve to the same `.opencode` anchor.
<!-- /ANCHOR:dr3 -->

---

<!-- ANCHOR:dr4 -->
## DR-004: Keep Reasoning Hidden But Preserve Useful Tool Telemetry

**Decision:** Claude `thinking`, Codex reasoning items, and Gemini `thoughts` stay excluded from normalized output, while useful tool metadata remains.

**Why:** Internal reasoning is not durable project knowledge, but tool telemetry is often the only stateless evidence that real implementation or inspection work occurred.

**Consequences:** Native capture still preserves prompts, assistant responses, tool calls, and workspace-scoped file hints while excluding high-noise internal reasoning surfaces.
<!-- /ANCHOR:dr4 -->

---

<!-- ANCHOR:dr5 -->
## DR-005: Workspace Match Is Discovery Proof, Not Save Proof

**Decision:** Stateless save-path success requires a second target-spec affinity check after backend discovery. Workspace identity alone is not enough.

**Why:** The live OpenCode-first path could still discover a same-workspace session and index unrelated infrastructure work into spec `010` because generic `.opencode` overlap was being treated as sufficient alignment.

**Consequences:** Same-workspace sessions now need at least one target-spec anchor such as a declared file hit, exact spec id / slug match, or strong target-spec language before they may proceed. Otherwise the workflow throws `ALIGNMENT_BLOCK`.
<!-- /ANCHOR:dr5 -->

---

<!-- ANCHOR:dr6 -->
## DR-006: Recover Stateless `TOOL_COUNT` From Real Tool Evidence

**Decision:** The workflow recovers stateless `TOOL_COUNT` from actual native tool-call evidence instead of only using `FILES.length`.

**Why:** Read/search/bash-heavy sessions can be valid and useful even when they do not edit files. Treating `FILES.length` as the only rescue path caused false `V7` failures.

**Consequences:** Tool-rich captures without edited files can render with non-zero `tool_count`, while low-signal captures still face the normal quality and insufficiency gates.
<!-- /ANCHOR:dr6 -->

---

<!-- ANCHOR:dr7 -->
## DR-007: Prefer Safe Prompt Fallback Over Wholesale Prompt Reintroduction

**Decision:** When relevance filtering finds no keyword hit, the transform may keep generic/current-spec prompt content only if the capture already proves target-spec affinity. It does not re-include obviously foreign-spec or anchorless generic prompt text.

**Why:** The earlier “fall back to all prompts” behavior preserved timeline continuity, but it also reintroduced foreign-spec content and could trip `V8`.

**Consequences:** Generic prompts can still survive when safe, but foreign-spec or anchorless prompt fallback is dropped rather than trusted.
<!-- /ANCHOR:dr7 -->

---

<!-- ANCHOR:dr8 -->
## DR-008: Add One Shared Semantic Sufficiency Gate

**Decision:** All save surfaces now evaluate one shared semantic sufficiency contract after normalization and any safe structural auto-fixes.

**Why:** The system still lacked a direct answer to the question “is this enough context for a proper memory?” Without that gate, aligned but under-evidenced saves could still index and later mislead future agents.

**Consequences:** The save pipeline now rejects thin, metadata-only, or single-prompt memories with `INSUFFICIENT_CONTEXT_ABORT` even when workspace identity and target-spec alignment are already satisfied.
<!-- /ANCHOR:dr8 -->

---

<!-- ANCHOR:dr9 -->
## DR-009: Make Insufficiency Stronger Than Warn-Only Quality Modes

**Decision:** Insufficiency is an immediate hard-block and is not softened by the older warn-only save-quality gate behavior.

**Why:** Warn-only rollout modes are appropriate for threshold tuning, but not for memories that clearly do not contain enough durable evidence to be trustworthy later.

**Consequences:** `INSUFFICIENT_CONTEXT_ABORT` happens before embedding, deduplication, or persistence. Operators see a clear failure contract instead of a vague low-score warning.
<!-- /ANCHOR:dr9 -->

---

<!-- ANCHOR:dr10 -->
## DR-010: `memory_save` Dry-Run Must Surface Semantic Insufficiency

**Decision:** `memory_save({ dryRun:true })` now returns sufficiency results, reasons, and `rejectionCode` when a memory is under-evidenced.

**Why:** Dry-run is most useful when it previews the real save outcome. Hiding insufficiency until the non-dry-run path would make dry-run misleading.

**Consequences:** Dry-run remains non-mutating, but it now shows:

- preflight status
- quality-loop status
- sufficiency result
- `rejectionCode` when insufficiency fails
<!-- /ANCHOR:dr10 -->

---

<!-- ANCHOR:dr11 -->
## DR-011: `force:true` Must Not Override Semantic Integrity Gates

**Decision:** `force:true` may continue to bypass allowed dedup/update constraints, but it cannot override alignment, contamination, or insufficiency hard-blocks.

**Why:** Overriding those gates would let users and agents persist memories that the system already knows are unsafe or semantically incomplete.

**Consequences:** Forced saves still fail cleanly when the memory does not contain enough durable evidence.
<!-- /ANCHOR:dr11 -->

---

<!-- ANCHOR:dr12 -->
## DR-012: Preserve ANCHOR Tags During Post-Render HTML Cleanup

**Decision:** The `WORKFLOW_HTML_COMMENT_RE` regex uses a negative lookahead `(?!\s*\/?ANCHOR:)` to skip ANCHOR comment tags while stripping all other HTML comments from rendered output.

**Why:** The template renders 26 ANCHOR tag pairs (`&lt;!-- ANCHOR:id --&gt;` / `&lt;!-- /ANCHOR:id --&gt;`). The original regex `/<!--[\s\S]*?-->/g` treated them as ordinary HTML comments and deleted them all, leaving output files with zero structural anchors. These anchors are critical for memory indexing, search, and section-level retrieval.

**Consequences:** ANCHOR tags survive post-render cleanup. Non-ANCHOR template configuration comments are still stripped. The `extractAnchorIds()` function (line 538) now sees the tags it was designed to parse.
<!-- /ANCHOR:dr12 -->

---

<!-- ANCHOR:dr13 -->
## DR-013: Dynamic Trigger Phrase YAML Rendering

**Decision:** The template now receives one pre-rendered `TRIGGER_PHRASES_YAML` block for both frontmatter and trailing metadata instead of nesting identical Mustache sections inside the template.

**Why:** The workflow already extracted session-specific trigger phrases, but the original hardcoded frontmatter never used them. A first-pass Mustache replacement with nested identical `TRIGGER_PHRASES` blocks then leaked raw tags and repeated `trigger_phrases:` headers in live output. Pre-rendering the YAML block in the workflow keeps the template simple and valid.

**Consequences:** Frontmatter and trailing metadata always stay in sync, session-specific phrases render as one valid YAML list, and the no-trigger case now renders `trigger_phrases: []` rather than generic placeholders or a synthetic fallback.
<!-- /ANCHOR:dr13 -->

---

<!-- ANCHOR:dr14 -->
## DR-014: Treat Literal Template Syntax And Anchor Examples As Content, Not Structural Leakage

**Decision:** Captured operator text that includes literal Mustache tokens or literal anchor examples is escaped or ignored by validation rules unless it appears as real rendered structure.

**Why:** Live manual verification captured debugging prompts that mentioned `{{TRIGGER_PHRASES}}` and the literal escaped anchor example `&lt;!-- ANCHOR:id --&gt;`. Without special handling, those examples polluted generated titles, triggered placeholder-leak rules, or broke anchor validation even though the rendered memory structure itself was correct.

**Consequences:** Literal template syntax inside fenced code or inline code no longer trips `V5` or `V6`, generated slugs strip Mustache tokens, and quoted anchor examples are escaped before render so structural anchor validation only evaluates real anchors.
<!-- /ANCHOR:dr14 -->

---

## Consequences

- The stateless loader now supports the full native matrix with portable workspace matching.
- Discovery precedence remains unchanged, but path equivalence is no longer fragile.
- Same-workspace off-spec sessions fail explicitly before enrichment or indexing.
- Valid tool-rich stateless captures survive `V7` without weakening contamination safety.
- Thin aligned memories now fail with `INSUFFICIENT_CONTEXT_ABORT` instead of indexing.
- `memory_save` dry-run now previews insufficiency accurately and without side effects.
- Canonical docs now separate discovery success from later alignment, contamination, and sufficiency aborts.
- Research-driven deferral decisions (DR-015 through DR-019) acknowledge known systemic risks that are tracked for follow-up but out of scope for this spec.

---

<!-- ANCHOR:dr15 -->
## DR-015: Defer Session-Identity Validation Beyond Current Integrity Gates

**Decision:** This spec acknowledges the R-11 source-of-truth finding but defers session-ID-first transcript resolution, same-session validation, contamination score penalties tied to wrong-session capture, and filesystem-truth cross-checks to a follow-up scope. The current spec remains limited to workspace identity, target-spec affinity, contamination blocking, and semantic sufficiency.

**Why:** R-11 shows that `mtime`-based transcript selection can choose the wrong same-spec session even while downstream validators still pass because they only verify spec affinity, not session identity. Fixing that requires coordinated loader, capture, validation, scoring, and audit-surface changes across the pipeline, which would expand this spec beyond its frozen scope and introduce high regression risk late in the pass.

**Consequences:**
- Same-spec wrong-session capture remains a known source-of-truth risk when multiple sessions target the same spec folder.
- This debt is tracked in `research/research-pipeline-improvements.md` as R-11, Priority Matrix P0 item 0, and Recommended Implementation Sequence Phase A0.
- Revisit this decision in the next source-integrity follow-up that can change transcript resolution, V10 validation, contamination score penalties, and filesystem-truth comparison end to end.
<!-- /ANCHOR:dr15 -->

---

<!-- ANCHOR:dr16 -->
## DR-016: Defer Quality Scorer Contract Unification

**Decision:** This spec defers unifying the dual quality-scorer contract and keeps the current split behavior in place: normalized `0.0-1.0` quality for stored/indexed output and `1-100` quality thresholds for abort behavior and compatibility paths. Any migration to canonical `score01` with `score100` as a compatibility field is reserved for a dedicated follow-up.

**Why:** R-01 confirmed that the pipeline currently operates with two related but different scoring contracts, and that the abort threshold is explicitly validated on the `1-100` scale. Converging those contracts would require coordinated schema, config, workflow, frontmatter, and test-baseline updates, which is broader than this frozen spec and carries medium migration risk if done opportunistically.

**Consequences:**
- Dual-scale quality behavior remains known contract debt and can still cause fidelity drift between workflow gating and persisted metadata.
- This debt is tracked in `research/research-pipeline-improvements.md` as R-01 and Priority Matrix P0 item 1.
- Revisit this decision in a contract-consolidation follow-up scoped specifically to `QualityScoreResult`, `score01` canonicalization, `score100` compatibility, and threshold migration.
<!-- /ANCHOR:dr16 -->

---

<!-- ANCHOR:dr17 -->
## DR-017: Defer Lossless Metadata Preservation Through Normalization

**Decision:** This spec defers changing normalization to preserve file-level and extractor-facing metadata end to end, including `ACTION`, `_provenance`, `_synthetic`, manual decision enrichment fields, and object-based fact fidelity. The current normalization contract remains in place for this pass.

**Why:** R-03 shows that normalization is still lossy at the pipeline boundary and drops metadata before downstream extractors can use it. Fixing that would alter shared input contracts across multiple extraction branches and would expand this spec from integrity-gate hardening into a broader data-model and helper-consolidation effort, which is outside the frozen scope.

**Consequences:**
- Entry-point metadata loss remains known technical debt, including dropped file-action context and reduced fidelity for downstream extraction and rendering.
- This debt is tracked in `research/research-pipeline-improvements.md` as R-03, Priority Matrix P0 item 2, and P2 cleanup items for helper centralization and drop instrumentation.
- Revisit this decision in a dedicated data-fidelity follow-up before or alongside broader extractor-contract consolidation.
<!-- /ANCHOR:dr17 -->

---

<!-- ANCHOR:dr18 -->
## DR-018: Defer Further Template-Compliance Hardening Beyond Implemented Validator Enforcement

**Decision:** This spec records the newly implemented template-compliance enforcement as sufficient for the current pass and defers deeper hardening beyond it. The current scope stops at the new `TEMPLATE_HEADERS` rule and the extended required-anchor validation in `ANCHORS_VALID`; structural fingerprinting, inline template delegation content, and automatic strict post-agent validation are deferred.

**Why:** R-12 showed a real generation-time compliance gap, and the implemented validator changes close the immediate blind spot without expanding the spec into broader delegation and orchestration changes. Additional hardening would touch agent prompting, workflow automation, and stricter post-generation enforcement, which exceeds the frozen scope even though the research strongly supports it.

**Consequences:**
- Template semantics are better protected than before, but external-agent deviations can still survive outside the new header and required-anchor checks.
- This follow-up debt is tracked in `research/research-pipeline-improvements.md` as R-12, especially the future items for structural fingerprinting, inline template content in delegation prompts, and automatic strict validation.
- Revisit this decision in a dedicated template-generation hardening pass after the current validator-level enforcement has been exercised on more real agent output.
<!-- /ANCHOR:dr18 -->

---

<!-- ANCHOR:dr19 -->
## DR-019: Defer Auto-Detection Cascade Expansion Beyond Current Ranking Logic

**Decision:** This spec defers expanding the spec-folder auto-detection cascade beyond its current ranking logic. New git-status signals, session-activity signals, parent-folder affinity boosts, key-files fallbacks, and broader template-to-workflow wiring identified by R-13 are reserved for a follow-up detection pass.

**Why:** R-13 shows that the current cascade is fragile under production-scale repo conditions, especially when parent folders compete with active children or when many same-depth candidates exist. Addressing that fragility requires coordinated changes across folder detection, transcript-derived activity, workflow enrichment, and downstream rendering contracts, which would broaden this spec beyond its frozen scope and couple it tightly to the unresolved R-11 session-source problem.

**Consequences:**
- Depth-bias, stale-candidate competition, and missing git/session signals remain known risks in first-save, parent-folder, and bulk-file workflows.
- This debt is tracked in `research/research-pipeline-improvements.md` as R-13, including Priority Matrix P0 items 6-8 and P1 items 11-13.
- Revisit this decision after the source-integrity follow-up for R-11, because wrong-session capture and weak folder detection compound each other and should be corrected together.
<!-- /ANCHOR:dr19 -->
