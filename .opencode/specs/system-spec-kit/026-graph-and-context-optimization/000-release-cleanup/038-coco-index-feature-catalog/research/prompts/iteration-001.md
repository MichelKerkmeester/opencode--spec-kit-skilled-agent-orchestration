## Packet 051: coco-index-feature-catalog — Author full feature catalog for mcp-coco-index

You are cli-codex (gpt-5.5 high fast) implementing **038-coco-index-feature-catalog**.

### CRITICAL: Spec folder path

The packet folder is: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/038-coco-index-feature-catalog/` — write ALL packet files there. Do NOT ask for the spec folder.

### Goal

Author a complete `feature_catalog/` for `.opencode/skill/mcp-coco-index/` following the canonical sk-doc shape. The skill currently has SKILL.md, references/, scripts/, tests/, mcp_server/, manual_testing_playbook/, assets/ — but **no feature_catalog/**. This packet creates one.

### Source of truth

- Per-feature shape: `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md` (4 sections: OVERVIEW / CURRENT REALITY / SOURCE FILES / SOURCE METADATA)
- Root-index shape: `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md` (TOC + OVERVIEW + per-category sections)
- Reference example: `.opencode/skill/sk-improve-agent/feature_catalog/` (cleanly conformant)
- Evergreen rule: `.opencode/skill/sk-doc/references/global/evergreen_packet_id_rule.md` (no packet IDs in evergreen content)
- Standards: `.opencode/skill/sk-doc/references/global/{core_standards.md,hvr_rules.md}`

### Phase 1: Inventory the surface

Read these and build the feature inventory:
- `.opencode/skill/mcp-coco-index/SKILL.md` (smart routing, when to use, activation triggers)
- `.opencode/skill/mcp-coco-index/README.md`
- `.opencode/skill/mcp-coco-index/references/tool_reference.md` (CLI commands + MCP tool spec)
- `.opencode/skill/mcp-coco-index/references/search_patterns.md`
- `.opencode/skill/mcp-coco-index/references/settings_reference.md`
- `.opencode/skill/mcp-coco-index/references/cross_cli_playbook.md`
- `.opencode/skill/mcp-coco-index/references/downstream_adoption_checklist.md`
- `.opencode/skill/mcp-coco-index/scripts/{install.sh,doctor.sh,ensure_ready.sh,update.sh,common.sh}`
- `.opencode/skill/mcp-coco-index/tests/test_*.py` (skim for what behaviors are validated)
- `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skill/mcp-coco-index/mcp_server/pyproject.toml` (entry points)

Also inspect the upstream patches: SKILL.md mentions REQ-001..006 (mirror dedup + path-class reranking). Find the actual implementation files under `.opencode/skill/mcp-coco-index/mcp_server/` (look for cocoindex_code/ source).

### Phase 2: Decide categories

Propose ~6-9 category groups using the `NN--name/` directory naming pattern. Suggested (refine based on actual surface):

```
01--cli-commands/         (ccc search, index, status, init, reset, mcp, daemon)
02--mcp-server/           (search tool, stdio transport, request schema)
03--indexing-pipeline/    (chunking, embedding, persistence, languages)
04--daemon-and-readiness/ (ensure_ready, lifecycle, port management)
05--search-and-ranking/   (semantic search, top-k, reranking, language filters)
06--patches-and-extensions/ (mirror dedup REQ-001..006, path-class reranking)
07--installation-tooling/ (install.sh, doctor.sh, update.sh)
08--configuration/        (settings schema, env vars, .ccc/ workspace dir)
09--validation-and-tests/ (test_*.py coverage map)
```

Adapt category count and names to fit the actual surface — do not invent features that don't exist.

### Phase 3: Author per-feature snippets

For EACH feature, create a file at `.opencode/skill/mcp-coco-index/feature_catalog/<NN>--category/<NN>-feature-slug.md` matching the canonical 4-section shape:

```markdown
---
title: "<NN>. <Feature Name>"
description: "<one-line description>"
---

# <NN>. <Feature Name>

<one or two-sentence intro — no headers in intro>

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW
<what the feature is, why it exists>
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY
<runtime behavior, edge cases, interactions>
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `relative/path:line` | <layer> | <role> |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `tests/test_*.py:line` | <type> | <role> |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: <category-name>
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `<NN>--category/<NN>-feature-slug.md`

<!-- /ANCHOR:source-metadata -->
```

Frontmatter MUST have `title` + `description`. Anchor markers MUST be balanced. No packet IDs anywhere in catalog content (honor evergreen rule).

Cite real `file:line` references in SOURCE FILES tables — do not fabricate. Run `grep -n` or `rg` against the actual mcp-coco-index source to find anchors.

### Phase 4: Author root-index `feature_catalog.md`

At `.opencode/skill/mcp-coco-index/feature_catalog/feature_catalog.md`, author the root index following `feature_catalog_template.md`:

- Frontmatter (`title`, `description`, `trigger_phrases`)
- TOC linking to each per-feature file
- `## 1. OVERVIEW` of the catalog scope
- One section per category with feature list + relative links

### Phase 5: Author packet docs (Level 2)

At the packet folder, author Level 2 docs from templates at `.opencode/skill/system-spec-kit/templates/level_2/`:
- `spec.md` — goal, scope, success criteria
- `plan.md` — phases (inventory, categorization, snippets, root index, validation)
- `tasks.md` — actionable task list
- `checklist.md` — P0/P1/P2 acceptance items (target ≥18 items, 100% [x])
- `decision-record.md` — category decisions, file path conventions, exclusions
- `implementation-summary.md` — populate after work completes
- `description.json` + `graph-metadata.json` — generate via `generate-context.js` OR mirror from a sibling packet (049 or 050) and update fields

Continuity frontmatter (`_memory.continuity`) MUST be valid: `recent_action` and `next_safe_action` < 80 chars each.

### Phase 6: Verification

Run these and capture results:

```bash
# Strict validator MUST exit 0
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/038-coco-index-feature-catalog --strict

# Shape audit MUST show zero DRIFT for the new catalog
for f in $(find .opencode/skill/mcp-coco-index/feature_catalog -name '*.md' -not -name 'feature_catalog.md'); do
  shape=$(grep '^## ' "$f" | grep -v 'TABLE OF CONTENTS' | head -4 | tr '\n' '|')
  expected='## 1. OVERVIEW|## 2. CURRENT REALITY|## 3. SOURCE FILES|## 4. SOURCE METADATA|'
  if [ "$shape" != "$expected" ]; then echo "DRIFT: $f"; fi
done

# Evergreen self-check on new catalog files (zero unexempted hits)
grep -rnE '\b\d{3}-[a-z-]+\b|\bpacket [0-9]{3}|\bphase [0-9]{3}|\bfrom packet|\bin packet|\bvia packet' \
  .opencode/skill/mcp-coco-index/feature_catalog/ || true

# Build sanity (no code changes expected; doc-only)
cd .opencode/skill/system-spec-kit/mcp_server && npm run build && cd -
```

### Phase 7: Audit + remediation log

Author `audit-findings.md` (per-category coverage decisions, exclusions with reason) and `remediation-log.md` (per-file mapping log).

### Constraints

- **DOC-ONLY.** No code or schema changes to mcp-coco-index runtime.
- Do NOT touch the upstream cocoindex-code/ vendored source — only catalog new feature docs that reference it.
- Cite real `file:line` references — never fabricate.
- Strict validator MUST exit 0 on packet 051.
- Evergreen-doc rule MUST be honored (no packet IDs in evergreen content).
- DO NOT commit; orchestrator commits.
- Honor `[features].codex_hooks` semantics if relevant — but this is doc-only.
- Stay on `main` branch; do NOT create a feature branch.

### Packet meta

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/037-feature-catalog-shape-realignment"]`.

**Trigger phrases**: `["038-coco-index-feature-catalog","mcp-coco-index feature catalog","cocoindex catalog","semantic search catalog"]`.

**Causal summary**: `"Authors a complete feature_catalog/ for .opencode/skill/mcp-coco-index/ following the canonical sk-doc 4-section snippet shape. ~30-50 per-feature snippets across ~6-9 categories with file:line citations. Root index follows feature_catalog_template. Evergreen-rule clean. Strict validator passes."`.

When done, last action: strict validator passing + zero DRIFT across new mcp-coco-index catalog. No narration; just write files and exit.
