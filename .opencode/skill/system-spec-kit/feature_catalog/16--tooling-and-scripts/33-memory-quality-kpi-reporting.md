---
title: "Memory Quality KPI Reporting"
description: "Shell-based KPI reporting that scans saved memory markdown for placeholder, fallback, contamination, and empty-trigger defects and emits JSON plus an operator summary."
---

# Memory Quality KPI Reporting

This document captures the implemented behavior, source references, and remediation metadata for the memory-quality KPI reporting script surface.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

`scripts/kpi/quality-kpi.sh` is the operator-facing quality reporter for saved memory files. It walks markdown files under `memory/` directories in the active specs tree, computes defect rates for four quality signals, prints a structured JSON payload to `stdout`, and emits a compact one-line summary to `stderr` for quick inspection in terminal workflows.

Although the entry point is Bash, the scan and aggregation logic is implemented through an embedded Node.js program. That split keeps invocation simple while allowing recursive filesystem traversal, YAML-block inspection, regex-based defect detection, and percentage calculation without depending on external shell utilities for parsing.

## 2. CURRENT REALITY

The shipped KPI reporting behavior is:

1. Invocation is `scripts/kpi/quality-kpi.sh [spec-folder]`. With no argument, the script scans all active specs under `.opencode/specs`; with an argument, it scopes the walk to that relative spec-folder path below the same root.
2. The script resolves its own repository root from the script location, then passes the root plus the optional spec-folder argument into an inline Node.js process instead of delegating to a separate `.js` file.
3. Recursive scanning only collects markdown files whose paths include a `memory/` path segment. Directories named `z_archive`, `.git`, and `node_modules` are explicitly skipped during traversal.
4. The reporter tracks four defect classes across the scanned files: placeholder markers (`[TBD]`, `[Not assessed]`, `[N/A]`), fallback narratives such as "No specific decisions were made", AI-process contamination phrases like "Let me analyze" or "I'll now", and files whose fenced YAML metadata block contains zero `trigger_phrases` list entries.
5. Trigger-phrase detection is intentionally narrow. The script looks for a fenced ```yaml block, locates a `trigger_phrases:` section inside that block, counts only dash-prefixed list items, and treats missing or empty sections as zero triggers.
6. Output includes both counts and normalized rates. The JSON payload contains `generatedAt`, `scope`, `totalFiles`, a `rates` object with percentage values rounded to two decimals, and a `counts` object that preserves raw totals for each defect class.
7. The CLI always exits `0` on successful execution even when defect rates are non-zero. In other words, it is a reporting surface rather than an enforcing quality gate; downstream callers must decide whether any reported rate should fail CI or trigger remediation.
8. The human-readable terminal summary is written to `stderr` in the form `KPI Summary: files=..., placeholder=...%, fallback=...%, contamination=...%, empty_trigger=...%`, which makes it suitable for shell pipelines that want clean JSON on `stdout` but still need a quick operator-facing status line.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh` | CLI + reporting runtime | Scans memory markdown, detects quality defects, computes percentage rates, and prints JSON plus summary output |
| `.opencode/skill/system-spec-kit/scripts/kpi/README.md` | Documentation | Declares the KPI script contract, usage examples, metric definitions, and output format |

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Memory Quality KPI Reporting
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct implementation audit of the KPI script and its README contract
