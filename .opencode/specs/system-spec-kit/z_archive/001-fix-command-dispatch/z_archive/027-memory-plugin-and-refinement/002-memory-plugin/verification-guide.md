# Verification Guide: Memory Plugin Checklist

Complete verification steps for each checklist item in the Memory Plugin implementation.

---

## P0 Critical (8 items)

### CHK-001: Hook File Exists

**Verification Command:**
```bash
ls -la .opencode/hooks/*.py
```

**Expected Output:**
```
session_start.py
user_prompt_submit.py      # CHK-003: replaces user_prompt_capture.py  
post_tool_use.py
stop.py
pre_compact.py
utils/session_context.py
utils/common.py
```

**Pass/Fail Criteria:**
- ✅ PASS: All 5 core hook files exist + utils/ directory with support modules
- ❌ FAIL: Any required hook file is missing

**Common Failure Modes:**
- Missing `utils/` directory (copy from template)
- Hook file exists but has syntax errors (run `python -m py_compile <file>`)
- Wrong file permissions (should be executable: `chmod +x *.py`)

---

### CHK-002: SessionStart Initializes Context

**Verification Command:**
```bash
# Check that SessionContext is created on session start
cat .opencode/sessions/*.json 2>/dev/null | head -20

# Or simulate with:
echo '{"session_id": "test-123", "source": "startup"}' | python .opencode/hooks/session_start.py
```

**Expected Output:**
Session context file created at `.opencode/sessions/session_<id>.json` containing:
```json
{
  "session_id": "test-123",
  "source": "startup",
  "started_at": "2025-...",
  "spec_folder": "...",
  "spec_folder_source": "explicit|recent|null",
  "files_accessed": [],
  "files_modified": [],
  "tool_calls": 0,
  "last_activity": null
}
```

**Pass/Fail Criteria:**
- ✅ PASS: Session context JSON created with all required fields
- ✅ PASS: Exit code 0 (success, non-blocking)
- ❌ FAIL: No session file created
- ❌ FAIL: Missing required fields in session context

**Common Failure Modes:**
- `.opencode/sessions/` directory doesn't exist
- Permission denied writing to sessions directory
- JSON serialization error in SessionContext.to_dict()

---

### CHK-003: UserPromptSubmit Captures Prompts

**Verification Command:**
```bash
# Check log file for prompt entries
cat .opencode/logs/user_prompt_submit_*.log 2>/dev/null | tail -20

# Or simulate:
echo '{"prompt": "test prompt", "session_id": "test-123"}' | python .opencode/hooks/user_prompt_submit.py
```

**Expected Output:**
Log entry in `.opencode/logs/user_prompt_submit_<date>.log`:
```json
{
  "session_id": "test-123",
  "prompt": "test prompt",
  "prompt_length": 11,
  "validation_passed": true,
  "context_usage_percent": 0.0,
  "timestamp": "..."
}
```

**Pass/Fail Criteria:**
- ✅ PASS: Prompt logged with metadata (session_id, length, validation status)
- ✅ PASS: Context usage estimated and logged
- ✅ PASS: Exit code 0 (non-blocking)
- ❌ FAIL: No log entry created
- ❌ FAIL: Exit code 2 (incorrectly blocking prompts)

**Common Failure Modes:**
- Logs directory doesn't exist
- `read_stdin_json()` failing to parse input
- Context usage estimation returning NaN

---

### CHK-004: PostToolUse Captures Tool Usage

**Verification Command:**
```bash
# Check log file for tool entries
cat .opencode/logs/post_tool_use_*.log 2>/dev/null | tail -20

# Simulate Write tool:
echo '{"tool_name": "Write", "tool_input": {"filePath": "/test/file.js"}, "tool_response": {"success": true}, "session_id": "test-123"}' | python .opencode/hooks/post_tool_use.py
```

**Expected Output:**
1. Log entry in `.opencode/logs/post_tool_use_<date>.log`:
```json
{
  "session_id": "test-123",
  "tool_name": "Write",
  "success": true,
  "duration_ms": null,
  "has_errors": false
}
```

2. Session context updated in `.opencode/sessions/session_test-123.json`:
```json
{
  "tools": [
    {
      "timestamp": "...",
      "tool": "Write",
      "file_path": "/test/file.js",
      "summary": "Created /test/file.js",
      "success": true
    }
  ],
  "files_modified": ["/test/file.js"]
}
```

**Pass/Fail Criteria:**
- ✅ PASS: Significant tools (Write, Edit, Bash, Task) tracked in session context
- ✅ PASS: files_modified set updated for Write/Edit tools
- ✅ PASS: Tool statistics updated in `tool_statistics.json`
- ❌ FAIL: Session context not updated with tool record
- ❌ FAIL: Non-significant tools incorrectly tracked

**Common Failure Modes:**
- Session file doesn't exist (session_start not called)
- Tool name not in SIGNIFICANT_TOOLS set
- SessionContext import failing

---

### CHK-005: Stop Triggers Memory Save

**Verification Command:**
```bash
# Check stop hook logs
cat .opencode/logs/stop_*.log 2>/dev/null | tail -10

# Simulate stop:
echo '{"session_id": "test-123", "stop_reason": "end_turn", "stop_hook_active": false}' | python .opencode/hooks/stop.py
```

**Expected Output:**
```json
{
  "session_id": "test-123",
  "stop_reason": "end_turn",
  "stop_hook_active": false,
  "todos_status": "skipped (enforcement disabled)",
  "tests_status": "skipped (enforcement disabled)",
  "blocked": false,
  "shutdown_type": "graceful"
}
```

**Pass/Fail Criteria:**
- ✅ PASS: Graceful shutdown logged with session summary
- ✅ PASS: Exit code 0 (allows stop)
- ✅ PASS: No infinite loop (stop_hook_active check works)
- ⚠️ OPTIONAL: Memory save triggered via generate-context.js (when enabled)
- ❌ FAIL: Exit code 2 when it should allow stop
- ❌ FAIL: Infinite loop (stop_hook_active not respected)

**Common Failure Modes:**
- `stop_hook_active` check bypassed causing infinite loop
- Exit code 2 returned incorrectly
- Environment variable checks failing

---

### CHK-006: PreCompact Triggers Emergency Save

**Verification Command:**
```bash
# Check pre_compact logs
cat .opencode/logs/pre_compact_*.log 2>/dev/null | tail -20

# Check snapshot directory
ls -la .opencode/compaction_snapshots/

# Simulate:
echo '{"session_id": "test-123", "reason": "token_limit", "context_summary": "Test context", "tokens_before": 180000, "tokens_after": 50000, "messages_removed": 15}' | python .opencode/hooks/pre_compact.py
```

**Expected Output:**
1. Log entry with metrics:
```json
{
  "session_id": "test-123",
  "reason": "token_limit",
  "tokens_before": 180000,
  "tokens_after": 50000,
  "tokens_removed": 130000,
  "compression_ratio": 0.2778,
  "messages_removed": 15
}
```

2. Snapshot file created:
```
.opencode/compaction_snapshots/snapshot_test-123_<timestamp>.md
```

**Pass/Fail Criteria:**
- ✅ PASS: Compaction metrics logged
- ✅ PASS: Context snapshot saved to compaction_snapshots/
- ✅ PASS: Exit code 0 (NEVER blocks compaction)
- ✅ PASS: Old snapshots cleaned up (MAX_SNAPSHOT_AGE_DAYS)
- ❌ FAIL: Exit code != 0 (would block compaction)
- ❌ FAIL: Snapshot not saved when context_summary provided

**Common Failure Modes:**
- Snapshot directory creation failed
- Context summary empty (no snapshot created)
- Disk full (snapshot write fails)

---

### CHK-007: Integration with generate-context.js

**Verification Command:**
```bash
# Check script exists
ls -la .opencode/skills/system-memory/scripts/generate-context.js

# Check syntax
node --check .opencode/skills/system-memory/scripts/generate-context.js

# Dry run with test data
echo '{"specFolder": "005-memory/015-memory-plugin-and-refinement", "sessionSummary": "Test session", "keyDecisions": [], "filesModified": [], "triggerPhrases": ["test"]}' > /tmp/test-context.json
node .opencode/skills/system-memory/scripts/generate-context.js /tmp/test-context.json
```

**Expected Output:**
```
🚀 Starting memory skill...

📥 Step 1: Loading collected data...
   ✓ Loaded conversation data from file
   ✓ Transformed manual format to MCP-compatible structure
   ✓ Loaded data from data file

📁 Step 2: Detecting spec folder...
   ✓ Using: /path/to.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement

📂 Step 3: Setting up context directory...
   ✓ Created: /path/to/specs/.../memory

...

💾 Step 9: Writing files...
   ✓ <date>_<time>__memory-plugin-and-refinement.md (X lines)
   ✓ metadata.json (X lines)
```

**Pass/Fail Criteria:**
- ✅ PASS: Script executes without syntax errors
- ✅ PASS: Accepts JSON input file as argument
- ✅ PASS: Creates memory file in correct spec folder
- ✅ PASS: Memory file has ANCHOR format (see CHK-RC6)
- ❌ FAIL: Node.js syntax error
- ❌ FAIL: Script exits with non-zero code
- ❌ FAIL: Memory file in wrong location

**Common Failure Modes:**
- Missing dependencies (check lib/*.js files exist)
- spec folder path resolution incorrect
- Template file missing

---

### CHK-008: Fail-Open Behavior

**Verification Command:**
```bash
# Test each hook with invalid input (should NOT block)

# Session start with garbage
echo 'not-json' | python .opencode/hooks/session_start.py; echo "Exit: $?"

# User prompt with empty
echo '{}' | python .opencode/hooks/user_prompt_submit.py; echo "Exit: $?"

# Post tool with invalid
echo '{"tool_name": null}' | python .opencode/hooks/post_tool_use.py; echo "Exit: $?"

# Pre compact (must NEVER block)
echo '{}' | python .opencode/hooks/pre_compact.py; echo "Exit: $?"
```

**Expected Output:**
All hooks should exit with code 0 (success) even with invalid input:
```
Exit: 0
Exit: 0
Exit: 0
Exit: 0
```

**Pass/Fail Criteria:**
- ✅ PASS: All hooks exit 0 on invalid input
- ✅ PASS: Errors logged but operation continues
- ✅ PASS: pre_compact NEVER returns exit code 2
- ❌ FAIL: Any hook exits non-zero on error (except valid blocking)
- ❌ FAIL: Unhandled exception crashes hook

**Common Failure Modes:**
- Missing try/except around JSON parsing
- Exception in main() not caught
- exit_success() not called in error paths

---

## P0 Root Cause Fix (6 items)

### CHK-RC1: Memory File Has MULTIPLE Observations

**Verification Command:**
```bash
# Check generated memory file for observation anchors
grep -c "<!-- ANCHOR_EXAMPLE:" specs/*/memory/*.md 2>/dev/null | grep -v ":0"

# Look for multiple ANCHOR blocks
grep -E "<!-- ANCHOR_EXAMPLE:(OBS|DEC|IMPL)" specs/*/memory/*.md | head -20
```

**Expected Output:**
Memory files should contain 2+ ANCHOR blocks:
```markdown
<!-- ANCHOR_EXAMPLE:OBS-001_session-summary -->
## Session Summary
...narrative content...
<!-- /ANCHOR_EXAMPLE:OBS-001_session-summary -->

<!-- ANCHOR_EXAMPLE:DEC-001_approach-selection -->
## Decision: Approach Selection
...decision content...
<!-- /ANCHOR_EXAMPLE:DEC-001_approach-selection -->
```

**Pass/Fail Criteria:**
- ✅ PASS: Memory file contains 2+ distinct ANCHOR blocks
- ✅ PASS: Each ANCHOR has matching close tag
- ✅ PASS: Observations have unique IDs (OBS-001, OBS-002, etc.)
- ❌ FAIL: Only 1 or 0 ANCHOR blocks
- ❌ FAIL: Unclosed ANCHOR tags
- ❌ FAIL: Duplicate ANCHOR IDs

**Common Failure Modes:**
- generate-context.js observations array empty
- Template not iterating over observations
- Anchor generation disabled

---

### CHK-RC2: keyDecisions Array Populated

**Verification Command:**
```bash
# Check metadata.json for decision count
cat specs/*/memory/metadata.json 2>/dev/null | grep -i decision

# Check memory file for decision sections
grep -E "## Decision:|<!-- ANCHOR_EXAMPLE:DEC-" specs/*/memory/*.md | head -10
```

**Expected Output:**
In metadata.json:
```json
{
  "decisionCount": 3,
  ...
}
```

In memory file:
```markdown
<!-- ANCHOR_EXAMPLE:DEC-001_hook-architecture -->
## Decision: Hook Architecture

**Chosen:** Python hooks with fail-open behavior
**Rationale:** Python provides rich stdlib for subprocess, JSON, and file operations...
**Alternatives Considered:**
- JavaScript hooks: Faster but less subprocess control
- Shell scripts: Simple but limited error handling

<!-- /ANCHOR_EXAMPLE:DEC-001_hook-architecture -->
```

**Pass/Fail Criteria:**
- ✅ PASS: decisionCount > 0 in metadata.json
- ✅ PASS: Decision anchors present in memory file
- ✅ PASS: Decisions have: Chosen, Rationale, Alternatives sections
- ❌ FAIL: decisionCount = 0 when decisions were made
- ❌ FAIL: Decisions missing structured fields

**Common Failure Modes:**
- extractDecisions() not finding decision patterns
- Manual input format not parsed correctly
- Template missing DECISIONS iteration

---

### CHK-RC3: filesModified Matches Actual Tool Usage

**Verification Command:**
```bash
# Compare session context files_modified with memory file FILES section

# Session context:
cat .opencode/sessions/session_*.json | jq '.files_modified' 2>/dev/null

# Memory file:
grep -A1 "FILE_PATH:" specs/*/memory/*.md | head -20
```

**Expected Output:**
Files tracked in session should appear in memory:

Session context:
```json
"files_modified": [
  ".opencode/hooks/session_start.py",
  ".opencode/hooks/post_tool_use.py"
]
```

Memory file:
```markdown
### Files Modified
- `.opencode/hooks/session_start.py` - Hook initialization logic
- `.opencode/hooks/post_tool_use.py` - Tool tracking implementation
```

**Pass/Fail Criteria:**
- ✅ PASS: All files from session context appear in memory
- ✅ PASS: File descriptions are meaningful (not just "Modified during session")
- ✅ PASS: File paths are relative (not absolute)
- ❌ FAIL: Files missing from memory that were modified
- ❌ FAIL: All files have generic "Modified during session" description

**Common Failure Modes:**
- post_tool_use.py not tracking Write/Edit tools
- SessionContext.files_modified not persisted
- generate-context.js not reading session file

---

### CHK-RC4: triggerPhrases Extracted from Actual Prompts

**Verification Command:**
```bash
# Check metadata.json for trigger phrases
cat specs/*/memory/metadata.json 2>/dev/null | jq '.semanticSummary' 

# Check memory file YAML frontmatter
head -30 specs/*/memory/*.md | grep -A5 "trigger_phrases:"
```

**Expected Output:**
YAML frontmatter in memory file:
```yaml
---
trigger_phrases:
  - "memory hook"
  - "session context"
  - "generate-context.js"
  - "fail-open behavior"
---
```

**Pass/Fail Criteria:**
- ✅ PASS: trigger_phrases array contains 3-10 relevant phrases
- ✅ PASS: Phrases are extracted from actual session content
- ✅ PASS: No generic phrases like "the" or "and"
- ❌ FAIL: Empty trigger_phrases array
- ❌ FAIL: Only generic/stopword phrases
- ❌ FAIL: Phrases don't relate to session topic

**Common Failure Modes:**
- extractTriggerPhrases() returning empty
- Stopword filtering too aggressive
- Manual input triggerPhrases not passed through

---

### CHK-RC5: Output is Comprehensive (>500 words)

**Verification Command:**
```bash
# Count words in memory file (excluding code blocks and YAML)
sed '/^```/,/^```/d' specs/*/memory/*.md | wc -w

# Or more precisely:
cat specs/*/memory/*.md | grep -v "^---$" | grep -v "^```" | wc -w
```

**Expected Output:**
```
678
```
(Should be > 500 words)

**Pass/Fail Criteria:**
- ✅ PASS: Word count >= 500
- ✅ PASS: Multiple sections present (Summary, Observations, Decisions, Files)
- ✅ PASS: Narrative content, not just lists
- ❌ FAIL: Word count < 500
- ❌ FAIL: Only template boilerplate
- ❌ FAIL: Missing major sections

**Common Failure Modes:**
- Input data too sparse
- Template sections not populated
- observations/decisions arrays empty

---

### CHK-RC6: Does NOT Rely on Agent Summarization

**Verification Command:**
```bash
# Check that memory file uses ANCHOR format (extractable content)
grep -c "<!-- ANCHOR_EXAMPLE:" specs/*/memory/*.md

# Verify content is structured, not prose blob
head -100 specs/*/memory/*.md | grep -E "^## |^### |^- "
```

**Expected Output:**
Memory file should have:
1. ANCHOR blocks (minimum 2):
```
3
```

2. Structured headings and lists:
```markdown
## Session Summary
## Key Observations
### Observation 1: Hook Architecture
### Observation 2: Context Tracking
## Decisions Made
### Decision 1: Python vs JavaScript
## Files Modified
- `.opencode/hooks/session_start.py`
- `.opencode/hooks/post_tool_use.py`
```

**Pass/Fail Criteria:**
- ✅ PASS: Uses ANCHOR format for searchable retrieval
- ✅ PASS: Content is structured (headings, lists, sections)
- ✅ PASS: Facts and observations are explicit, not summarized
- ✅ PASS: generate-context.js script creates file (not agent Write tool)
- ❌ FAIL: Prose blob without structure
- ❌ FAIL: Agent used Write tool to create memory file directly
- ❌ FAIL: No ANCHOR tags for semantic indexing

**Common Failure Modes:**
- Agent bypassing generate-context.js
- Template missing ANCHOR syntax
- Observations flattened into single narrative

---

## Verification Summary Checklist

Run this command to verify all items in one go:

```bash
#!/bin/bash
echo "=== Memory Plugin Verification ==="
echo ""

# P0 Critical
echo "CHK-001: Hook Files Exist"
ls .opencode/hooks/*.py 2>/dev/null && echo "  ✅ PASS" || echo "  ❌ FAIL"

echo "CHK-002: SessionStart Context"
ls .opencode/sessions/*.json 2>/dev/null && echo "  ✅ PASS" || echo "  ⚠️ No sessions yet"

echo "CHK-003: UserPromptSubmit Logs"
ls .opencode/logs/user_prompt_submit_*.log 2>/dev/null && echo "  ✅ PASS" || echo "  ⚠️ No logs yet"

echo "CHK-004: PostToolUse Tracking"
ls .opencode/logs/post_tool_use_*.log 2>/dev/null && echo "  ✅ PASS" || echo "  ⚠️ No logs yet"

echo "CHK-005: Stop Hook Graceful"
grep -l "graceful" .opencode/logs/stop_*.log 2>/dev/null && echo "  ✅ PASS" || echo "  ⚠️ No stop events yet"

echo "CHK-006: PreCompact Snapshots"
ls .opencode/compaction_snapshots/*.md 2>/dev/null && echo "  ✅ PASS" || echo "  ⚠️ No compaction yet"

echo "CHK-007: generate-context.js"
node --check .opencode/skills/system-memory/scripts/generate-context.js 2>/dev/null && echo "  ✅ PASS" || echo "  ❌ FAIL"

echo "CHK-008: Fail-Open Behavior"
echo '{}' | python .opencode/hooks/pre_compact.py 2>/dev/null; [ $? -eq 0 ] && echo "  ✅ PASS" || echo "  ❌ FAIL"

echo ""
echo "=== Root Cause Fixes ==="

echo "CHK-RC1: Multiple Observations"
count=$(grep -c "<!-- ANCHOR_EXAMPLE:OBS" specs/*/memory/*.md 2>/dev/null | grep -v ":0" | wc -l)
[ "$count" -gt 0 ] && echo "  ✅ PASS ($count files with observations)" || echo "  ⚠️ No memory files yet"

echo "CHK-RC2: keyDecisions Populated"
grep -l "ANCHOR:DEC-" specs/*/memory/*.md 2>/dev/null && echo "  ✅ PASS" || echo "  ⚠️ No decisions yet"

echo "CHK-RC3: filesModified Accurate"
grep -c "FILE_PATH:" specs/*/memory/*.md 2>/dev/null | grep -v ":0" && echo "  ✅ Has files" || echo "  ⚠️ Check manually"

echo "CHK-RC4: triggerPhrases Extracted"
grep -l "trigger_phrases:" specs/*/memory/*.md 2>/dev/null && echo "  ✅ PASS" || echo "  ⚠️ Check frontmatter"

echo "CHK-RC5: Comprehensive (>500 words)"
for f in specs/*/memory/*.md; do
  words=$(wc -w < "$f" 2>/dev/null)
  [ "$words" -gt 500 ] && echo "  ✅ $f: $words words"
done 2>/dev/null || echo "  ⚠️ No memory files yet"

echo "CHK-RC6: No Agent Summarization"
count=$(grep -c "<!-- ANCHOR_EXAMPLE:" specs/*/memory/*.md 2>/dev/null | grep -v ":0" | wc -l)
[ "$count" -gt 0 ] && echo "  ✅ Uses ANCHOR format" || echo "  ⚠️ Check structure"

echo ""
echo "=== Verification Complete ==="
```

---

## Quick Reference: Exit Codes

| Hook | Exit 0 | Exit 2 | Other |
|------|--------|--------|-------|
| session_start | Success (context shown) | N/A (non-blocking) | Warning only |
| user_prompt_submit | Allow prompt | Block prompt | Warning only |
| post_tool_use | Success | Feedback to agent | Warning only |
| stop | Allow stop | Block stop | Warning only |
| pre_compact | **ALWAYS** | **NEVER** | Warning only |

**Critical:** `pre_compact` must NEVER return exit code 2 - compaction is essential for continued operation.

---

## Related Files

- **Hooks Location:** `.opencode/hooks/`
- **Sessions:** `.opencode/sessions/`
- **Logs:** `.opencode/logs/`
- **Snapshots:** `.opencode/compaction_snapshots/`
- **Memory Script:** `.opencode/skills/system-memory/scripts/generate-context.js`
- **Templates:** `.opencode/skills/system-memory/templates/`
