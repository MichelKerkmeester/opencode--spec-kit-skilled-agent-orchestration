# Evidence Directory

This directory stores verification evidence for checklist items in `checklist.md`.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This README documents the purpose and usage of this spec folder and links to the primary artifacts in this directory.

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1.  OVERVIEW]](#1--overview)

---
<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:purpose -->
## Purpose

When marking checklist items as complete, store supporting evidence here and reference it using the evidence notation format.
<!-- /ANCHOR:purpose -->

<!-- ANCHOR:evidence-types -->
## Evidence Types

| Type | Format | Example |
|------|--------|---------|
| Screenshot | `[E:filename.png]` | `[E:startup-time-500ms.png]` |
| Test output | `[E:filename.log]` | `[E:unit-tests-pass.log]` |
| Commit ref | `[E:commit:hash]` | `[E:commit:abc1234]` |
| Human review | `[E:review:date]` | `[E:review:2026-02-01]` |
| Automated | `[E:automated]` | Passed automated validation |
<!-- /ANCHOR:evidence-types -->

<!-- ANCHOR:file-naming-convention -->
## File Naming Convention

Use descriptive names that include the CHK ID when possible:
- `CHK-097-startup-time.png`
- `CHK-088-acceptance-tests.log`
- `phase1-integration-tests.log`
<!-- /ANCHOR:file-naming-convention -->

<!-- ANCHOR:lifecycle -->
## Lifecycle

Evidence files are temporary and can be cleaned up after:
1. The spec folder work is complete
2. Evidence has been reviewed and approved
3. Sign-off is recorded in the checklist
<!-- /ANCHOR:lifecycle -->

<!-- ANCHOR:related -->
## Related

- Parent checklist: `../../checklist.md`
- Evidence Log section in checklist tracks all evidence references
<!-- /ANCHOR:related -->

