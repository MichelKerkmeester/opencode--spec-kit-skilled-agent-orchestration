# Memory System Testing Suite

Testing suite for the merged memory system in `system-spec-kit`.

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

This testing suite validates the memory system after the merger of `system-memory` into `system-spec-kit`. It ensures:

1. All infrastructure is in place
2. No broken paths or references
3. Database integrity is maintained
4. Memory operations work correctly
<!-- /ANCHOR:purpose -->

<!-- ANCHOR:prerequisites -->
## Prerequisites

- Node.js installed
- SQLite3 command-line tool installed
- OpenCode running (for MCP tool tests)
- Bash shell (macOS/Linux)
<!-- /ANCHOR:prerequisites -->

<!-- ANCHOR:files -->
## Files

| File | Purpose |
|------|---------|
| `test-suite.sh` | Automated infrastructure and syntax tests |
| `memory-restart.sh` | Clean database restart procedure |
| `validation-checklist.md` | Manual validation checklist |
| `rollback.sh` | Restore from backup if issues occur |
<!-- /ANCHOR:files -->

<!-- ANCHOR:how-to-run-tests -->
## How to Run Tests

### 1. Automated Tests

```bash
# From project root
..opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/035-memory-speckit-merger/testing/test-suite.sh
```

This runs:
- Infrastructure existence checks
- JavaScript syntax validation
- Old path reference detection
- Database integrity checks

### 2. Memory System Restart

If the database is corrupted or needs a fresh start:

```bash
..opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/035-memory-speckit-merger/testing/memory-restart.sh
```

Then follow the instructions to re-index via MCP tools.

### 3. Manual Validation

Open `validation-checklist.md` and work through each item manually using OpenCode.

### 4. Rollback (if needed)

```bash
..opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/035-memory-speckit-merger/testing/rollback.sh
```
<!-- /ANCHOR:how-to-run-tests -->

<!-- ANCHOR:expected-results -->
## Expected Results

### Successful Test Suite Output

```
=== Memory System Testing Suite ===

Test 1: Infrastructure Check
✓ MCP server exists
✓ Database exists
✓ Constitutional folder exists
✓ All 23 lib modules exist

Test 2: Syntax Validation
✓ context-server.js syntax OK
✓ generate-context.js syntax OK

Test 3: No Old Path References
✓ No old system-memory paths found

Test 4: Database Integrity
✓ memory_index table accessible
✓ vec_memories table accessible

=== All Tests Passed ===
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Database not found | Run `memory-restart.sh` then restart OpenCode |
| Syntax errors | Check recent changes to JS files |
| Old paths found | Update references to use `system-spec-kit` |
| MCP tools not working | Restart OpenCode to reload MCP servers |
<!-- /ANCHOR:expected-results -->

<!-- ANCHOR:directory-structure -->
## Directory Structure

```
.opencode/skill/system-spec-kit/
├── mcp_server/
│   ├── context-server.js    # Main MCP server
│   └── lib/                  # 23 library modules
├── database/
│   ├── context-index.sqlite  # Main database
│   └── backups/              # Backup location
├── constitutional/           # Constitutional memories
└── scripts/
    └── generate-context.js   # Memory file generator
```
<!-- /ANCHOR:directory-structure -->

