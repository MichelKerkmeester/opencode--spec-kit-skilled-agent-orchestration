---
title: Evergreen Packet ID Rule
description: Prevents runtime-state documentation from referencing mutable spec or phase packet numbers.
---

# Evergreen Packet ID Rule

Evergreen documents describe the current runtime, not the packet history that produced it. Packet numbers, phase numbers, and packet-local finding IDs rot when specs are renumbered, archived, or consolidated.

---

<!-- ANCHOR:document-classes -->
## 1. DOCUMENT CLASSES

| Class | Examples | Packet IDs Allowed |
| --- | --- | --- |
| Spec-local docs | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `research-report.md`, `audit-findings.md`, `migration-plan.md` | Yes |
| Evergreen docs | `README.md`, `INSTALL_GUIDE.md`, `ARCHITECTURE.md`, `SKILL.md`, `AGENTS.md`, `CLAUDE.md`, `references/**/*.md`, `feature_catalog/**/*.md`, `manual_testing_playbook/**/*.md`, `ENV_REFERENCE.md` | No |

Spec-local docs may reference packet numbers because they are the packet record. Evergreen docs must describe the shipped state by feature name, command, file path, and source anchor.
<!-- /ANCHOR:document-classes -->

---

<!-- ANCHOR:examples -->
## 2. EXAMPLES

Bad evergreen references:
- "Added in packet 033"
- "Closes 013 P1-1"
- "Per 037/005 migration"
- "Shipped via 028"

Good evergreen references:
- "Defined at `mcp_server/handlers/memory-retention-sweep.ts:42`"
- "Run `npm run stress` from `mcp_server/`"
- "See `references/config/hook_system.md` for the hook contract"
<!-- /ANCHOR:examples -->

---

<!-- ANCHOR:audit-self-check -->
## 3. AUDIT SELF-CHECK

When auditing evergreen docs, search candidate files for packet-history references before publishing:

```bash
grep -nE '\b\d{3}-[a-z-]+\b|\b03[0-9]/00[0-9]\b|\bF-013-[0-9]+|\bP1-[0-9]+|\bpacket [0-9]{3}|\bphase [0-9]{3}|\bfrom packet|\bin packet|\bvia packet' <FILE>
```

Treat stable feature IDs, scenario IDs, and file names as false positives only when they identify current runtime artifacts rather than the packet that created them. Document any kept false positives in the audit record.
<!-- /ANCHOR:audit-self-check -->

---

<!-- ANCHOR:migration-guidance -->
## 4. MIGRATION GUIDANCE

When removing packet IDs from evergreen docs:
- Replace packet-history phrases with the current feature name and source anchor.
- Prefer file paths with line numbers when the implementation anchor matters.
- Link to the current reference document when the behavior is documented elsewhere.
- Remove "Recent changes" or "History" sections unless they describe current compatibility guarantees.
- Move packet-history notes into packet-local `implementation-summary.md` when the history still matters.

The target sentence should remain true after packet renumbering.
<!-- /ANCHOR:migration-guidance -->
