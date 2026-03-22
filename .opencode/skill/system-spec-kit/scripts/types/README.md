---
title: "Types"
description: "Shared session type definitions used across the Spec Kit scripts pipeline."
trigger_phrases:
  - "session types"
  - "type definitions"
  - "session data interface"
---

# Types

> Shared session type definitions used across the Spec Kit scripts pipeline.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. TYPE ARCHITECTURE](#3--type-architecture)
- [4. INTERFACES](#4--interfaces)
- [5. ROOT TYPE: SESSIONDATA](#5--root-type-sessiondata)
- [6. MIGRATION NOTES](#6--migration-notes)
- [7. RELATED](#7--related)

---

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

**Shared session type definitions** used across the Spec Kit scripts pipeline. This module is the **canonical source of truth** for all session-related types, eliminating parallel type hierarchies that previously existed between `simulation-factory` and the extractors (resolves **TECH-DEBT P6-05**).

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:structure -->
## 2. STRUCTURE

```
types/
└── session-types.ts    # Canonical session interfaces across 4 sections
```

**Imports from:**
- `../extractors/file-extractor` for `FileChange`, `ObservationDetailed`
- `../extractors/session-extractor` for `ToolCounts`, `SpecFileEntry`

---

<!-- /ANCHOR:structure -->

<!-- ANCHOR:type-architecture -->
## 3. TYPE ARCHITECTURE

```
SessionData (root)
├── FileChange[]              ← from file-extractor
├── ObservationDetailed[]     ← from file-extractor
├── OutcomeEntry[]
├── SpecFileEntry[]           ← from session-extractor
├── ToolCounts                ← from session-extractor
└── FILE_PROGRESS[]

DecisionData
├── DecisionRecord[]
│   └── DecisionOption[]

ConversationData
├── ConversationMessage[]
│   └── ToolCallEntry[]
└── ConversationPhase[]

DiagramData
├── DiagramOutput[]
├── AutoDecisionTree[]
├── DiagramTypeCount[]
└── PatternSummaryEntry[]
```

---

<!-- /ANCHOR:type-architecture -->

<!-- ANCHOR:interfaces -->
## 4. INTERFACES

### Section 1: Decision Types

| Interface | Fields | Purpose |
|-----------|--------|---------|
| `DecisionOption` | `OPTION_NUMBER`, `LABEL`, `DESCRIPTION`, `PROS`, `CONS` | Single option within a decision |
| `DecisionRecord` | `TITLE`, `CONTEXT`, `CHOSEN`, `RATIONALE`, `CONFIDENCE`, `EVIDENCE`, `CAVEATS`, `FOLLOWUP` + 18 total | Complete decision with rationale, evidence and follow-up items |
| `DecisionData` | `DECISIONS`, `DECISION_COUNT`, confidence breakdowns | Aggregate container with confidence-level counts |

### Section 2: Phase / Conversation Types

| Interface | Fields | Purpose |
|-----------|--------|---------|
| `PhaseEntry` | `PHASE_NAME`, `DURATION`, `ACTIVITIES?` | Shared by diagram + conversation extractors |
| `ToolCallEntry` | `TOOL_NAME`, `DESCRIPTION`, `RESULT_PREVIEW` | Tool invocation within a message |
| `ConversationMessage` | `TIMESTAMP`, `ROLE`, `CONTENT`, `TOOL_CALLS` | Single user or assistant message |
| `ConversationPhase` | `PHASE_NAME`, `DURATION` | Named phase within a conversation |
| `ConversationData` | `MESSAGES`, `PHASES`, `DURATION`, `FLOW_PATTERN`, `TOOL_COUNT` | Full conversation structure |

### Section 3: Diagram Types

| Interface | Fields | Purpose |
|-----------|--------|---------|
| `DiagramOutput` | `TITLE`, `DIAGRAM_TYPE`, `PATTERN_NAME`, `ASCII_ART`, `RELATED_FILES` | Single diagram with ASCII art content |
| `AutoDecisionTree` | `INDEX`, `DECISION_TITLE`, `DECISION_TREE` | Auto-generated decision tree visualization |
| `DiagramTypeCount` | `TYPE`, `COUNT` | Diagram type frequency |
| `PatternSummaryEntry` | `PATTERN_NAME`, `COUNT` | Pattern usage summary |
| `DiagramData` | `DIAGRAMS`, `AUTO_DECISION_TREES`, `DIAGRAM_TYPES`, `PATTERN_SUMMARY` | Aggregate diagram container |

### Section 4: Session Types

| Interface | Fields | Purpose |
|-----------|--------|---------|
| `OutcomeEntry` | `OUTCOME`, `TYPE?` | Single session outcome |
| `SessionData` | 35+ fields | **Root type**: complete AI coding session context |

---

<!-- /ANCHOR:interfaces -->

<!-- ANCHOR:session-data -->
## 5. ROOT TYPE: SESSIONDATA

`SessionData` is the top-level type representing a complete session. Key field groups:

| Group | Fields |
|-------|--------|
| **Identity** | `TITLE`, `SESSION_ID`, `CHANNEL`, `SPEC_FOLDER` |
| **Timing** | `DATE`, `TIME`, `DURATION`, `CREATED_AT_EPOCH`, `LAST_ACCESSED_EPOCH`, `EXPIRES_AT_EPOCH` |
| **Content** | `SUMMARY`, `QUICK_SUMMARY`, `FILES`, `OUTCOMES`, `OBSERVATIONS`, `SPEC_FILES` |
| **Metrics** | `FILE_COUNT`, `TOOL_COUNT`, `MESSAGE_COUNT`, `DECISION_COUNT`, `ACCESS_COUNT`, `TOOL_COUNTS` |
| **Memory** | `IMPORTANCE_TIER`, `CONTEXT_TYPE`, `RELEVANCE_BOOST`, `LAST_SEARCH_QUERY` |
| **State** | `PROJECT_PHASE`, `ACTIVE_FILE`, `LAST_ACTION`, `NEXT_ACTION`, `BLOCKERS`, `FILE_PROGRESS` |

---

<!-- /ANCHOR:session-data -->

<!-- ANCHOR:migration -->
## 6. MIGRATION NOTES

This module was created to resolve **TECH-DEBT P6-05**, where `simulation-factory` and the extractors each maintained their own copies of the same interfaces. All consumers now import from this single canonical source.

**Before:** Types duplicated in `simulation-factory.ts` and extractor modules.
**After:** Single source in `types/session-types.ts`, imported by all consumers.

---

<!-- /ANCHOR:migration -->

<!-- ANCHOR:related -->
## 7. RELATED

| Resource | Path |
|----------|------|
| File extractor (provides `FileChange`, `ObservationDetailed`) | `../extractors/file-extractor.ts` |
| Session extractor (provides `ToolCounts`, `SpecFileEntry`) | `../extractors/session-extractor.ts` |
| Simulation factory (primary consumer) | `../lib/simulation-factory.ts` |
| Scripts README | `../README.md` |

<!-- /ANCHOR:related -->
