# Gate 3 Enforcement Test Suite

> **Purpose**: Verify that the constitutional memory system correctly enforces Gate 3 (spec folder question before file modifications).
> 
> **For AI Agents**: Run these tests in a fresh conversation to validate the enforcement system.

---

## Overview

The Gate 3 enforcement system uses a **constitutional-tier memory** (ID #132) that:
1. Surfaces at the TOP of every `memory_search()` result
2. Matches trigger phrases via `memory_match_triggers()`
3. Reminds the AI to ask the spec folder question BEFORE any file modifications

---

## Test Categories

| Category | Tests | Purpose |
|----------|-------|---------|
| **A. Trigger Phrase Tests** | 10 | Verify memory surfaces for implementation keywords |
| **B. Constitutional Surfacing** | 5 | Verify memory appears at top of ALL searches |
| **C. Database State Tests** | 5 | Verify memory is correctly indexed |
| **D. Behavioral Tests** | 4 | Verify AI behavior (requires fresh session) |

---

## A. Trigger Phrase Tests

Run each `memory_match_triggers()` call and verify the Gate 3 memory (ID #132) appears in results.

### A1. Basic Implementation Keywords

```typescript
// TEST A1.1: "fix" keyword
memory_match_triggers({ prompt: "fix the bug in auth.js" })
// EXPECTED: Memory #132 in results, matched phrase includes "fix"

// TEST A1.2: "implement" keyword
memory_match_triggers({ prompt: "implement new feature" })
// EXPECTED: Memory #132 in results, matched phrase includes "implement"

// TEST A1.3: "create" keyword
memory_match_triggers({ prompt: "create a new component" })
// EXPECTED: Memory #132 in results, matched phrase includes "create"

// TEST A1.4: "modify" keyword
memory_match_triggers({ prompt: "modify the config file" })
// EXPECTED: Memory #132 in results, matched phrase includes "modify"

// TEST A1.5: "update" keyword
memory_match_triggers({ prompt: "update the database schema" })
// EXPECTED: Memory #132 in results, matched phrase includes "update"
```

### A2. Compound Trigger Phrases

```typescript
// TEST A2.1: "fix all" compound
memory_match_triggers({ prompt: "fix all bugs in the codebase" })
// EXPECTED: Memory #132, matched phrases include "fix", "all bugs", "codebase", "fix all"

// TEST A2.2: "comprehensive" + "agents"
memory_match_triggers({ prompt: "comprehensive analysis with 15 agents" })
// EXPECTED: Memory #132, matched phrases include "comprehensive", "15 agents"

// TEST A2.3: "analyze and fix"
memory_match_triggers({ prompt: "analyze and fix all issues" })
// EXPECTED: Memory #132, matched phrases include "analyze and fix", "fix all"
```

### A3. Edge Cases

```typescript
// TEST A3.1: Single word in sentence
memory_match_triggers({ prompt: "I want to refactor the authentication module" })
// EXPECTED: Memory #132, matched phrase includes "refactor"

// TEST A3.2: No trigger keywords (should NOT match)
memory_match_triggers({ prompt: "what is the weather today" })
// EXPECTED: Empty results OR Memory #132 NOT in results
```

---

## B. Constitutional Surfacing Tests

Verify that constitutional memory appears at the TOP of search results regardless of query relevance.

### B1. Unrelated Queries

```typescript
// TEST B1.1: Completely unrelated query
memory_search({ query: "database schema design patterns", includeConstitutional: true })
// EXPECTED: 
//   - Memory #132 appears FIRST
//   - isConstitutional: true
//   - similarity: 100 (max score for constitutional)

// TEST B1.2: Another unrelated query
memory_search({ query: "CSS flexbox tutorial", includeConstitutional: true })
// EXPECTED: Memory #132 first with isConstitutional: true

// TEST B1.3: Technical but unrelated
memory_search({ query: "React useState hook examples", includeConstitutional: true })
// EXPECTED: Memory #132 first with isConstitutional: true
```

### B2. Related Queries

```typescript
// TEST B2.1: Related query (should still be first)
memory_search({ query: "gate 3 spec folder enforcement", includeConstitutional: true })
// EXPECTED: Memory #132 first (constitutional always wins)

// TEST B2.2: Query about memory system
memory_search({ query: "constitutional memory tier", includeConstitutional: true })
// EXPECTED: Memory #132 first
```

---

## C. Database State Tests

Verify the memory is correctly stored with proper attributes.

### C1. Memory Existence

```typescript
// TEST C1.1: List recent memories
memory_list({ limit: 10 })
// EXPECTED: Memory #132 in list with:
//   - title: "GATE 3 ENFORCEMENT - ASK SPEC FOLDER FIRST"
//   - specFolder: "005-memory/018-gate3-enforcement"
//   - triggerCount: 33 (or more)

// TEST C1.2: Get memory stats
memory_stats()
// EXPECTED: constitutionalCount >= 1
```

### C2. Memory Attributes

```typescript
// TEST C2.1: Search with tier filter
memory_search({ tier: "constitutional", limit: 5 })
// EXPECTED: Memory #132 in results with importanceTier: "constitutional"

// TEST C2.2: Verify specific memory attributes
memory_search({ query: "gate 3", specFolder: "005-memory/018-gate3-enforcement" })
// EXPECTED: Memory #132 with:
//   - importanceTier: "constitutional"
//   - isConstitutional: true
//   - 33 trigger phrases
```

### C3. File Existence

```bash
# TEST C3.1: Memory file exists
ls .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/memory
# EXPECTED: File matching pattern "24-12-25_*__gate3-enforcement.md"

# TEST C3.2: Memory file has content
wc -l .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/memory/24-12-25_12-44__gate3-enforcement.md
# EXPECTED: ~1500+ lines
```

---

## D. Behavioral Tests (Fresh Session Required)

These tests MUST be run in a **new conversation session** to verify AI behavior.

### D1. First Message Protocol

**Test D1.1: Implementation Request as First Message**

Start a NEW conversation and send:
```
Fix all bugs in the authentication module
```

**EXPECTED AI BEHAVIOR:**
1. AI's FIRST response asks the spec folder question
2. AI does NOT analyze code first
3. AI does NOT use Read/Glob/Grep tools first
4. AI presents: `**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip`
5. AI waits for user response before proceeding

**FAILURE INDICATORS:**
- AI starts analyzing code before asking
- AI uses project tools (Read, Glob, Grep) before asking
- AI uses simplified question format
- AI proceeds without waiting for A/B/C/D response

---

**Test D1.2: Create Request as First Message**

Start a NEW conversation and send:
```
Create a new notification system component
```

**EXPECTED AI BEHAVIOR:**
Same as D1.1 - spec folder question FIRST

---

**Test D1.3: Exciting Task (Potential Bypass)**

Start a NEW conversation and send:
```
Use 15 parallel agents to comprehensively analyze and fix all issues in the skills and MCP servers
```

**EXPECTED AI BEHAVIOR:**
- Despite the exciting/complex nature, AI still asks spec folder question FIRST
- AI does NOT get distracted by the complexity
- This tests Failure Pattern #19 (Skip Gate 3 on exciting tasks)

---

**Test D1.4: Subtle Implementation Request**

Start a NEW conversation and send:
```
The button alignment is off on the homepage, can you take a look and adjust it?
```

**EXPECTED AI BEHAVIOR:**
- AI recognizes "adjust" as a file modification trigger
- AI asks spec folder question FIRST
- AI does NOT start reading CSS files before asking

---

## Test Results

### Test Run: 2024-12-24 (Verification Session)

**Tester**: AI Agent via Sequential Thinking MCP  
**Session Type**: Verification of Gate 3 Enforcement System

#### A. Trigger Phrase Tests
| Test | Result | Notes |
|------|--------|-------|
| A1.1 | PASS | Memory #132 returned, matched phrase: "fix" |
| A1.2 | PASS | Memory #132 returned, matched phrase: "implement" |
| A1.3 | PASS | Memory #132 returned, matched phrase: "create" |
| A1.4 | PASS | Memory #132 returned, matched phrases: "modify" (note: also matched #78 for "config file") |
| A1.5 | PASS | Memory #132 returned, matched phrase: "update" |
| A2.1 | PASS | Memory #132 returned, matched phrases: "fix", "all bugs", "codebase", "fix all" |
| A2.2 | PASS | Memory #132 returned, matched phrases: "comprehensive", "15 agents" |
| A2.3 | PASS | Memory #132 returned, matched phrases: "fix", "analyze and fix", "fix all" |
| A3.1 | PASS | Memory #132 returned, matched phrase: "refactor" |
| A3.2 | PASS | Empty results - no trigger keywords matched (correct behavior) |

#### B. Constitutional Surfacing Tests
| Test | Result | Notes |
|------|--------|-------|
| B1.1 | PASS | Memory #132 first, similarity: 100, isConstitutional: true |
| B1.2 | PASS | Memory #132 first, similarity: 100, isConstitutional: true |
| B1.3 | PASS | Memory #132 first, similarity: 100, isConstitutional: true |
| B2.1 | PASS | Memory #132 first, similarity: 100, isConstitutional: true |
| B2.2 | PASS | Memory #132 first, similarity: 100, isConstitutional: true |

#### C. Database State Tests
| Test | Result | Notes |
|------|--------|-------|
| C1.1 | PASS | Memory #132 in list with title "GATE 3 ENFORCEMENT...", triggerCount: 33 |
| C1.2 | PARTIAL | memory_stats() doesn't report constitutionalCount field (reporting gap, not functional) |
| C2.1 | PASS | Tier filter returns Memory #132 with importanceTier: "constitutional" |
| C2.2 | PASS | Spec folder filter returns both memories (#132 constitutional, #133 session summary) |
| C3.1 | PASS | File exists: `24-12-25_12-44__gate3-enforcement.md` |
| C3.2 | PASS | File has 1571 lines (exceeds 1500+ expectation) |

#### D. Behavioral Tests
| Test | Result | Notes |
|------|--------|-------|
| D1.1 | PASS | User confirmed: "Fix all bugs" → AI asked spec folder first |
| D1.2 | PASS | User confirmed: "Create component" → AI asked spec folder first |
| D1.3 | PASS | User confirmed: "15 agents comprehensive" → AI asked spec folder first |
| D1.4 | PASS | User confirmed: "Adjust button" → AI asked spec folder first |

#### Summary
- **Total Tests**: 24
- **Passed**: 23
- **Partial**: 1 (C1.2 - reporting gap)
- **Pending**: 0
- **Failed**: 0
- **Overall Pass Rate**: 96% (23/24 tests)
- **Overall Status**: COMPLETE

#### Key Findings

1. **Constitutional memory system working correctly**
   - Memory #132 surfaces at top of ALL searches with similarity: 100
   - isConstitutional: true flag properly set
   - importanceTier: "constitutional" correctly persisted

2. **Trigger phrase matching working correctly**
   - All 33 trigger phrases properly indexed
   - Exact matches and compound phrases both work
   - Edge cases handled correctly (refactor in sentence, no-match returns empty)

3. **Minor gap identified**
   - `memory_stats()` doesn't include constitutionalCount field
   - This is a reporting enhancement opportunity, not a functional issue

4. **Behavioral tests verified manually**
   - User confirmed all 4 behavioral tests passed in fresh sessions
   - AI correctly asks spec folder question FIRST before any analysis
   - "Exciting task" bypass pattern properly prevented

---

## Test Results Template

Use this template to record additional test runs:

```markdown
## Test Run: [DATE]

### A. Trigger Phrase Tests
| Test | Result | Notes |
|------|--------|-------|
| A1.1 | PASS/FAIL | |
| A1.2 | PASS/FAIL | |
| A1.3 | PASS/FAIL | |
| A1.4 | PASS/FAIL | |
| A1.5 | PASS/FAIL | |
| A2.1 | PASS/FAIL | |
| A2.2 | PASS/FAIL | |
| A2.3 | PASS/FAIL | |
| A3.1 | PASS/FAIL | |
| A3.2 | PASS/FAIL | |

### B. Constitutional Surfacing Tests
| Test | Result | Notes |
|------|--------|-------|
| B1.1 | PASS/FAIL | |
| B1.2 | PASS/FAIL | |
| B1.3 | PASS/FAIL | |
| B2.1 | PASS/FAIL | |
| B2.2 | PASS/FAIL | |

### C. Database State Tests
| Test | Result | Notes |
|------|--------|-------|
| C1.1 | PASS/FAIL | |
| C1.2 | PASS/FAIL | |
| C2.1 | PASS/FAIL | |
| C2.2 | PASS/FAIL | |
| C3.1 | PASS/FAIL | |
| C3.2 | PASS/FAIL | |

### D. Behavioral Tests
| Test | Result | Notes |
|------|--------|-------|
| D1.1 | PASS/FAIL | |
| D1.2 | PASS/FAIL | |
| D1.3 | PASS/FAIL | |
| D1.4 | PASS/FAIL | |

### Summary
- Total Tests: 24
- Passed: X
- Failed: X
- Pass Rate: X%
```

---

## Quick Verification Commands

Copy-paste these for quick verification:

```typescript
// 1. Check if constitutional memory exists
memory_list({ limit: 3 })

// 2. Verify constitutional tier
memory_search({ query: "anything", includeConstitutional: true, limit: 1 })

// 3. Test trigger matching
memory_match_triggers({ prompt: "fix implement create modify update" })

// 4. Get system stats
memory_stats()
```

---

## Troubleshooting

### Memory Not Found
If Memory #132 is not found:
1. Run `memory_index_scan({ force: true })` to re-index
2. Check if file exists: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/memory`
3. Verify tier: `memory_update({ id: 132, importanceTier: "constitutional" })`

### Triggers Not Matching
If triggers don't match:
1. Check trigger phrases: `memory_search({ query: "gate 3" })`
2. Re-run update: 
```typescript
memory_update({ 
  id: 132, 
  triggerPhrases: ["fix", "implement", "create", "modify", "update", "refactor", "change", "edit", "write", "add", "remove", "delete", "comprehensive", "all bugs", "multiple files", "codebase", "entire", "full", "everything", "parallel agents", "15 agents", "10 agents", "dispatch agents", "opus agents", "analyze and fix", "find and fix", "fix all", "update all", "modify all", "check and fix", "spec folder", "gate 3", "file modification"]
})
```

### Constitutional Not Surfacing
If constitutional memory doesn't appear first:
1. Verify tier is set: `memory_search({ tier: "constitutional" })`
2. Ensure `includeConstitutional: true` in search (it's default but verify)
3. Check MCP server is running with latest code

---

## Related Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | Gate 3 definition, First Message Protocol, Failure Pattern #19 |
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/spec.md` | Problem statement and solutions |
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/plan.md` | Implementation phases |
| `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/checklist.md` | Verification checklist |
| `.opencode/skill/system-memory/SKILL.md` | Constitutional tier documentation |
| `.opencode/skill/system-spec-kit/SKILL.md` | First Message Protocol reference |

---

*Test Suite Version: 1.0.0*
*Created: 2024-12-24*
*Spec Folder: 005-memory/018-gate3-enforcement*
