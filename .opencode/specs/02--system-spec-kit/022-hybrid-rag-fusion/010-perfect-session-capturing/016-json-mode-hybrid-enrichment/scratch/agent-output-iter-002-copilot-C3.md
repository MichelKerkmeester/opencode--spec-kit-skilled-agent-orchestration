# Iteration 002 — C3 Integration Verifier: Session Field Pipeline Trace

## Field Pipeline Matrix

| SessionMetadata Field | Survives Normalization? | Enrichment | collectSessionData Consumer | SessionData Key | Template | Gap? |
|---|---|---|---|---|---|---|
| `status` | Structured path only | Preserved | Priority 1 in determineSessionStatus() | SESSION_STATUS | {{SESSION_STATUS}} | Lost on manual-normalized path |
| `completionPercent` | Structured path only | Preserved | Priority 1 in estimateCompletionPercent() if 0..100 | COMPLETION_PERCENT | {{COMPLETION_PERCENT}} | Lost on manual-normalized path |
| `duration` | Structured path only | Preserved | Non-empty overrides calculateSessionDuration() | DURATION → SESSION_DURATION | {{SESSION_DURATION}} | Lost on manual path |
| `messageCount` | Structured path only | Preserved | Positive overrides userPrompts.length for MESSAGE_COUNT only | MESSAGE_COUNT | {{MESSAGE_COUNT}} | Partial: status/percent heuristics still use userPrompts.length |
| `toolCount` | Structured path only | Preserved | Positive overrides summed toolCounts for TOOL_COUNT only | TOOL_COUNT | {{TOOL_COUNT}} | Partial: completion heuristics still use heuristic toolCounts |
| `blockers` | Structured path only | Preserved | Any string overrides BLOCKERS display | BLOCKERS | {{BLOCKERS}} | Display/status diverge: determineSessionStatus uses heuristic blockers |
| `lastAction` | Structured path only | Preserved | Non-empty overrides heuristic lastAction | LAST_ACTION | {{LAST_ACTION}} | Empty string falls back; manual path drops |
| `nextAction` | Structured path only | Preserved | Non-empty overrides NEXT_ACTION display only | NEXT_ACTION | {{NEXT_ACTION}} | Pending-task heuristics still use heuristic nextAction |
| `sessionId` | Structured path only | Preserved | Priority 1 for SOURCE_SESSION_ID | SOURCE_SESSION_ID | {{SOURCE_SESSION_ID}} | Does NOT affect visible SESSION_ID (always generated) |

## Key Findings

### Finding 1: Manual-normalized JSON payloads drop session/git blocks
- **Severity**: MEDIUM
- **Evidence**: normalizeInputData() structured path clones all fields; manual path rebuilds object field-by-field and does NOT copy session/git.
- **Risk**: JSON payloads with sessionSummary/keyDecisions/nextSteps but also session.status/git.headRef will lose the explicit metadata.

### Finding 2: session.messageCount/toolCount only partially override
- **Severity**: MEDIUM
- **Evidence**: MESSAGE_COUNT and TOOL_COUNT are overridden, but buildContinueSessionData passes userPrompts.length (not messageCount) to determineSessionStatus and estimateCompletionPercent.
- **Risk**: Status/percent heuristics disagree with displayed counts.

### Finding 3: session.blockers display diverges from status determination
- **Severity**: MEDIUM
- **Evidence**: BLOCKERS display uses session.blockers verbatim, but determineSessionStatus uses heuristic blockers from extractBlockers().
- **Risk**: BLOCKERS shows "None" while SESSION_STATUS shows "BLOCKED" (or vice versa).

### Finding 4: session.nextAction only overrides display, not pending-task extraction
- **Severity**: LOW
- **Evidence**: extractPendingTasks receives heuristic nextAction. session.nextAction only overrides NEXT_ACTION at line 961, after continue-session data is already built.
- **Risk**: PENDING_TASKS[0] may show stale heuristic action while NEXT_ACTION shows explicit override.

### Finding 5: session.sessionId drives SOURCE_SESSION_ID but not SESSION_ID
- **Severity**: LOW
- **Evidence**: SESSION_ID is always a new UUID from generateSessionId(). session.sessionId only populates the provenance field SOURCE_SESSION_ID.
- **Risk**: Expected for provenance tracking, but may confuse callers expecting identity propagation.

## Summary
- All 9 SessionMetadata fields are consumed somewhere
- Major gap: manual-normalized JSON path drops session/git entirely
- Several fields have "display-only" overrides that don't affect status/completion heuristics
