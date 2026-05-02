---
title: "Analytics: Session Replay Store"
description: "Reader-owned analytics storage for replaying Claude transcript metadata into session and turn tables."
trigger_phrases:
  - "session analytics"
  - "analytics db"
---

# Analytics: Session Replay Store

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

---

## 1. OVERVIEW

`lib/analytics/` owns the normalized session analytics store. It replays Claude transcript turns and hook state into queryable SQLite tables for sessions, turns, model pricing and cache tiers.

Current state:

- The database file is `speckit-session-analytics.db` under the shared database directory.
- Transcript parsing stays in `hooks/claude/claude-transcript.ts`.
- Analytics persistence stays separate from the memory index and coverage graph store.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         lib/analytics/                           │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────────────────┐      ┌────────────────────────────┐
│ Claude hook state          │ ───▶ │ session-analytics-db.ts    │
│ Transcript file path       │      │ replay and normalization   │
└──────────────┬─────────────┘      └──────────────┬─────────────┘
               │                                   ▼
               │                    ┌────────────────────────────┐
               └──────────────────▶ │ speckit-session-analytics │
                                    │ .db                        │
                                    └────────────────────────────┘

Dependency direction: hooks/claude inputs ───▶ lib/analytics ───▶ core config and SQLite
```

---

## 3. PACKAGE TOPOLOGY

```text
lib/analytics/
+-- README.md
`-- session-analytics-db.ts  # Schema, replay, pricing and query helpers
```

Allowed direction:

- Analytics may import Claude transcript parsing and hook-state types.
- Analytics may import `DATABASE_DIR` from core config.
- Hook code and reporting code may call analytics helpers, but analytics must not own hook dispatch.

---

## 4. DIRECTORY TREE

```text
analytics/
+-- README.md
`-- session-analytics-db.ts
```

---

## 5. KEY FILES

| File | Role |
|---|---|
| `session-analytics-db.ts` | Defines analytics schema, seeds pricing rows, replays transcript turns and exposes session or turn query helpers. |

---

## 6. BOUNDARIES AND FLOW

Library boundary:

- Owns analytics tables and replay idempotency.
- Does not write the primary memory index.
- Does not parse raw transcript format directly outside the Claude transcript parser.
- Does not decide hook lifecycle behavior.

Replay flow:

```text
╭────────────────────────────╮
│ Stop-hook metadata         │
╰──────────────┬─────────────╯
               ▼
┌────────────────────────────┐
│ Transcript path and state  │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ parseTranscriptTurns       │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Normalize costs and tokens │
└──────────────┬─────────────┘
               ▼
╭────────────────────────────╮
│ Session and turn rows      │
╰────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Export | Purpose |
|---|---|
| `SESSION_ANALYTICS_DB_FILENAME` | Stable SQLite filename for the analytics store. |
| `SessionAnalyticsSessionRow` | Row contract for aggregated session data. |
| `SessionAnalyticsTurnRow` | Row contract for normalized transcript turns. |
| `SessionAnalyticsModelPricingRow` | Row contract for seeded model pricing. |

---

## 8. VALIDATION

Run from the repository root after README edits:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/analytics/README.md
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/mcp_server/lib/analytics/README.md
```

Expected result: `validate_document.py` exits `0` and `extract_structure.py` reports README structure without critical issues.

---

## 9. RELATED

- `../session/README.md`
- `../../hooks/claude/README.md`
