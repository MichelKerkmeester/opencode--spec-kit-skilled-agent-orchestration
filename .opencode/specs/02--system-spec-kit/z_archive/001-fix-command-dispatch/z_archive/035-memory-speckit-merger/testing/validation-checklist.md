# Memory System Validation Checklist

Manual validation checklist for the merged memory system in `system-spec-kit`.

## Pre-Restart Validation

Run these tests BEFORE making any changes to verify baseline functionality.

### MCP Server Health

- [ ] MCP server starts without errors
  - Check: OpenCode loads without MCP errors in terminal
  - Expected: No "failed to start" or "connection refused" errors

- [ ] `memory_search({ query: "test" })` returns results
  - Run: Call MCP tool with any query
  - Expected: Returns array of results (may be empty if no memories match)

- [ ] `memory_match_triggers({ prompt: "fix bug" })` works
  - Run: Call MCP tool with common trigger phrase
  - Expected: Returns matching constitutional memories

### Constitutional Memories

- [ ] Constitutional memories surface at top of search
  - Run: `memory_search({ query: "any query", includeConstitutional: true })`
  - Expected: Constitutional tier memories appear first

- [ ] Constitutional folder contains expected files
  - Check: `.opencode/skill/system-spec-kit/constitutional/`
  - Expected: Memory files defining critical system behaviors

### Memory Generation

- [ ] `generate-context.js` creates valid memory files
  - Run: `node .opencode/skill/system-spec-kit/scripts/generate-context.js .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/035-memory-speckit-merger`
  - Expected: Creates timestamped .md file in `memory/` subfolder

---

## Post-Restart Validation

Run these tests AFTER running `memory-restart.sh` and restarting OpenCode.

### Database Recreation

- [ ] Database recreated on OpenCode restart
  - Check: `.opencode/skill/system-spec-kit/database/context-index.sqlite` exists
  - Expected: File created automatically

- [ ] `memory_index_scan({ force: true })` completes
  - Run: Call MCP tool
  - Expected: Returns count of indexed files

### Re-indexing Verification

- [ ] All memory files re-indexed
  - Run: `memory_stats()`
  - Expected: Memory count matches expected number of files

- [ ] Constitutional files re-indexed
  - Run: `memory_search({ tier: "constitutional" })`
  - Expected: Constitutional memories appear in results

- [ ] Spec folder memories re-indexed
  - Run: `memory_search({ query: "spec" })`
  - Expected: Returns memories from spec folders

---

## Integration Validation

Test integration with OpenCode commands and gates.

### Memory Commands

- [ ] `/memory:save` command works
  - Trigger: Type `/memory:save` in OpenCode
  - Expected: Prompts for spec folder or saves context

- [ ] `/memory:search` command works
  - Trigger: Type `/memory:search test query` in OpenCode
  - Expected: Returns search results

- [ ] `/memory:load` command works
  - Trigger: Type `/memory:load` in OpenCode
  - Expected: Shows memory loading UI or results

- [ ] `/memory:checkpoint` command works
  - Trigger: Type `/memory:checkpoint create test` in OpenCode
  - Expected: Creates checkpoint

### Gate Integration

- [ ] Gate 1 calls `memory_match_triggers()`
  - Observe: First message in conversation
  - Expected: Agent mentions surfacing context or "no triggers matched"

- [ ] Gate 4 surfaces memory context
  - Trigger: Select existing spec folder (option A)
  - Expected: Agent displays relevant memory context

- [ ] Gate 5 enforces generate-context.js usage
  - Trigger: Ask to "save context"
  - Expected: Agent uses script, not Write tool for memory files

---

## Performance Validation

- [ ] Search response time < 2 seconds
  - Run: `memory_search({ query: "complex query string" })`
  - Expected: Results return quickly

- [ ] Trigger matching < 100ms
  - Run: `memory_match_triggers({ prompt: "test" })`
  - Expected: Nearly instant response

- [ ] Large index scan completes < 30 seconds
  - Run: `memory_index_scan({ force: true })`
  - Expected: Completes without timeout

---

## Error Handling

- [ ] Invalid query handled gracefully
  - Run: `memory_search({ query: "" })`
  - Expected: Returns error message, not crash

- [ ] Missing database handled
  - Delete database, then call `memory_search()`
  - Expected: Creates database automatically or returns clear error

- [ ] Invalid spec folder path handled
  - Run: `generate-context.js` with invalid path
  - Expected: Clear error message

---

## Sign-off

| Validation | Date | Tester | Pass/Fail |
|------------|------|--------|-----------|
| Pre-Restart | | | |
| Post-Restart | | | |
| Integration | | | |
| Performance | | | |
| Error Handling | | | |

**Notes:**

---

**Final Status:** [ ] PASSED / [ ] FAILED
