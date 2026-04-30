---
title: Evergreen Packet ID Rule
description: Prevents runtime-state documentation from referencing mutable spec or phase packet numbers.
---

# Evergreen Packet ID Rule

Evergreen documents describe the current runtime, not the packet history that produced it.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Packet numbers rot — feature names and source anchors don't.

### When to Use

Apply this rule whenever you author or edit any document that describes shipped runtime behavior:

- Repository-wide governance: `AGENTS.md`, `CLAUDE.md`, root `README.md`
- Skill reference docs: `SKILL.md`, `ARCHITECTURE.md`, `references/**/*.md`
- Folder-level READMEs: `mcp_server/README.md`, sub-folder READMEs
- Capability catalogs: `feature_catalog/**/*.md`, `manual_testing_playbook/**/*.md`
- Configuration references: `ENV_REFERENCE.md`, `INSTALL_GUIDE.md`

Skip this rule for spec-local docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `research-report.md`, `audit-findings.md`, `migration-plan.md`) — those ARE the packet record and naturally reference their own packet ID.

### Prerequisites

- Read [core_standards.md](./core_standards.md) for document type rules.
- Read [readme_template.md](../../assets/documentation/readme_template.md), [feature_catalog_template.md](../../assets/documentation/feature_catalog/feature_catalog_template.md), and [manual_testing_playbook_template.md](../../assets/documentation/testing_playbook/manual_testing_playbook_template.md) — these templates already enforce evergreen authoring patterns.
- Confirm the doc class (spec-local vs evergreen) before applying the audit grep, because spec-local docs are exempt by design.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:document-classes -->
## 2. DOCUMENT CLASSES

| Class | Examples | Packet IDs Allowed |
| --- | --- | --- |
| Spec-local docs | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `research-report.md`, `audit-findings.md`, `migration-plan.md` | Yes |
| Evergreen docs | `README.md`, `INSTALL_GUIDE.md`, `ARCHITECTURE.md`, `SKILL.md`, `AGENTS.md`, `CLAUDE.md`, `references/**/*.md`, `feature_catalog/**/*.md`, `manual_testing_playbook/**/*.md`, `ENV_REFERENCE.md` | No |

Spec-local docs may reference packet numbers because they are the packet record. Evergreen docs must describe the shipped state by feature name, command, file path, and source anchor.

<!-- /ANCHOR:document-classes -->

---

<!-- ANCHOR:examples -->
## 3. EXAMPLES

**❌ BAD evergreen references:**

- "Added in packet 033"
- "Closes 013 P1-1"
- "Per 037/005 migration"
- "Shipped via 028"

**✅ GOOD evergreen references:**

- "Defined at `mcp_server/handlers/memory-retention-sweep.ts:42`"
- "Run `npm run stress` from `mcp_server/`"
- "See `references/config/hook_system.md` for the hook contract"

**Why better:** Feature-name + source-anchor references stay valid after packet renumbering, archival, or consolidation.

<!-- /ANCHOR:examples -->

---

<!-- ANCHOR:audit-self-check -->
## 4. AUDIT SELF-CHECK

When auditing evergreen docs, search candidate files for packet-history references before publishing:

```bash
grep -nE '\b\d{3}-[a-z-]+\b|\b03[0-9]/00[0-9]\b|\bF-013-[0-9]+|\bP1-[0-9]+|\bpacket [0-9]{3}|\bphase [0-9]{3}|\bfrom packet|\bin packet|\bvia packet' <FILE>
```

Treat stable feature IDs, scenario IDs, and file names as false positives only when they identify current runtime artifacts rather than the packet that created them. Document any kept false positives in the audit record.

<!-- /ANCHOR:audit-self-check -->

---

<!-- ANCHOR:migration-guidance -->
## 5. MIGRATION GUIDANCE

When removing packet IDs from evergreen docs:

- Replace packet-history phrases with the current feature name and source anchor.
- Prefer file paths with line numbers when the implementation anchor matters.
- Link to the current reference document when the behavior is documented elsewhere.
- Remove "Recent changes" or "History" sections unless they describe current compatibility guarantees.
- Move packet-history notes into packet-local `implementation-summary.md` when the history still matters.

The target sentence should remain true after packet renumbering.

<!-- /ANCHOR:migration-guidance -->

---

<!-- ANCHOR:related-resources -->
## 6. RELATED RESOURCES

### Templates

- [feature_catalog_template.md](../../assets/documentation/feature_catalog/feature_catalog_template.md) — feature catalog evergreen-authoring shape
- [feature_catalog_snippet_template.md](../../assets/documentation/feature_catalog/feature_catalog_snippet_template.md) — per-feature snippet shape (OVERVIEW / CURRENT REALITY / SOURCE FILES / SOURCE METADATA)
- [manual_testing_playbook_template.md](../../assets/documentation/testing_playbook/manual_testing_playbook_template.md) — playbook authoring shape
- [readme_template.md](../../assets/documentation/readme_template.md) — README authoring shape
- [skill_reference_template.md](../../assets/skill/skill_reference_template.md) — reference file structure (this file's own template)

### Standards

- [core_standards.md](./core_standards.md) — document type rules and frontmatter conventions
- [hvr_rules.md](./hvr_rules.md) — high-value content rules used by sk-doc validation

<!-- /ANCHOR:related-resources -->
