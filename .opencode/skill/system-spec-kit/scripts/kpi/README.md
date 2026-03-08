---
title: "KPI Scripts"
description: "Shell-based quality KPI reporter that scans memory files for placeholders, fallback content, AI contamination and missing trigger phrases."
trigger_phrases:
  - "quality kpi"
  - "memory quality rates"
  - "placeholder rate"
  - "contamination check"
---

# KPI Scripts

> Quality metrics reporter for spec-kit memory files.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. USAGE](#3--usage)
- [4. METRICS](#4--metrics)
- [5. RELATED DOCUMENTS](#5--related-documents)

<!-- /ANCHOR:table-of-contents -->
---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The `kpi/` directory contains shell scripts that compute quality health metrics across memory files in the specs tree. The primary script, `quality-kpi.sh`, walks all `.md` files inside `memory/` subdirectories and reports defect rates as JSON plus a one-line stderr summary.

The script uses an embedded Node.js inline program to perform file scanning, regex matching and rate computation. It exits `0` on success regardless of defect rates (the caller decides thresholds).

<!-- /ANCHOR:overview -->
---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

| File | Type | Description |
| --- | --- | --- |
| `quality-kpi.sh` | Bash + inline Node | Scans memory markdown files and outputs quality defect rates as JSON |

<!-- /ANCHOR:structure -->
---

## 3. USAGE
<!-- ANCHOR:usage -->

### Scan All Active Specs

```bash
.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh
```

### Scan a Specific Spec Folder

```bash
.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh "02--system-spec-kit/022-hybrid-rag-fusion"
```

The argument is a relative path under `.opencode/specs/`.

### Output

- **stdout** -- JSON object with timestamps, scope, file counts, rates and raw counts.
- **stderr** -- One-line summary: `KPI Summary: files=N, placeholder=N%, fallback=N%, contamination=N%, empty_trigger=N%`

<!-- /ANCHOR:usage -->
---

## 4. METRICS
<!-- ANCHOR:metrics -->

The script checks every memory markdown file for four defect classes:

| Metric | Detection Rule |
| --- | --- |
| Placeholder rate | Contains `[TBD]`, `[Not assessed]` or `[N/A]` |
| Fallback rate | Contains phrases like "No specific decisions were made" |
| Contamination rate | Contains AI chain-of-thought leaks such as "Let me analyze" or "I'll execute this step by step" |
| Empty trigger phrases rate | YAML frontmatter block has zero `trigger_phrases` entries |

Each rate is expressed as a percentage of total scanned files. Directories named `z_archive`, `.git` and `node_modules` are excluded from the scan.

<!-- /ANCHOR:metrics -->
---

## 5. RELATED DOCUMENTS
<!-- ANCHOR:related-documents -->

- `.opencode/skill/system-spec-kit/scripts/README.md` -- Parent scripts directory overview
- `.opencode/skill/system-spec-kit/scripts/memory/README.md` -- Memory pipeline CLIs
- `.opencode/skill/system-spec-kit/scripts/evals/README.md` -- Evaluation and audit scripts

<!-- /ANCHOR:related-documents -->
