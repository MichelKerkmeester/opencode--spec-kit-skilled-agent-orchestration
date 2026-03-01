---
title: "Decision Record: Spec 126 Documentation Alignment [127-documentation-alignment/decision-record]"
description: "Spec 126 added spec folder document indexing as a 5th source in the memory pipeline. The code implementation used true as the default for includeSpecDocs, but all documentation ..."
trigger_phrases:
  - "decision"
  - "record"
  - "spec"
  - "126"
  - "documentation"
  - "decision record"
  - "127"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Spec 126 Documentation Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Set `includeSpecDocs` default to `true`

<!-- ANCHOR:adr-001-context -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | Michel Kerkmeester |

---

### Context

Spec 126 added spec folder document indexing as a 5th source in the memory pipeline. The code implementation used `true` as the default for `includeSpecDocs`, but all documentation (8+ files) still showed `false`. The decision was whether to align docs to `true` (matching code) or change code to `false` (conservative default).

### Constraints
- Code already shipped with `true` as the default
- Changing code default would be a behavioral regression
- 8+ doc files needed updating if keeping `true`

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Keep the code default of `true` and update all 8+ documentation files to match.

**Details**: Updated `includeSpecDocs` default from `false` to `true` in SSK README.md (2 locations), SKILL.md, MCP README.md (2 locations), memory_system.md, readme_indexing.md, and save_workflow.md.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep `true`, update docs** | Matches shipped code, spec docs indexed by default | More doc changes needed | 9/10 |
| Change to `false`, keep docs | Fewer changes, conservative | Behavioral regression, defeats spec 126 purpose | 3/10 |

**Why Chosen**: The entire purpose of spec 126 was to enable spec document indexing. Defaulting to `false` would make the feature opt-in and defeat its purpose.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Spec folder documents are automatically indexed without user configuration
- Documentation matches actual code behavior

**Negative**:
- Slightly larger index size by default - Mitigation: Incremental indexing (mtime check) keeps re-index cost low

<!-- /ANCHOR:adr-001-consequences -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Route `find_spec` to deep mode, `find_decision` to focused mode

<!-- ANCHOR:adr-002-context -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | Michel Kerkmeester |

---

### Context

Spec 126 added 2 new intent types (`find_spec`, `find_decision`) to the intent classifier, but they had no entries in the `INTENT_TO_MODE` routing table in `memory-context.ts`. Without routing, both intents would fall through to the default `focused` mode.

### Constraints
- Must match existing routing patterns for similar intents
- `find_spec` needs comprehensive retrieval (full spec documents)
- `find_decision` needs targeted rationale lookup

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Route `find_spec` → `deep` mode and `find_decision` → `focused` mode.

**Details**: Added both entries to the `INTENT_TO_MODE` map in `memory-context.ts`. `find_spec` uses `deep` mode (like `add_feature`, `refactor`, `security_audit`) because spec retrieval benefits from comprehensive context with higher token budget (2000). `find_decision` uses `focused` mode (like `fix_bug`, `understand`) because decision lookups target specific rationale with intent-optimized weights (1500 token budget).

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **find_spec→deep, find_decision→focused** | Matches retrieval patterns of similar intents | None identified | 9/10 |
| Both → deep | Comprehensive for both | Decision lookups don't need full context, wastes tokens | 5/10 |
| Both → focused | Lower token cost | Spec retrieval truncated, misses related documents | 4/10 |

**Why Chosen**: Aligns with existing intent routing patterns. Spec retrieval is similar to `add_feature` (needs broad context); decision lookup is similar to `understand` (needs targeted results).

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Queries like "find the spec for auth" get comprehensive spec document context
- Queries like "why did we choose JWT" get focused decision records without noise

**Negative**:
- None identified

<!-- /ANCHOR:adr-002-consequences -->

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Expand scope to include tests, code comments, and command files

<!-- ANCHOR:adr-003-context -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | Michel Kerkmeester |

---

### Context

The original spec 127 was scoped as "documentation-only" — updating READMEs, SKILL.md, and reference files. During planning, it became clear that test files had stale assertions (`5 intent` → `7 intent`, `4 source` → `5 source`), the intent-classifier comment said "5 intent types", the tool-schemas lacked the new intents, and 4 command files (context.md, manage.md, learn.md, save.md) needed updates.

### Constraints
- Original spec explicitly excluded test files and code comments
- Stale test assertions would fail after INTENT_TO_MODE code changes
- Command files are user-facing documentation

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Expand scope to include code changes (INTENT_TO_MODE, tool-schemas, intent-classifier comment), test updates (4 test files), and command file updates (4 command files).

**Details**: The expanded scope added 10 work items covering: code (WI-1: memory-context.ts, tool-schemas.ts, intent-classifier.ts), tests (WI-2 through WI-4: memory-context, handler-helpers, integration-readme-sources test files), docs (WI-5/WI-6: SSK README, SKILL.md, MCP README, 3 reference files), and commands (WI-7 through WI-10: context.md, manage.md, learn.md, save.md).

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full alignment (code + tests + docs + commands)** | Complete consistency, no stale references anywhere | Larger scope than original spec | 9/10 |
| Docs only (original scope) | Smaller scope | Tests would fail, tool-schemas incomplete, commands stale | 3/10 |
| Docs + code only | Tests stay "informational" | Stale test assertions could mask regressions | 5/10 |

**Why Chosen**: Half-measures would leave the system in an inconsistent state. The INTENT_TO_MODE code change was necessary for the 2 new intents to actually work, which cascaded into test updates. Command files are user-facing and equally important as READMEs.

<!-- /ANCHOR:adr-003-alternatives -->

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Rename "simulation mode" to "stateless mode" in save.md

<!-- ANCHOR:adr-004-context -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | Michel Kerkmeester |

---

### Context

The `save.md` command file referred to a "simulation mode" when the `generate-context.js` script falls back to extracting data from the spec folder instead of using rich JSON input. The term "simulation" was misleading — it implied fake/test data rather than what actually happens (automatic extraction without conversation context).

<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Rename all references from "simulation mode" to "stateless mode" across save.md.

**Details**: Updated 4 locations: the CRITICAL note under Step 4, the trigger phrase in the JSON example, the warning message, and the error handling table entry.

<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- More accurate description of the fallback behavior
- Users understand the script still produces real output, just without conversation context

**Negative**:
- None

<!-- /ANCHOR:adr-004-consequences -->

<!-- /ANCHOR:adr-004 -->

---

<!--
Level 3 Decision Record
4 ADRs documenting key decisions for spec 127
-->
