# Memory System Overhaul - Testing Suite

## Overview
This testing suite validates all changes made during the Memory System Overhaul. Tests are organized by component and priority.

---

## Pre-Test Requirements

1. **Restart OpenCode** to load updated MCP server
2. **Verify no syntax errors:**
   ```bash
   node --check .opencode/skill/system-memory/mcp_server/semantic-memory.js
   node --check .opencode/skill/system-memory/scripts/generate-context.js
   ```

---

## Test Categories

### 1. MCP Server Tests (Critical)

#### 1.1 includeContent Parameter
**Priority:** P0 - Critical

| Test | Command | Expected Result |
|------|---------|-----------------|
| Search without content | `memory_search({ query: "test" })` | Results without content field |
| Search with content | `memory_search({ query: "test", includeContent: true })` | Results with content field containing file text |
| Empty results with content | `memory_search({ query: "nonexistent12345", includeContent: true })` | Empty array, no errors |

#### 1.2 memory_load Removal
**Priority:** P0 - Critical

| Test | Action | Expected Result |
|------|--------|-----------------|
| Tool not available | Try to call `memory_load()` | Tool not found error |
| No case handler | Check semantic-memory.js | No 'semantic_memory_memory_load' case |

#### 1.3 Tier Validation
**Priority:** P1 - High

| Test | Command | Expected Result |
|------|---------|-----------------|
| Valid tier | `memory_update({ id: X, importanceTier: "critical" })` | Success |
| Invalid tier | `memory_update({ id: X, importanceTier: "invalid" })` | Error with valid tiers list |

#### 1.4 indexMemoryFile Shared Function
**Priority:** P1 - High

| Test | Command | Expected Result |
|------|---------|-----------------|
| Save new file | `memory_save({ filePath: "..." })` | Returns status: 'indexed' |
| Save unchanged | `memory_save({ filePath: "..." })` (same file) | Returns status: 'unchanged' |
| Force re-index | `memory_save({ filePath: "...", force: true })` | Returns status: 'updated' |

---

### 2. Script Tests (High)

#### 2.1 generate-context.js
**Priority:** P1 - High

| Test | Command | Expected Result |
|------|---------|-----------------|
| Help command | `node generate-context.js --help` | Shows usage info |
| Valid spec folder | `node generate-context.js .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement` | Creates memory file |
| Invalid path | `node generate-context.js /nonexistent` | Error message |

---

### 3. Config Tests (Medium)

#### 3.1 config.jsonc
**Priority:** P2 - Medium

| Test | Action | Expected Result |
|------|--------|-----------------|
| Valid JSON | Parse config.jsonc | No syntax errors |
| All settings present | Check required keys | All defaults exist |

```bash
# Validate JSON syntax (strip comments first)
cat .opencode/skill/system-memory/config.jsonc | grep -v '//' | node -e "JSON.parse(require('fs').readFileSync(0, 'utf8'))"
```

#### 3.2 filters.jsonc
**Priority:** P2 - Medium

| Test | Action | Expected Result |
|------|--------|-----------------|
| Valid JSON | Parse filters.jsonc | No syntax errors |

---

### 4. Reference File Tests (Medium)

#### 4.1 File Existence
**Priority:** P2 - Medium

| File | Expected |
|------|----------|
| `references/save-workflow.md` | EXISTS |
| `references/folder_routing.md` | EXISTS |
| `references/troubleshooting.md` | EXISTS |
| `references/semantic_memory.md` | NOT EXISTS (deleted) |
| `references/execution_methods.md` | NOT EXISTS (merged) |
| `references/output_format.md` | NOT EXISTS (merged) |
| `references/spec_folder_detection.md` | NOT EXISTS (merged) |
| `references/alignment_scoring.md` | NOT EXISTS (merged) |

```bash
# Verify file existence
ls -la .opencode/skill/system-memory/references/
```

#### 4.2 SKILL.md References
**Priority:** P2 - Medium

| Test | Action | Expected Result |
|------|--------|-----------------|
| No broken links | Grep for old file names | No matches |
| New files referenced | Grep for save-workflow.md | Found in Resource Router |

```bash
# Check for old references
grep -r "semantic_memory.md\|execution_methods.md\|output_format.md\|spec_folder_detection.md\|alignment_scoring.md" .opencode/skill/system-memory/SKILL.md
# Should return nothing

# Check for new references
grep -r "save-workflow.md\|folder_routing.md" .opencode/skill/system-memory/SKILL.md
# Should find matches
```

---

### 5. Command File Tests (High)

#### 5.1 memory_load Removal
**Priority:** P1 - High

| File | Test | Expected Result |
|------|------|-----------------|
| search.md | Grep for memory_load in allowed-tools | Not found |
| checkpoint.md | Grep for memory_load in allowed-tools | Not found |
| save.md | Grep for memory_load | Not found (except deprecation notes) |

```bash
grep -n "memory_load" .opencode/command/memory/*.md
# Should only show deprecation notes, not allowed-tools
```

---

### 6. Documentation Tests (Medium)

#### 6.1 AGENTS.md
**Priority:** P2 - Medium

| Test | Action | Expected Result |
|------|--------|-----------------|
| Gate 4 has includeContent | Grep Gate 4 section | includeContent: true present |
| Gate priority clear | Read Gate 3 section | Priority note present |

#### 6.2 README.md
**Priority:** P2 - Medium

| Test | Action | Expected Result |
|------|--------|-----------------|
| No NOT YET IMPLEMENTED | Grep README | No matches |

```bash
grep -i "NOT YET IMPLEMENTED" .opencode/skill/system-memory/README.md
# Should return nothing
```

---

## Automated Test Script

Save as `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/scratch/run-tests.sh`:

```bash
#!/bin/bash

echo "=== Memory System Overhaul Test Suite ==="
echo ""

PASS=0
FAIL=0

# Test 1: Syntax check semantic-memory.js
echo -n "Test 1: semantic-memory.js syntax... "
if node --check .opencode/skill/system-memory/mcp_server/semantic-memory.js 2>/dev/null; then
    echo "PASS"
    ((PASS++))
else
    echo "FAIL"
    ((FAIL++))
fi

# Test 2: Syntax check generate-context.js
echo -n "Test 2: generate-context.js syntax... "
if node --check .opencode/skill/system-memory/scripts/generate-context.js 2>/dev/null; then
    echo "PASS"
    ((PASS++))
else
    echo "FAIL"
    ((FAIL++))
fi

# Test 3: semantic_memory.md deleted
echo -n "Test 3: semantic_memory.md deleted... "
if [ ! -f ".opencode/skill/system-memory/references/semantic_memory.md" ]; then
    echo "PASS"
    ((PASS++))
else
    echo "FAIL"
    ((FAIL++))
fi

# Test 4: save-workflow.md exists
echo -n "Test 4: save-workflow.md exists... "
if [ -f ".opencode/skill/system-memory/references/save-workflow.md" ]; then
    echo "PASS"
    ((PASS++))
else
    echo "FAIL"
    ((FAIL++))
fi

# Test 5: folder_routing.md exists
echo -n "Test 5: folder_routing.md exists... "
if [ -f ".opencode/skill/system-memory/references/folder_routing.md" ]; then
    echo "PASS"
    ((PASS++))
else
    echo "FAIL"
    ((FAIL++))
fi

# Test 6: No memory_load in search.md allowed-tools
echo -n "Test 6: memory_load removed from search.md... "
if ! grep -q "semantic_memory_memory_load" .opencode/command/memory/search.md 2>/dev/null; then
    echo "PASS"
    ((PASS++))
else
    echo "FAIL"
    ((FAIL++))
fi

# Test 7: No NOT YET IMPLEMENTED in README
echo -n "Test 7: No NOT YET IMPLEMENTED in README... "
if ! grep -qi "NOT YET IMPLEMENTED" .opencode/skill/system-memory/README.md 2>/dev/null; then
    echo "PASS"
    ((PASS++))
else
    echo "FAIL"
    ((FAIL++))
fi

# Test 8: config.jsonc reduced
echo -n "Test 8: config.jsonc < 150 lines... "
LINES=$(wc -l < .opencode/skill/system-memory/config.jsonc)
if [ "$LINES" -lt 150 ]; then
    echo "PASS ($LINES lines)"
    ((PASS++))
else
    echo "FAIL ($LINES lines)"
    ((FAIL++))
fi

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
```

---

## Test Execution Checklist

- [ ] Restart OpenCode
- [ ] Run automated test script
- [ ] Test memory_search with includeContent manually
- [ ] Verify memory_load is not available
- [ ] Check SKILL.md Resource Router links
- [ ] Confirm Gate 4 documentation is correct

---

## Known Issues / Edge Cases

1. **MCP Server Cache:** After code changes, must restart OpenCode for changes to take effect
2. **Constitutional Memory:** May need re-indexing after restart
3. **Flowchart Generation:** Intentionally disabled (feature toggle), not dead code
