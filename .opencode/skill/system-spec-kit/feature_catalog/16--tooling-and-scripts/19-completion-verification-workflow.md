---
title: "Completion Verification Workflow"
description: "Checklist completion verifier for spec folders that enforces P0/P1 completion, evidence markers, priority tagging, optional strict P2 enforcement, and JSON or human-readable status reporting."
---

# Completion Verification Workflow

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Completion Verification Workflow is the spec-kit completion gate that decides whether a spec folder is ready to be claimed as finished. It audits `checklist.md` inside a target spec folder, counts checkbox items by priority, and blocks completion when critical or required work is missing.

The workflow is stricter than a plain checkbox counter. It understands inherited priority context from Markdown headings, treats untagged checklist items as blocking, and requires evidence markers on completed P0 and P1 items before the workflow returns a passing status.

## 2. CURRENT REALITY

`check-completion.sh` takes a spec-folder path plus optional `--json`, `--strict`, and `--quiet` flags. It normalizes the folder path, verifies the directory exists, and then looks specifically for `checklist.md` at the folder root.

If `checklist.md` is missing, the script exits `0` and prints a Level 1-style advisory instead of failing hard. That means the workflow treats missing checklists as acceptable for lightweight specs, while still enforcing checklist structure whenever the file exists.

When a checklist is present, the parser scans Markdown headings and checkbox lines together. Priority can come from inline `[P0]`, `[P1]`, or `[P2]` tags on the item itself, or it can be inherited from the most recent heading that starts with `P0`, `P1`, or `P2`. Untagged items remain blocking because the workflow treats missing priority context as a completion rule violation.

Completed P0 and P1 items must carry evidence. The workflow accepts multiple evidence markers, including `[EVIDENCE:]`, `| Evidence:`, `(verified)`, `(tested)`, `(confirmed)`, deferred markers, or visible checkmark glyphs. If a P0 or P1 item is checked without evidence, the final status becomes `EVIDENCE_MISSING`.

Status calculation follows a fixed priority order:

1. `P0_INCOMPLETE`
2. `P1_INCOMPLETE`
3. `P2_INCOMPLETE` when `--strict` is enabled
4. `PRIORITY_CONTEXT_MISSING`
5. `EVIDENCE_MISSING`
6. `COMPLETE`

The human-readable mode prints a colored summary with a per-priority breakdown, blocking reasons, and a final "READY FOR COMPLETION" or "BLOCKED" result. JSON mode emits totals, percentages, per-priority counts, and quality-gate fields for missing priority context and missing evidence. Quiet mode suppresses the report and preserves exit-code-only usage for automation.

Exit behavior is intentionally narrow: `0` means completion is allowed, `1` means the checklist exists but the gate failed, and `2` means argument or path errors such as an unknown option or missing spec folder.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh` | Script | Parses `checklist.md`, derives priority state, enforces evidence rules, and returns human-readable or JSON completion status |

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Completion Verification Workflow
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct implementation audit
