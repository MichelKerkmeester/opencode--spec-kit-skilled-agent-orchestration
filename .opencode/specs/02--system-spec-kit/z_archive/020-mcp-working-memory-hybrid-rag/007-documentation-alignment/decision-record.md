---
title: "Decision Record: Documentation Alignment [007-documentation-alignment/decision-record]"
description: "Documentation alignment follows completed Waves 1-3 and closes a doc-to-code drift gap. The goal is to restore accuracy of module inventories, feature flags, architecture flow d..."
trigger_phrases:
  - "decision"
  - "record"
  - "documentation"
  - "alignment"
  - "decision record"
  - "007"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3 -->
# Decision Record: Documentation Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->

---

<!-- ANCHOR:context -->
## Context

Documentation alignment follows completed Waves 1-3 and closes a doc-to-code drift gap. The goal is to restore accuracy of module inventories, feature flags, architecture flow descriptions, and command signatures without changing implementation behavior.
<!-- /ANCHOR:context -->

---

<!-- ANCHOR:decisions -->
## Decisions

### ADR-007-001: Scope to existing README patterns only

**Status:** Accepted
**Date:** 2026-02-19

**Context:** The 30+ files needing updates each follow different README conventions (HVR format, ANCHOR tags, module tables). We could standardize all READMEs to a single format or preserve existing patterns.

**Decision:** Preserve each README's existing format and pattern. Only add missing content; do not restructure.

**Rationale:** Restructuring would create unnecessary diff noise, risk breaking ANCHOR tags that the memory system depends on for indexing, and increase review burden. The goal is alignment, not reformatting.

**Consequences:** Some READMEs will remain in slightly different styles. Acceptable trade-off for lower risk and faster delivery.

---

### ADR-007-002: Feature flags documented in 3 locations

**Status:** Accepted
**Date:** 2026-02-19

**Context:** `SPECKIT_ADAPTIVE_FUSION` and `SPECKIT_EXTENDED_TELEMETRY` need documentation. Options: (A) single canonical location, (B) 3 locations for discoverability.

**Decision:** Document both flags in Skill README, MCP Server README, and INSTALL_GUIDE. Each location gets the same table format: flag name, default value, purpose, source file.

**Rationale:** Users access documentation through different entry points. A developer might read the MCP Server README; a new user reads the INSTALL_GUIDE; an AI assistant reads SKILL.md. All three should surface the flags.

**Consequences:** Minor duplication (one table in 3 places). Acceptable because flag lists change rarely and the cost of missing a flag in a key doc is higher than the cost of maintaining 3 copies.

---

### ADR-007-003: New folder READMEs follow existing lib subfolder pattern

**Status:** Accepted
**Date:** 2026-02-19

**Context:** Three new folders (`contracts/`, `telemetry/`, `extraction/`) need READMEs. Options: (A) minimal stub, (B) full pattern matching existing lib subfolder READMEs.

**Decision:** Full pattern match. Each new README includes: purpose section, module count, file listing with descriptions, key exports table, and ANCHOR tags.

**Rationale:** Consistency with existing READMEs ensures the memory system indexes them correctly and developers can navigate them the same way. A stub would be insufficient for memory retrieval.

---

### ADR-007-004: Memory commands get targeted updates, not rewrites

**Status:** Accepted
**Date:** 2026-02-19

**Context:** The 5 memory command files have stale tool signature documentation. Options: (A) full rewrite, (B) targeted additions to existing parameter lists and behavior descriptions.

**Decision:** Targeted additions only. Add missing parameters, feature flag context, and mutation-ledger notes to existing sections. Do not restructure command flow or change execution logic.

**Rationale:** Memory commands are execution engines (YAML-backed workflows). Restructuring them risks breaking command behavior. The gap is informational (missing parameter docs), not structural.

---

### ADR-007-005: Track legacy embedding-provider drift as post-completion addendum

**Status:** Accepted, resolved
**Date:** 2026-02-19

**Context:** Follow-up investigation found a legacy placeholder suite in `mcp_server/tests/embeddings.vitest.ts` still references `lib/interfaces/embedding-provider`, but that module path was removed during TS migration. Current provider contracts now live in shared paths. A related drift class also remained in three deferred suites (`api-key-validation`, `api-validation`, `lazy-loading`) that were still excluded from active coverage.

**Decision:** Record this as a post-completion documentation/runtime drift addendum in parent spec 136 root docs and this package's closure artifacts (`tasks.md`, `checklist.md`, `implementation-summary.md`). Do not reopen package 007 implementation scope. Mark the addendum closed once the architecture-aligned rewrite of `tests/embeddings.vitest.ts` lands and the deferred API/startup suites are converted to active tests.

**Rationale:** Package 007 remains complete for its original scope. The newly discovered drift item was factual and relevant to alignment quality, so it was documented without rewriting completed task groups.

**Consequences:** Closure artifacts include both the drift record and resolution state. `tests/embeddings.vitest.ts` was rewritten to current shared embedding architecture, old deferred marker removed, and targeted verification now passes (1 file passed, 13 tests passed, 0 skipped). The three previously deferred suites are now active and pass in targeted verification (3 files passed, 15 tests passed, 0 skipped), with root all-features totals updated to 142 passed test files and 4415 passed tests (19 skipped).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:consequences -->
## Consequences

- Documentation accuracy improves retrieval quality and onboarding confidence.
- Existing formatting differences remain where intentional to minimize change risk.
- Future updates should verify counts and references against repository state before marking checklist completion.
<!-- /ANCHOR:consequences -->
