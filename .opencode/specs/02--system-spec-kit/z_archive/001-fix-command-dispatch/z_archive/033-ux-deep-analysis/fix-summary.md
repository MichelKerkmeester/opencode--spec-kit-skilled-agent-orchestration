# Fix Summary - UX Deep Analysis

> Comprehensive analysis of Memory Skill, Memory Server, SpecKit Skill, and Commands
> Analysis Date: December 25, 2025
> Method: 20 parallel Opus agents with specialized focus areas

---

## Executive Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P0 (Blocking) | 12 | Broken functionality, blocks users |
| P1 (Confusing) | 35+ | Misleading docs, causes errors |
| P2 (Friction) | 50+ | Suboptimal UX, friction points |
| P3 (Nice-to-have) | 20+ | Improvements for polish |
| **TOTAL** | **~120** | Issues identified |

### Agent Coverage

| Agent Range | Focus Area | Issues Found |
|-------------|------------|--------------|
| 1-6 | Memory System | 28 |
| 7-11 | SpecKit System | 32 |
| 12-15 | Commands | 25 |
| 16-20 | Cross-cutting | 35 |

---

## P0 Issues (Blocking) - Must Fix

### P0-1: MCP Tool Naming Crisis
**Agents:** 1, 5, 12, 14, 20
**Impact:** All memory commands broken for users following docs
**Current (WRONG):** `mcp__semantic_memory__memory_search({...})`
**Correct:** `semantic_memory_memory_search({...})`
**Files Affected:**
- `.opencode/command/memory/save.md:4,175-178,518-528` - allowed-tools and examples
- `.opencode/command/memory/search.md:4,28-29,193-211,222-224,294-300,357-358,464-465` - allowed-tools and all MCP examples
- `.opencode/command/memory/load.md:4,87-94,124-134` - allowed-tools and examples
- `.opencode/command/memory/checkpoint.md:4,146-149,198-201,232-233,255-258,291-292,345-349` - allowed-tools and all checkpoint examples

**Fix Required:**
```diff
- allowed-tools: Read, Bash, mcp__semantic_memory__memory_search, mcp__semantic_memory__memory_load
+ allowed-tools: Read, Bash, semantic_memory_memory_search, semantic_memory_memory_load
```

Replace ALL instances of `mcp__semantic_memory__` with `semantic_memory_` throughout these files.

---

### P0-2: No Root README
**Agent:** 17
**Impact:** First-time users have no introduction to the framework
**Current:** No README.md at project root (only AGENTS.md exists)
**Fix:** Create README.md with:
- What is this? (3 paragraphs explaining the AI agent framework)
- Getting Started (5-step quickstart)
- Directory structure explanation
- Links to detailed docs (AGENTS.md, skills, commands)
- Prerequisites (OpenCode CLI, Node.js, etc.)

---

### P0-3: Windows ${HOME} Broken
**Agent:** 19
**Impact:** Windows users cannot use MCP config without modification
**Current:** `opencode.json` uses `${HOME}/MEGA/...` paths which don't resolve on Windows
**Location:** `opencode.json` (line varies)
**Fix Options:**
1. Document workaround prominently: Use `%USERPROFILE%` on Windows
2. Add cross-platform path resolution note in README
3. Consider using relative paths where possible

---

### P0-4: Bash Scripts Require Git Bash
**Agent:** 19
**Impact:** Windows native users cannot run validation/creation scripts
**Current:** All scripts use `#!/usr/bin/env bash` shebang
**Affected Scripts:**
- `.opencode/skill/system-spec-kit/scripts/create-spec-folder.sh`
- `.opencode/skill/system-spec-kit/scripts/validate-spec.sh`
- `.opencode/skill/system-spec-kit/scripts/archive-spec.sh`
- `.opencode/skill/system-spec-kit/scripts/recommend-level.sh`
- `.opencode/skill/system-spec-kit/scripts/calculate-completeness.sh`

**Fix:** Document Git Bash/WSL requirement prominently in:
- Root README.md
- SpecKit SKILL.md introduction section
- Each script's header comments

---

### P0-5: retry-manager.js getDb() Bug
**Agent:** 4
**Impact:** Script crashes when retry logic triggered
**Current:** Calls `vectorIndex.getDb()` which is not exported
**File:** `.opencode/skill/system-memory/scripts/lib/retry-manager.js`
**Lines:** 42, 99, 118, 151 (and potentially more)
**Root Cause:** `vector-index.js` exports `initializeDb()` but the retry-manager calls `getDb()`

**Fix Options:**
1. Export `getDb()` from `vector-index.js`
2. Change retry-manager to use `initializeDb()` instead
3. Create a singleton pattern for database access

```javascript
// Current (broken)
const db = vectorIndex.getDb();

// Fix option 1: Export getDb from vector-index.js
module.exports = { initializeDb, getDb };

// Fix option 2: Use initializeDb in retry-manager
const { initializeDb } = require('./vector-index');
const db = initializeDb();
```

---

### P0-6: Missing Spec Folder Validation
**Agent:** 4
**Impact:** Creates orphan `memory/` directories in non-existent spec folders
**Current:** `setupContextDirectory()` doesn't validate spec folder exists before creating memory/ subdirectory
**File:** `.opencode/skill/system-memory/scripts/generate-context.js:3053-3062`

**Fix:**
```javascript
async function setupContextDirectory(specFolder) {
  // ADD THIS: Validate spec folder exists first
  const specsDir = path.join(CONFIG.PROJECT_ROOT, 'specs');
  const fullSpecPath = path.resolve(specsDir, specFolder);
  
  if (!fs.existsSync(fullSpecPath)) {
    throw new Error(`Spec folder does not exist: ${specFolder}. Create it first with /spec_kit:plan`);
  }
  
  // Existing logic
  const contextDir = path.join(fullSpecPath, 'memory');
  await fs.mkdir(contextDir, { recursive: true });
  return contextDir;
}
```

---

### P0-7: Template Count Mismatch
**Agents:** 7, 9, 11
**Impact:** Users can't find all available templates
**Current:** SpecKit SKILL.md references "12 templates"
**Actual Count:** 13 templates exist in `templates/` directory:
1. spec.md
2. plan.md
3. tasks.md
4. checklist.md
5. decision-record.md
6. research.md
7. handover.md
8. debug-delegation.md
9. quickstart.md
10. spike.md
11. data-model.md
12. planning-summary.md
13. implementation-summary.md

**Fix:** Update count in SKILL.md and document ALL templates in template_guide.md reference file

---

### P0-8: Inconsistent Placeholder Format
**Agent:** 9
**Impact:** Template confusion - users don't know which format to follow
**Current:**
- `debug-delegation.md` uses: `[PLACEHOLDER: description]`
- Other templates use: `[YOUR_VALUE_HERE: description]` or `<placeholder>`

**Files to Fix:**
- `.opencode/skill/system-spec-kit/templates/debug-delegation.md`

**Standard to Adopt:** `[YOUR_VALUE_HERE: description]` (most common pattern)

---

### P0-9: Missing "What is a spec folder?" Definition
**Agent:** 7
**Impact:** New users have no foundational understanding
**Current:** The term "spec folder" is used 50+ times in SKILL.md but never defined
**Location:** `.opencode/skill/system-spec-kit/SKILL.md`

**Fix:** Add definition section at the start:
```markdown
## What is a Spec Folder?

A **spec folder** is a standardized documentation directory for tracking 
file modifications. Located at `specs/###-short-name/`, each folder contains:
- **spec.md**: Problem statement and scope
- **plan.md**: Solution approach and phases
- **tasks.md**: Actionable implementation steps
- **memory/**: Session context files (auto-generated)

Every conversation that modifies files MUST have a spec folder.
```

---

### P0-10: Wrong Script Example
**Agent:** 7
**Impact:** Script invocation fails when following documentation
**Current Example (WRONG):**
```bash
.opencode/skill/system-spec-kit/scripts/create-spec-folder.sh 007-feature-name 2
```
**Correct Usage:**
```bash
.opencode/skill/system-spec-kit/scripts/create-spec-folder.sh "Add feature" --short-name feature-name --level 2
```
**File:** `.opencode/skill/system-spec-kit/SKILL.md:694-695`

**Fix:** Update documentation to match actual script interface

---

### P0-11: OpenCode CLI Not Documented
**Agent:** 17
**Impact:** Users can't use the framework - no installation guide
**Current:** Docs assume OpenCode CLI exists and is installed
**Missing:** "Step 0: Install OpenCode" in all onboarding paths

**Fix:** Add to README.md:
```markdown
## Prerequisites

1. **OpenCode CLI** (required)
   ```bash
   npm install -g opencode
   # or
   npx opencode
   ```
   
2. **Node.js** v18+ for memory scripts
3. **Git** for version control integration
```

---

### P0-12: Missing .gitattributes
**Agent:** 19
**Impact:** CRLF line ending issues on Windows cause script failures
**Current:** No `.gitattributes` file in repository

**Fix:** Create `.gitattributes`:
```
# Shell scripts must use LF
*.sh text eol=lf

# JavaScript can be cross-platform
*.js text eol=auto

# Markdown standardized
*.md text eol=auto
```

---

## P1 Issues (Confusing) - High Priority

### P1-1: Decay Formula Contradiction
**Agents:** 1, 3, 16, 20
**Impact:** Documentation gives incorrect half-life value
**AGENTS.md says:** "90-day half-life"
**SKILL.md says:** "~62-day half-life"
**Math verification:** e^(-days/90) → half-life = 90 × ln(2) ≈ 62.38 days

**SKILL.md is CORRECT.** The formula uses 90-day time constant, not 90-day half-life.

**Files to Fix:**
- `AGENTS.md:3` (description line) - Change to "~62-day half-life"
- Any other references to "90-day half-life"

---

### P1-2: Command Notation Inconsistency
**Agents:** 12, 13, 14, 15, 20
**Impact:** Users don't know which command format to use
**Current Mix:**
- `/memory/save` (slash notation)
- `/memory:save` (colon notation)
- `memory:save` (no leading slash)

**Standard to Adopt:** `/memory:save` (colon notation with leading slash)

**Files Requiring Updates:**
- All command `.md` files in `.opencode/command/`
- SKILL.md files referencing commands
- AGENTS.md command references

---

### P1-3: No Global Help Command
**Agent:** 15
**Impact:** Users can't discover available commands
**Current:** Only `/spec_kit:help` exists
**Fix:** Create global `/help` command that lists:
- All command namespaces (memory, spec_kit, search)
- Brief description of each
- How to get namespace-specific help

---

### P1-4: Missing Quickstart
**Agents:** 2, 8, 17
**Impact:** 1400+ lines of documentation before first actionable instruction
**Current:** Users must read entire SKILL.md to get started
**Fix:** Create QUICKSTART.md (target: 5-minute path to first success)

```markdown
# Quickstart (5 minutes)

## 1. Create your first spec folder
/spec_kit:plan "Add user login"

## 2. Implement with tracking
/spec_kit:implement

## 3. Save your context
/memory:save

Done! You now have documented, searchable work.
```

---

### P1-5: Missing Namespace Help Commands
**Agent:** 15
**Current:** No `/memory:help`, `/search:help` commands exist
**Fix:** Add help commands to each namespace:
- `/memory:help` - List all memory commands with brief descriptions
- `/search:help` - List search-related commands
- `/spec_kit:help` - Already exists, verify completeness

---

### P1-6: Undocumented Templates
**Agents:** 9, 11
**Missing from template_guide.md:**
- `quickstart.md` - Rapid-start documentation
- `spike.md` - Technical investigation template
- `data-model.md` - Database/schema documentation
- `planning-summary.md` - Planning phase summary
- `implementation-summary.md` - Implementation phase summary

**Fix:** Document each template with:
- Purpose
- When to use
- Example filled content

---

### P1-7: Anchor Format Inconsistency
**Agents:** 3, 11
**Current Mix:**
- `ANCHOR_START/ANCHOR_END` (legacy)
- `<!-- ANCHOR:id -->` / `<!-- /ANCHOR:id -->` (current standard)

**Standard (from SKILL.md):**
```html
<!-- ANCHOR:anchor-id -->
Content here...
<!-- /ANCHOR:anchor-id -->
```

**Files to Audit:**
- All existing memory files in `specs/*/memory/`
- Template files that generate anchors

---

### P1-8: Missing Gate 4 in resume.md
**Agent:** 20
**Impact:** Resume command doesn't offer memory loading options per Gate 4
**Current:** `resume.md` has memory loading but doesn't present explicit A/B/C/D options
**Location:** `.opencode/command/spec_kit/resume.md`

**Fix:** Add explicit Gate 4 implementation:
```markdown
## Memory Loading (Gate 4)
Found N memory files. Which would you like to load?
  A) Recent - Most recent file only
  B) All - Load all (1-3 files)
  C) Select - Choose specific files
  D) Skip - Continue without loading
```

---

### P1-9: Wrong Tool Name in AGENTS.md
**Agent:** 16
**Current (line 543):** `leann_ask()`
**Correct:** `leann_leann_ask()`
**File:** `AGENTS.md:543`

**Fix:** Update to correct MCP tool naming convention

---

### P1-10: Missing mcp-narsil in System Prompt
**Agent:** 16
**Current:** mcp-narsil not listed in available_skills
**Impact:** Skill advisor won't route to mcp-narsil
**File:** System prompt `available_skills` section

**Fix:** Add mcp-narsil to available skills list if it should be discoverable

---

### P1-11: SKILL.md Sections Out of Order
**Agent:** 1, 7
**Impact:** Readers get lost navigating long files
**Current:** Sections jump between concepts without logical flow
**Fix:** Standardize section order:
1. When to Use
2. Smart Routing
3. How It Works
4. Quick Reference
5. Commands
6. Configuration
7. Troubleshooting

---

### P1-12: Missing Error Codes
**Agent:** 18
**Impact:** Users can't search for specific errors
**Current:** Error messages are prose without identifiers
**Fix:** Add error codes:
```
E001: Spec folder not found
E002: Memory file format invalid
E003: Anchor extraction failed
E004: Embedding generation failed
```

---

### P1-13: No Troubleshooting Section in Commands
**Agent:** 18
**Current:** Command files lack troubleshooting guidance
**Fix:** Add to each command file:
```markdown
## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| "Spec folder not found" | Path invalid | Check `specs/` directory |
| "No memories found" | Database empty | Run `memory_index_scan` |
```

---

### P1-14: Inconsistent Status Output Format
**Agent:** 12, 13
**Current Mix:**
- `STATUS=OK PATH=...` (equals notation)
- `Status: OK, Path: ...` (label notation)
- `✅ Success` (emoji notation)

**Standard to Adopt:** `STATUS=OK KEY=value` (machine-parseable)

---

### P1-15: Gate 3 Not Enforced in All Commands
**Agent:** 14, 20
**Current:** Some commands bypass Gate 3 spec folder question
**Fix:** Audit all commands for Gate 3 compliance

---

### P1-16: No Command Aliases Documented
**Agent:** 15
**Impact:** Power users can't use shortcuts
**Current:** Only full command names documented
**Fix:** Document aliases if they exist, or create them:
- `/m:s` → `/memory:save`
- `/m:search` → `/memory:search`
- `/sk:plan` → `/spec_kit:plan`

---

### P1-17: Missing Search Query Syntax Guide
**Agent:** 2
**Impact:** Users don't know advanced search options
**Current:** Only basic examples shown
**Fix:** Document:
- Boolean operators (AND, OR)
- Field filters (`tier:critical`, `type:decision`)
- Date ranges
- Concept combinations

---

### P1-18: Constitutional Memory Not Explained
**Agents:** 1, 5
**Impact:** Users don't understand the tier system
**Current:** Constitutional tier mentioned but purpose unclear
**Fix:** Add explanation:
```markdown
### Constitutional Memories
Always surface at top of search results. Use for:
- Critical project rules that must never be forgotten
- Gate enforcement reminders
- Universal constraints
```

---

### P1-19: No Memory File Examples
**Agent:** 2
**Impact:** Users don't know what output looks like
**Current:** Format described but no complete example
**Fix:** Add example memory file showing all sections

---

### P1-20: Checklist Priority Levels Unclear
**Agent:** 7
**Current:** P0/P1/P2 definitions exist but enforcement unclear
**Fix:** Add enforcement rules:
```markdown
- P0: HARD BLOCKER - Cannot claim done until complete
- P1: Must complete OR get explicit user approval to defer
- P2: Can defer without approval
```

---

### P1-21: Missing Sub-Folder Versioning Examples
**Agent:** 11
**Impact:** Users don't know when/how to use sub-folders
**Current:** Pattern described but examples minimal
**Fix:** Add real-world example showing progression:
```
specs/007-auth/
├── 001-initial/ (complete)
├── 002-oauth/ (complete)
└── 003-mfa/ (in progress)
```

---

### P1-22: No Database Maintenance Guide
**Agent:** 6
**Impact:** Database grows unbounded, performance degrades
**Current:** No cleanup or maintenance documentation
**Fix:** Document:
- Recommended cleanup frequency
- Database location
- Backup procedures
- Recovery from corruption

---

### P1-23: Embedding Model Not Documented
**Agent:** 5, 6
**Current:** Uses embeddings but model not specified
**Fix:** Document which embedding model is used and any limitations

---

### P1-24: Memory Search Relevance Scoring Opaque
**Agent:** 3
**Impact:** Users don't understand why results are ranked
**Current:** Score shown but calculation unexplained
**Fix:** Document scoring factors:
- Semantic similarity weight
- Decay factor application
- Tier boost values

---

### P1-25: Missing Checkpoint Best Practices
**Agent:** 12
**Current:** Operations documented but strategy unclear
**Fix:** Add guidance:
```markdown
## Best Practices
- Create checkpoint before major refactors
- Name checkpoints descriptively: "pre-auth-refactor"
- Clean up old checkpoints monthly
- Don't rely on checkpoints for deleted memories
```

---

### P1-26: No Validation Output Explained
**Agent:** 10
**Impact:** Exit codes unexplained
**Current:** Validation runs but output meaning unclear
**Fix:** Document exit codes:
- Exit 0: Pass
- Exit 1: Warnings (non-blocking)
- Exit 2: Errors (must fix)

---

### P1-27: Parallel Dispatch Config Undocumented
**Agent:** 10
**Location:** `assets/parallel_dispatch_config.md`
**Current:** Referenced but content not documented in SKILL.md
**Fix:** Add summary of dispatch patterns and agent assignments

---

### P1-28: No Version History
**Agent:** 8
**Impact:** Users don't know what changed between versions
**Current:** Version number exists but no changelog
**Fix:** Add CHANGELOG.md or version history section

---

### P1-29: Mixed Execution Modes Confusing
**Agent:** 13
**Current:** AUTONOMOUS vs INTERACTIVE vs CONFIRM described inconsistently
**Fix:** Create consistent mode definitions:
- AUTONOMOUS: No prompts, uses defaults
- INTERACTIVE: Prompts at key decisions
- CONFIRM: Prompts at every step

---

### P1-30: Context Compaction (Gate 0) UX Unclear
**Agent:** 16
**Impact:** Users don't understand what to do when triggered
**Current:** Shows message but next steps vague
**Fix:** Improve message with explicit action items

---

### P1-31: No Worked Examples for Common Scenarios
**Agent:** 8
**Current:** `worked_examples.md` exists but may be incomplete
**Fix:** Ensure coverage of:
- New feature implementation
- Bug fix workflow
- Research spike
- Session handover
- Debug delegation

---

### P1-32: Memory Tier Thresholds Not Documented
**Agent:** 3
**Current:** Tiers exist but promotion criteria unclear
**Fix:** Document thresholds:
- 90% confidence → Eligible for promotion
- 3+ validations → Consider for critical
- Constitutional: Manual only

---

### P1-33: No Cross-Reference Between Commands and Skills
**Agent:** 14
**Impact:** Users don't know which skill a command uses
**Fix:** Add "Powered by" section to commands:
```markdown
**Skill:** system-memory
**Documentation:** .opencode/skill/system-memory/SKILL.md
```

---

### P1-34: resume.md Uses Correct Tool Names (GOOD)
**Agent:** 20
**Note:** resume.md lines 367-372 correctly use `semantic_memory_memory_search` format
**This is the CORRECT pattern** - other commands should match this

---

### P1-35: YAML Prompt Loading Not Explained
**Agent:** 13
**Current:** Commands reference YAML files but loading mechanism unclear
**Fix:** Document the YAML prompt system:
- Where YAML files live
- How they're loaded
- What parameters are passed

---

## P2 Issues (Friction) - Medium Priority

### Documentation Structure (P2-1 through P2-10)

| ID | Issue | Location | Fix |
|----|-------|----------|-----|
| P2-1 | TOC missing in long files | SKILL.md files | Add table of contents |
| P2-2 | No visual diagrams | All skills | Add ASCII flowcharts |
| P2-3 | Code examples too verbose | Throughout | Shorten, add comments |
| P2-4 | No "Common Mistakes" section | SKILL.md | Add anti-patterns |
| P2-5 | Links to non-existent files | Throughout | Audit and fix |
| P2-6 | Inconsistent heading levels | Throughout | Standardize |
| P2-7 | No progressive disclosure | SKILL.md | Collapse advanced topics |
| P2-8 | Missing keyboard shortcuts | Commands | Document if they exist |
| P2-9 | No dark mode considerations | Output examples | Test box drawings |
| P2-10 | Redundant content between files | SKILL.md vs commands | Deduplicate |

### Error Handling (P2-11 through P2-20)

| ID | Issue | Location | Fix |
|----|-------|----------|-----|
| P2-11 | Generic error messages | generate-context.js | Add context to errors |
| P2-12 | Silent failures | retry-manager.js | Add logging |
| P2-13 | No retry on network errors | embeddings.js | Add retry logic |
| P2-14 | JSON parse errors unhelpful | generate-context.js | Show line number |
| P2-15 | No validation for JSON input | generate-context.js | Add schema validation |
| P2-16 | Missing file errors unclear | Commands | Suggest alternatives |
| P2-17 | No progress indicators | Long operations | Add spinners |
| P2-18 | Timeout values not configurable | MCP server | Add config options |
| P2-19 | No graceful shutdown | MCP server | Handle SIGTERM |
| P2-20 | Stack traces exposed to users | Error handling | Hide in production |

### UX Improvements (P2-21 through P2-35)

| ID | Issue | Location | Fix |
|----|-------|----------|-----|
| P2-21 | No confirmation on destructive ops | delete commands | Add [y/n] prompts |
| P2-22 | Box drawings broken on some terminals | Output formatting | Test compatibility |
| P2-23 | No color coding by severity | Status output | Add ANSI colors |
| P2-24 | Long paths truncated poorly | Display logic | Smart truncation |
| P2-25 | No date/time format options | Output | Allow user preference |
| P2-26 | Search results not paginated | memory_search | Add pagination |
| P2-27 | No "undo" for save operations | memory commands | Add undo hint |
| P2-28 | No diff view for updates | memory_update | Show before/after |
| P2-29 | No bulk operations | Commands | Add batch mode |
| P2-30 | No dry-run mode | Scripts | Add --dry-run flag |
| P2-31 | Missing tab completion | Commands | Document setup |
| P2-32 | No history navigation | Dashboard | Add back navigation |
| P2-33 | Dashboard doesn't refresh | memory search | Add refresh option |
| P2-34 | No export functionality | memory data | Add export command |
| P2-35 | No import functionality | memory data | Add import command |

### Configuration (P2-36 through P2-45)

| ID | Issue | Location | Fix |
|----|-------|----------|-----|
| P2-36 | Config files not validated | config.jsonc | Add JSON schema |
| P2-37 | No config reload | MCP server | Support hot reload |
| P2-38 | Hard-coded values | Throughout | Move to config |
| P2-39 | No environment variable support | Config | Add env var fallbacks |
| P2-40 | No config inheritance | Skills | Allow skill overrides |
| P2-41 | Missing config documentation | config.jsonc | Add inline comments |
| P2-42 | No config validation command | Scripts | Add validate-config.sh |
| P2-43 | Default values not documented | Config | Document all defaults |
| P2-44 | No config migration | Version upgrades | Add migration guide |
| P2-45 | Sensitive values in plain text | Config | Document secrets handling |

### Testing (P2-46 through P2-50)

| ID | Issue | Location | Fix |
|----|-------|----------|-----|
| P2-46 | No unit tests | Scripts | Add test suite |
| P2-47 | No integration tests | MCP server | Add e2e tests |
| P2-48 | No test data fixtures | Tests | Create fixtures |
| P2-49 | No CI/CD pipeline | Repository | Add GitHub Actions |
| P2-50 | No coverage reporting | Tests | Add coverage tool |

---

## P3 Issues (Nice-to-have) - Low Priority

### Polish (P3-1 through P3-20)

| ID | Issue | Fix |
|----|-------|-----|
| P3-1 | No logo/branding | Add ASCII logo to SKILL.md headers |
| P3-2 | Version badge not displayed | Add version badge to README |
| P3-3 | No contributor guidelines | Add CONTRIBUTING.md |
| P3-4 | No code of conduct | Add CODE_OF_CONDUCT.md |
| P3-5 | No license file | Add LICENSE |
| P3-6 | No issue templates | Add GitHub issue templates |
| P3-7 | No PR template | Add pull request template |
| P3-8 | Stats not visualized | Add ASCII charts for memory stats |
| P3-9 | No onboarding wizard | Create interactive setup command |
| P3-10 | No health check command | Add `/system:health` |
| P3-11 | No telemetry | Consider opt-in usage analytics |
| P3-12 | No benchmarks | Add performance benchmarks |
| P3-13 | No localization | English only currently |
| P3-14 | No accessibility audit | Check screen reader compatibility |
| P3-15 | No mobile considerations | Document terminal app compatibility |
| P3-16 | No video tutorials | Create walkthrough videos |
| P3-17 | No community showcase | Add examples from users |
| P3-18 | No plugin architecture | Consider extensibility |
| P3-19 | No update notifications | Alert users to new versions |
| P3-20 | No migration from other tools | Add import from Notion, etc. |

---

## Files Requiring Changes

### High Priority (P0/P1) - Sorted by Impact

| Priority | File | Issues | Changes Needed |
|----------|------|--------|----------------|
| **P0** | `.opencode/command/memory/save.md` | P0-1 | Replace 4+ MCP tool name instances |
| **P0** | `.opencode/command/memory/search.md` | P0-1 | Replace 10+ MCP tool name instances |
| **P0** | `.opencode/command/memory/load.md` | P0-1 | Replace 4+ MCP tool name instances |
| **P0** | `.opencode/command/memory/checkpoint.md` | P0-1 | Replace 8+ MCP tool name instances |
| **P0** | `README.md` (new) | P0-2, P0-11 | Create with intro + quickstart |
| **P0** | `opencode.json` | P0-3 | Add Windows path documentation |
| **P0** | `.gitattributes` (new) | P0-12 | Create for line ending control |
| **P0** | `.opencode/skill/system-memory/scripts/lib/retry-manager.js` | P0-5 | Fix getDb() calls |
| **P0** | `.opencode/skill/system-memory/scripts/generate-context.js` | P0-6 | Add spec folder validation |
| **P0** | `.opencode/skill/system-spec-kit/SKILL.md` | P0-7, P0-9, P0-10 | Multiple documentation fixes |
| **P0** | `.opencode/skill/system-spec-kit/templates/debug-delegation.md` | P0-8 | Standardize placeholders |
| **P1** | `AGENTS.md` | P1-1, P1-9 | Fix decay formula, tool name |
| **P1** | `.opencode/command/spec_kit/resume.md` | P1-8 | Add explicit Gate 4 |
| **P1** | `.opencode/skill/system-spec-kit/references/template_guide.md` | P1-6 | Document missing templates |

### Medium Priority (P2) - By Category

| Category | Files | Changes |
|----------|-------|---------|
| Error handling | Scripts in `lib/` | Add context, logging |
| Configuration | `config.jsonc`, `filters.jsonc` | Add validation, docs |
| Output formatting | Command files | Standardize STATUS format |
| Documentation | SKILL.md files | Add TOC, diagrams |

---

## Recommended Fix Order

### Week 1: P0 Critical (Estimated: 8-12 hours)

**Day 1-2: MCP Tool Naming (P0-1)**
- [ ] Fix all 4 memory command files
- [ ] Test each command works after fix
- [ ] Update any related documentation

**Day 2-3: Repository Setup (P0-2, P0-11, P0-12)**
- [ ] Create README.md with full content
- [ ] Create .gitattributes
- [ ] Document Windows requirements

**Day 3-4: Script Bugs (P0-5, P0-6)**
- [ ] Fix retry-manager.js getDb() issue
- [ ] Add spec folder validation to generate-context.js
- [ ] Test both fixes

**Day 4-5: Documentation Fixes (P0-7, P0-8, P0-9, P0-10)**
- [ ] Update template count
- [ ] Standardize placeholder format
- [ ] Add spec folder definition
- [ ] Fix script example

### Week 2: P1 High-Impact (Estimated: 12-16 hours)

**Day 1: Formula & Naming (P1-1, P1-9)**
- [ ] Fix decay formula in AGENTS.md
- [ ] Fix leann_ask → leann_leann_ask

**Day 2-3: Command Standardization (P1-2, P1-3, P1-5)**
- [ ] Standardize command notation
- [ ] Create global /help command
- [ ] Add namespace help commands

**Day 3-4: Documentation (P1-4, P1-6, P1-7)**
- [ ] Create QUICKSTART.md
- [ ] Document missing templates
- [ ] Standardize anchor format

**Day 5: Gate Compliance (P1-8, P1-15)**
- [ ] Add Gate 4 to resume.md
- [ ] Audit all commands for Gate 3

### Week 3+: P2/P3 Polish (Ongoing)

**Priority order:**
1. Error handling improvements (P2-11 through P2-20)
2. UX improvements (P2-21 through P2-35)
3. Configuration cleanup (P2-36 through P2-45)
4. Testing infrastructure (P2-46 through P2-50)
5. Nice-to-have polish (P3-1 through P3-20)

---

## Verification Checklist

After fixes are applied, verify:

- [ ] All memory commands work with correct MCP tool names
- [ ] README.md provides clear entry point
- [ ] Windows users can follow setup instructions
- [ ] Scripts run without errors
- [ ] Decay formula is consistent everywhere
- [ ] Command notation is standardized
- [ ] Gate 3/4 work correctly in all commands
- [ ] Templates are all documented
- [ ] New users can complete quickstart in <5 minutes

---

## Notes

### Agent Methodology
Each agent was given a focused scope and asked to:
1. Read all relevant files completely
2. Identify issues from a first-time user perspective
3. Categorize by severity (P0-P3)
4. Provide specific file:line references
5. Suggest concrete fixes

### Issue Overlap
Some issues were found by multiple agents, indicating high visibility/impact:
- MCP tool naming: 5 agents
- Decay formula: 4 agents
- Command notation: 5 agents
- Missing definitions: 3 agents

### Out of Scope
This analysis did NOT cover:
- Actual code logic correctness (beyond obvious bugs)
- Performance optimization
- Security vulnerabilities
- Third-party dependency issues

---

*Generated by 20-agent UX analysis - December 25, 2025*
