# Files Touched: SpecKit Upgrade v1.0.7.0-v1.0.9.1

> **Spec:** 077-speckit-upgrade-from-research
> **Implementation Date:** 2026-01-23
> **Purpose:** Epistemic awareness enhancements (uncertainty tracking, dual-threshold validation, Five Checks, MCP learning tools)

---

## Summary

| Metric | Count |
|--------|-------|
| **Files Modified** | 17 |
| **Files Created** | 9 |
| **Lines Changed** | ~1550 |
| **Tasks Completed** | 15/15 + Phase 5 docs |
| **Code Reviews** | 2 (Phase 1-3: 84/100, Phase 4: 72/100 → fixed) |
| **Phases** | 5 (Implementation + Docs Alignment) |

---

## Implementation Files Modified

### 1. AGENTS.md

**Path:** `AGENTS.md` (project root)
**Feature:** Core epistemic framework - uncertainty tracking, dual-threshold validation, Five Checks, structured gate format

**Sections Modified:**
| Section | Type | Changes |
|---------|------|---------|
| Section 2 (Gates) | Add | Gate 2 dual-threshold validation formula |
| Section 2 (Gates) | Add | Structured Gate Decision Format |
| Section 4 (Confidence) | Add | Uncertainty Tracking subsection (4-factor weighted table) |
| Section 4 (Confidence) | Add | Dual-Threshold Validation subsection |
| Section 5 (Solution) | Add | Five Checks Framework for significant decisions |

**Lines Added:** ~180

**Key Additions:**
- Uncertainty Tracking with thresholds: ≤0.35 (LOW), 0.36-0.60 (MEDIUM), >0.60 (HIGH)
- READINESS formula: `(confidence >= 0.70) AND (uncertainty <= 0.35)`
- Five Checks: Necessary?, Beyond Local Maxima?, Sufficient?, Fits Goal?, Open Horizons?
- Structured gate format: GATE/DECISION/CONFIDENCE/UNCERTAINTY/EVIDENCE

---

### 2. skill_advisor.py

**Path:** `.opencode/scripts/skill_advisor.py`
**Feature:** Dual-threshold skill routing - uncertainty calculation and combined confidence+uncertainty validation

**Functions Added:**
| Function | Lines | Purpose |
|----------|-------|---------|
| `calculate_uncertainty()` | ~45 | Calculate uncertainty score from matches, intent boost, ambiguity |
| `passes_dual_threshold()` | ~20 | Check if confidence AND uncertainty pass thresholds |

**Functions Modified:**
| Function | Changes |
|----------|---------|
| `analyze_request()` | Added uncertainty calculation and passes_threshold to output |
| CLI parser | Added `--uncertainty` and `--show-rejections` flags |
| Result filtering | Added uncertainty threshold filtering |

**Lines Added:** ~120

**Output Changes:**
```json
{
  "skill": "system-spec-kit",
  "confidence": 0.95,
  "uncertainty": 0.15,        // NEW
  "passes_threshold": true,   // NEW
  "reason": "Matched: ..."
}
```

---

### 3. resume.md

**Path:** `.opencode/command/spec_kit/resume.md`
**Feature:** Enhanced resume detection - 4-tier semantic priority using memory search with decay scoring

**Section Modified:** Session Detection Priority (Section 6)

**Changes:**
| Before | After |
|--------|-------|
| 2-tier priority (CLI, glob) | 4-tier semantic priority |

**New Priority Order:**
1. CLI argument (explicit path)
2. `memory_search()` with decay scoring
3. `memory_match_triggers()` for phrase matching
4. Fallback: Glob by modification time

**Lines Added:** ~45

---

### 4. context_template.md

**Path:** `.opencode/skill/system-spec-kit/templates/context_template.md`
**Feature:** Learning measurement templates - PREFLIGHT baseline capture and POSTFLIGHT delta calculation with ANCHOR tags

**Sections Added:**
| Section | Location | Purpose |
|---------|----------|---------|
| PREFLIGHT BASELINE | After metadata | Capture epistemic state at session start |
| POSTFLIGHT LEARNING DELTA | Before memory metadata | Calculate learning delta at session end |

**Key Features:**
- ANCHOR tags for semantic search: `<!-- ANCHOR_EXAMPLE:preflight-{{SESSION_ID}}-{{SPEC_FOLDER}} -->`
- Knowledge/Uncertainty/Context score tracking
- Learning Index formula: `(Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)`
- Gaps Closed / New Gaps Discovered tracking
- Delta calculation formulas documented in HTML comments

**Lines Added:** ~50

---

### 5. decision-record.md (Level 3)

**Path:** `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md`
**Feature:** Five Checks framework integration - structured evaluation table for significant architectural decisions

**Section Added:** Five Checks Evaluation (after Alternatives Considered)

**Changes:**
```markdown
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | [PASS/FAIL] | [evidence] |
| 2 | **Beyond Local Maxima?** | [PASS/FAIL] | [evidence] |
| 3 | **Sufficient?** | [PASS/FAIL] | [evidence] |
| 4 | **Fits Goal?** | [PASS/FAIL] | [evidence] |
| 5 | **Open Horizons?** | [PASS/FAIL] | [evidence] |
```

**Lines Added:** ~15

---

### 6. decision-record.md (Level 3+)

**Path:** `.opencode/skill/system-spec-kit/templates/level_3+/decision-record.md`
**Feature:** Enhanced decision journaling - Five Checks + Session Decision Log for audit trail

**Sections Added:**
| Section | Purpose |
|---------|---------|
| Five Checks Evaluation | Same as Level 3 |
| Session Decision Log | Audit trail for gate decisions |

**Session Decision Log Format:**
```markdown
| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
```

**Lines Added:** ~25

---

## Files Created

### 1. implementation-summary.md

**Path:** `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/implementation-summary.md`
**Feature:** Spec documentation - implementation details, verification results, code review outcomes

**Purpose:** Document implementation details, verification results, and code review outcomes

**Contents:**
- Implementation overview and file summary
- Key implementation details with code snippets
- Verification test results
- Code review results (84/100 GOOD, APPROVED)
- P1/P2 issues addressed
- Pending items list

---

### 2. session-learning.js (MCP Handler)

**Path:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.js`
**Feature:** MCP learning tools - task_preflight(), task_postflight(), memory_get_learning_history() with Learning Index calculation

**Purpose:** MCP tool handlers for learning measurement

**Functions:**
| Function | Lines | Purpose |
|----------|-------|---------|
| `handle_task_preflight()` | ~120 | Capture epistemic baseline before task |
| `handle_task_postflight()` | ~190 | Capture final state, calculate deltas, **+interpretation** |
| `handle_get_learning_history()` | ~200 | Query learning history with summary stats |

**Code Review Enhancement:** Added interpretation field to `task_postflight` response for immediate user feedback (P2 suggestion implemented)

**Database Schema Created:**
```sql
CREATE TABLE IF NOT EXISTS session_learning (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  spec_folder TEXT NOT NULL,
  task_id TEXT NOT NULL,
  phase TEXT NOT NULL CHECK(phase IN ('preflight', 'complete')),
  session_id TEXT,
  -- Preflight scores (baseline)
  pre_knowledge_score INTEGER,
  pre_uncertainty_score INTEGER,
  pre_context_score INTEGER,
  knowledge_gaps TEXT,
  -- Postflight scores (final)
  post_knowledge_score INTEGER,
  post_uncertainty_score INTEGER,
  post_context_score INTEGER,
  -- Calculated deltas
  delta_knowledge REAL,
  delta_uncertainty REAL,
  delta_context REAL,
  learning_index REAL,
  -- Gap tracking
  gaps_closed TEXT,
  new_gaps_discovered TEXT,
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT,
  UNIQUE(spec_folder, task_id)
);
```

---

### 3. epistemic-vectors.md (Reference Doc)

**Path:** `.opencode/skill/system-spec-kit/references/memory/epistemic-vectors.md`
**Feature:** Uncertainty tracking reference - 4-factor assessment, thresholds, "confident ignorance" anti-pattern

**Purpose:** Document the Uncertainty Tracking framework

**Sections:**
- The Four Uncertainty Factors with weights
- Threshold interpretation (LOW/MEDIUM/HIGH)
- "Confident Ignorance" anti-pattern
- Practical assessment guide
- Integration with gates

**Lines:** ~400

---

### 4. five-checks.md (Reference Doc)

**Path:** `.opencode/skill/system-spec-kit/references/validation/five-checks.md`
**Feature:** Five Checks reference - evaluation criteria for >100 LOC or architectural decisions

**Purpose:** Document the Five Checks evaluation framework

**Sections:**
- When to apply (>100 LOC or architectural)
- The Five Checks with criteria
- Evaluation format and examples
- Integration with decision records

**Lines:** ~300

---

### 5. decision-format.md (Reference Doc)

**Path:** `.opencode/skill/system-spec-kit/references/templates/decision-format.md`
**Feature:** Gate decision format reference - GATE/DECISION/CONFIDENCE/UNCERTAINTY/EVIDENCE structure

**Purpose:** Document the Structured Gate Decision Format

**Sections:**
- Standard and compact formats
- Field definitions
- PASS and BLOCK examples
- Session Decision Log (Level 3+)
- Dual-threshold validation

**Lines:** ~350

---

## Additional Files Modified (Phase 4)

### 7. context-server.js

**Path:** `.opencode/skill/system-spec-kit/mcp_server/context-server.js`
**Feature:** MCP tool registration - task_preflight, task_postflight, memory_get_learning_history tools

**Changes:**
| Change | Lines |
|--------|-------|
| Import session-learning handlers | +1 |
| Tool definitions (task_preflight, task_postflight, memory_get_learning_history) | +3 |
| Switch case dispatch | +3 |

---

### 8. handlers/index.js

**Path:** `.opencode/skill/system-spec-kit/mcp_server/handlers/index.js`
**Feature:** Handler exports - session-learning module integration for learning tools

**Changes:**
- Added import for sessionLearning module
- Added exports for learning handlers

---

### 9. collect-session-data.js

**Path:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.js`
**Feature:** PREFLIGHT/POSTFLIGHT utilities - Learning Index calculation, delta extraction, trend indicators

**Functions Added:**
| Function | Purpose |
|----------|---------|
| `getScoreAssessment()` | Generate human-readable assessment text |
| `getTrendIndicator()` | Return trend arrows (↑/↓/→) |
| `calculateLearningIndex()` | Calculate Learning Index using formula |
| `extractPreflightPostflightData()` | Extract and process PREFLIGHT/POSTFLIGHT data |
| `generateLearningSummary()` | Create human-readable learning summary |

**Lines Added:** ~180

---

### 10. implement.md

**Path:** `.opencode/command/spec_kit/implement.md`
**Feature:** Implementation workflow hooks - Step 5.5 PREFLIGHT baseline, Step 7.5 POSTFLIGHT learning delta

**Changes:**
| Change | Section |
|--------|---------|
| Added Step 5.5: PREFLIGHT Capture | Section 10 |
| Added Step 7.5: POSTFLIGHT Learning Delta | Section 11 |
| Updated workflow table with new steps | Section 3 |
| Renumbered subsequent sections (12-17) | All |
| **Code Review Fix:** Learning Index thresholds (0-100 scale) | Section 11 |
| **Code Review Fix:** Reference path corrected | Section 11 |
| **Code Review Fix:** Parameter names to camelCase | Sections 10-11 |

**Lines Added:** ~200 (+15 for code review fixes)

---

## Spec Folder Files Updated

| File | Updates |
|------|---------|
| `tasks.md` | Marked all 15 tasks complete (9 original + 6 Phase 4), added Phase 4 section |
| `checklist.md` | Marked Phase 1-4 items complete with evidence |
| `implementation-summary.md` | Updated with Phase 4 review results and fixes |

---

## Code Review Fixes

### Phase 1-3 Review (84/100 GOOD)

| File | Issue | Fix |
|------|-------|-----|
| `skill_advisor.py` | `uncert_threshold` default was 0.5 | Changed to 0.35 |
| `skill_advisor.py` | Missing threshold documentation | Added docstring explaining 0.8 vs 0.7 |
| `context_template.md` | Missing delta calculation docs | Added HTML comment with formulas |
| `skill_advisor.py` | Missing worked examples | Added to `calculate_uncertainty()` docstring |

### Phase 4 Review (72/100 → Fixed)

| File | Issue | Priority | Fix |
|------|-------|----------|-----|
| `implement.md` | Learning Index thresholds used 0.0-1.0 scale | P0 | Changed to 0-100 scale (40+, 15-40, 5-15, <5) |
| `implement.md` | Reference path incorrect | P1 | Fixed to `epistemic/epistemic-vectors.md` |
| `implement.md` | PREFLIGHT params used snake_case | P1 | Changed to camelCase (specFolder, taskId, etc.) |
| `implement.md` | POSTFLIGHT params inconsistent | P1 | Fixed `gaps_discovered` → `newGapsDiscovered` |
| `session-learning.js` | No interpretation in postflight response | P2 | Added interpretation field with feedback text |

---

## Verification Results

```bash
$ python3 skill_advisor.py --health
{"status": "ok", "skills_found": 8}

$ python3 skill_advisor.py "spec folder creation" --threshold 0.0
[{"skill": "system-spec-kit", "confidence": 0.95, "uncertainty": 0.15, "passes_threshold": true, ...}]
```

---

## Files NOT Modified (Out of Scope)

| File | Reason |
|------|--------|
| `.spec-state.json` | State file approach moved to out-of-scope |
| `status.js` / `status.md` | Dashboard command moved to out-of-scope |
| `SKILL.md` | No new user-invocable commands added |

**Note:** `collect-session-data.js` was modified instead of creating a separate `preflight-postflight-extractor.js` - this follows the existing codebase patterns for session data collection.

---

## Phase 5: Documentation Alignment (2026-01-23 Session 2)

### Reference Documents Created/Updated

| File | Path | Type | Changes |
|------|------|------|---------|
| `sub_folder_versioning.md` | `.opencode/skill/system-spec-kit/references/structure/` | Created | Sub-folder versioning rules (001-xxx, 002-xxx pattern) |
| `folder_routing.md` | `.opencode/skill/system-spec-kit/references/structure/` | Created | Folder selection decision tree |
| `execution_methods.md` | `.opencode/skill/system-spec-kit/references/workflows/` | Created | Execution method reference (skill tool, /spec_kit, explicit load) |
| `environment_variables.md` | `.opencode/skill/system-spec-kit/references/config/` | Created | Environment variable documentation |

### Template Updates

| File | Path | Changes |
|------|------|---------|
| `tasks.md` | `.opencode/skill/system-spec-kit/templates/level_3+/` | Updated | Added UNCERTAINTY_THRESHOLD variable documentation |

### Constitutional Updates

| File | Path | Changes |
|------|------|---------|
| `gate-enforcement.md` | `.opencode/skill/system-spec-kit/constitutional/` | Updated | Added dual-threshold validation rules |

### Handler Documentation

| File | Path | Changes |
|------|------|---------|
| `README.md` | `.opencode/skill/system-spec-kit/mcp_server/handlers/` | Updated | Documented session-learning.js handler |

### External Repository Syncs

| Repository | File | Sync Status |
|------------|------|-------------|
| Barter repo | `skill_advisor.py` | Synced with uncertainty calculation |
| Public repo | `skill_advisor.py` | Synced with uncertainty calculation |

---

## Summary Statistics (Final)

| Metric | Phase 1-4 | Phase 5 | Total |
|--------|-----------|---------|-------|
| **Files Modified** | 11 | 6 | 17 |
| **Files Created** | 5 | 4 | 9 |
| **Lines Changed** | ~1100 | ~450 | ~1550 |
| **Reference Docs** | 3 | 4 | 7 |
| **Template Updates** | 3 | 1 | 4 |
| **External Syncs** | 0 | 2 | 2 |

---

*Document updated: 2026-01-23 (Phase 5 documentation alignment complete)*
