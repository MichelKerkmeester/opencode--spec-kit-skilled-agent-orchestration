## Packet 050: feature-catalog-shape-realignment — Tier B doc realignment

You are cli-codex (gpt-5.5 high fast) implementing **050-feature-catalog-shape-realignment**.

### CRITICAL: Spec folder path

The packet folder is: `specs/system-spec-kit/026-graph-and-context-optimization/050-feature-catalog-shape-realignment/` — write ALL packet files there. Do NOT ask for the spec folder.

### Goal

Realign every per-feature snippet in the repo to the canonical sk-doc shape:

```
## 1. OVERVIEW
## 2. CURRENT REALITY
## 3. SOURCE FILES
## 4. SOURCE METADATA
```

Source of truth: `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md`

### Repo-wide audit (already complete; results below)

All 6 feature_catalog dirs were inventoried. **4 catalogs (350 per-feature files) are CONFORMANT** and only need a quick lint pass to confirm no drift. **2 catalogs (54 per-feature files) need full realignment.**

| Catalog | Per-feature files | Status |
|---------|-------------------|--------|
| `.opencode/skill/sk-deep-research/feature_catalog/` | 15 | ✓ CONFORMANT — lint only |
| `.opencode/skill/sk-deep-review/feature_catalog/` | 20 | ✓ CONFORMANT (TOC inside Section 1 — minor; align if cheap) |
| `.opencode/skill/sk-improve-agent/feature_catalog/` | 13 | ✓ CONFORMANT — lint only |
| `.opencode/skill/system-spec-kit/feature_catalog/` | 302 | ✓ CONFORMANT — lint only (sample 5-10 to confirm; full 302 at risk if 040 evergreen-rule replaced any sections) |
| **`.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/`** | **17** | **✗ REALIGN (uses SURFACE/TRIGGER/CLASS/CAVEATS/CROSS-REFS)** |
| **`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/`** | **37** | **✗ REALIGN (uses PURPOSE + TEST COVERAGE + RELATED)** |

Root-index files (`feature_catalog.md`) at all 6 catalog roots are conformant (TOC + OVERVIEW + per-category sections); leave them alone.

### Read these first

- `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md` (canonical 4-section per-feature shape)
- `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md` (root-index template — for context)
- A reference example: `.opencode/skill/sk-improve-agent/feature_catalog/01--evaluation-loop/01-rubric-loader.md` (cleanly conformant)
- `.opencode/skill/sk-doc/references/global/evergreen_packet_id_rule.md` (honor in any new content)
- `.opencode/skill/sk-doc/references/global/core_standards.md`
- `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### Phase 1: Lint pass on conformant catalogs (350 files; quick scan)

For each per-feature file in the 4 conformant catalogs, verify:

- Frontmatter has `title` + `description`
- H1 matches the title
- Intro is 1-2 sentences (no headers in intro)
- Sections in canonical order: 1. OVERVIEW → 2. CURRENT REALITY → 3. SOURCE FILES → 4. SOURCE METADATA
- Anchor markers `<!-- ANCHOR:slug -->` and `<!-- /ANCHOR:slug -->` balanced (per skill_reference_template)
- No packet-history references (honor evergreen-doc rule)

For sk-deep-review's TOC-inside-Section-1 anomaly: move TOC to before Section 1 (or remove if unnecessary) — small fix, do it.

If ANY conformant file has drift (e.g., legacy heading order, broken anchor), fix surgically. Aim: zero drift across all 4 conformant catalogs.

### Phase 2: Realign skill_advisor (37 files)

Current shape:
```
## TABLE OF CONTENTS
## 1. PURPOSE
## 2. CURRENT REALITY
## 3. SOURCE FILES
## 4. TEST COVERAGE
## 5. RELATED
```

Target shape:
```
## 1. OVERVIEW
## 2. CURRENT REALITY
## 3. SOURCE FILES
## 4. SOURCE METADATA
```

Mapping rules per file:
- `## 1. PURPOSE` → `## 1. OVERVIEW` (same content; rename heading. The sk-doc template's OVERVIEW captures the same intent as PURPOSE.)
- `## TABLE OF CONTENTS` → either move BEFORE `## 1. OVERVIEW` or REMOVE if it's just a 4-link list (the canonical 4-section shape is small enough that TOC adds no value). Prefer REMOVE; if the TOC has substantial inline anchor links to nested H3 content within the file, keep it before Section 1.
- `## 4. TEST COVERAGE` content → MERGE into `## 3. SOURCE FILES` under a new `### Validation And Tests` subsection (per snippet_template format with `| File | Type | Role |` table)
- `## 5. RELATED` content → MERGE into `## 4. SOURCE METADATA` as a `Related references:` list at the end of metadata, OR drop if the related links duplicate cross-refs already covered by SOURCE FILES paths
- Add `## 4. SOURCE METADATA` block per template:
  ```
  - Group: {category-name}
  - Canonical catalog source: `feature_catalog.md`
  - Feature file path: `{category-dir}/{NN}-{slug}.md`
  ```

Honor anchor markers — every section gets `<!-- ANCHOR:slug -->` open + `<!-- /ANCHOR:slug -->` close (per skill_reference_template Section 2 rule).

### Phase 3: Realign code_graph (17 files)

Current shape:
```
## 1. OVERVIEW
## 2. SURFACE
## 3. TRIGGER / AUTO-FIRE PATH
## 4. CLASS
## 5. CAVEATS / FALLBACK
## 6. CROSS-REFS
```

Target shape:
```
## 1. OVERVIEW
## 2. CURRENT REALITY
## 3. SOURCE FILES
## 4. SOURCE METADATA
```

Mapping rules per file:
- `## 1. OVERVIEW` content → keep but make sure it's a one-line intro + detail (per snippet template's OVERVIEW pattern)
- `## 2. SURFACE` content → MERGE into `## 3. SOURCE FILES` as the `### Implementation` table (`| File | Layer | Role |`)
- `## 3. TRIGGER / AUTO-FIRE PATH` + `## 4. CLASS` + `## 5. CAVEATS / FALLBACK` content → MERGE into `## 2. CURRENT REALITY` as paragraphs (the trigger + class + caveats describe HOW the feature behaves at runtime, which IS the current reality)
- `## 6. CROSS-REFS` content → MERGE into `## 4. SOURCE METADATA` as a `Related references:` list, OR drop if duplicative
- Add canonical `## 4. SOURCE METADATA` block

Honor anchor markers.

### Phase 4: Verification

Run a final shape audit across all 6 catalogs:

```bash
for f in $(find .opencode/skill -path '*/feature_catalog/*' -name '*.md' -not -name 'feature_catalog.md'); do
  shape=$(grep '^## ' "$f" | grep -v 'TABLE OF CONTENTS' | head -4 | tr '\n' '|')
  expected='## 1. OVERVIEW|## 2. CURRENT REALITY|## 3. SOURCE FILES|## 4. SOURCE METADATA|'
  if [ "$shape" != "$expected" ]; then echo "DRIFT: $f"; fi
done
```

Goal: zero DRIFT lines.

Plus:
- Strict validator on this packet (049-style): exits 0
- Evergreen-doc rule self-check on touched files: zero unexempted hits
- Build still passes (no code changes; this is doc-only)

### Packet structure to create (Level 2)

7-file structure under this packet folder.

PLUS: `audit-findings.md` (per-catalog drift list before+after), `remediation-log.md` (per-file mapping log), `lint-results.md` (conformant-catalog lint outcome).

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook","system-spec-kit/026-graph-and-context-optimization/048-remaining-p1-p2-remediation"]`.

**Trigger phrases**: `["050-feature-catalog-shape-realignment","feature catalog shape audit","sk-doc snippet template alignment","catalog OVERVIEW canonical"]`.

**Causal summary**: `"Audits all 6 feature_catalog directories in repo. Lints 4 conformant catalogs (350 files). Realigns skill_advisor (37 files: PURPOSE→OVERVIEW, merge TEST COVERAGE/RELATED into SOURCE FILES/SOURCE METADATA) and code_graph (17 files: rebuild SURFACE/TRIGGER/CLASS/CAVEATS into canonical OVERVIEW/CURRENT REALITY/SOURCE FILES/SOURCE METADATA). 54 file edits + lint sweep across 350 conformant files. Doc-only; no code or schema changes."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- DOC-ONLY. No code or schema changes.
- Do NOT touch root `feature_catalog.md` index files (they're conformant).
- Do NOT rewrite content meaning — only restructure section names + ordering + anchor markers.
- Strict validator MUST exit 0 on this packet.
- Evergreen-doc rule MUST be honored in any new/edited content.
- DO NOT commit; orchestrator commits.
- If a per-feature file has unique content that genuinely doesn't fit the 4-section shape (rare), document why in audit-findings.md and apply best-effort mapping.

When done, last action: strict validator passing + audit-findings.md showing zero remaining drift across all 6 catalogs. No narration; just write files and exit.
