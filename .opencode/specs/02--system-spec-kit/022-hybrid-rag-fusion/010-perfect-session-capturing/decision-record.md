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
