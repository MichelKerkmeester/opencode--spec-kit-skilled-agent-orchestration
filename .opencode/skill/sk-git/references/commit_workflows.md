---
title: Git Commit - Detailed Workflow Reference
description: Complete workflow documentation for professional commit practices with Conventional Commits.
---

# Git Commit - Detailed Workflow Reference

Complete workflow documentation for professional commit practices with Conventional Commits.

---

## 1. OVERVIEW

Systematically analyze changes, determine appropriate commit strategy, and craft professional commit messages following best practices. Ensures commits are atomic, well-documented, and exclude internal development artifacts.

**Core principle**: Atomic commits with clear intent + filtered artifacts = maintainable Git history

---

## 2. PROCESS OVERVIEW

1. Analyze all changed files (categorize, evaluate value, identify patterns)
2. Filter out internal artifacts and non-conventional files
3. Determine commit strategy (single/multiple commits)
4. Write commit message following Conventional Commits
5. Verify commit readiness with final checklist

**Key Principles**:
- **Atomic commits**: One logical change per commit
- **Public value**: Only commit files that benefit the project long-term
- **Conventional format**: Follow standard commit message structure
- **Self-contained**: Messages make sense without external context
- **Convention adherence**: Respect project structure and naming conventions

---

## 3. COMPLETE WORKFLOW

### Step 1: Analyze Changed Files

**Purpose**: Understand what has changed and categorize files

**Actions**:

1. **Get changed files**:
```bash
# Check both staged and unstaged changes
git status --short
git diff --name-only
git diff --cached --name-only
```

2. **Categorize file types**:
   - **Source code** (.py, .js, .ts, .java, etc.) - Require careful review
   - **Configuration** (.json, .yaml, .toml, etc.) - Check for breaking changes
   - **Documentation** (.md, .txt, .rst, etc.) - Evaluate public value
   - **Build/dependency** (package.json, requirements.txt, etc.) - May need separate commits
   - **Test files** (*test*, *spec*) - Should align with related code changes

3. **Evaluate file value**:
   - **Public value**: Benefits other developers or project maintenance?
   - **Internal artifacts**: Development process byproduct?
   - **Project necessity**: Essential for building, running, or understanding?
   - **Long-term relevance**: Will this be useful in 6 months?

**Validation**: `files_analyzed`

### Step 2: Filter Development Artifacts

**Purpose**: Exclude internal artifacts and non-conventional files

**Auto-Exclude Patterns**:

**Internal development artifacts**:
- Coverage reports, task lists, personal notes
- Temporary analysis files or debugging artifacts
- Internal planning documents or meeting notes
- IDE-specific configurations that don't benefit the team

**Non-conventional file placement**:
- Test files in root directory (should be in `tests/`, `__tests__/`, `test/`)
- Config files in wrong locations (check for `.github/`, `config/`, root conventions)
- Files violating naming conventions (camelCase, snake_case, kebab-case per language)
- Files breaking framework structure (Maven for Java, standard Python package layout, etc.)

**Critical Rule**: **Do NOT add artifacts to .gitignore** - simply exclude from commits

**Actions**:
```bash
# Review files for exclusion (don't stage these)
# Examples:
# - TASK_ANALYSIS.md (internal planning)
# - coverage_report.html (generated artifact)
# - debug_notes.txt (personal notes)
# - root_level_test.py (should be in tests/)
```

**Validation**: `artifacts_filtered`

### Step 3: Identify Change Patterns

**Purpose**: Determine if changes form cohesive logical unit

**Questions to Answer**:
- Are changes related to a single feature/fix?
- Are there multiple unrelated changes that should be split?
- Do changes affect multiple independent areas?
- Are there files that might cause merge conflicts?

**Change Pattern Types**:

1. **Cohesive (Single Commit)**:
   - All changes serve one purpose
   - Changes are interdependent
   - Single feature or fix
   - Related test updates

2. **Mixed (Multiple Commits)**:
   - Unrelated bug fixes
   - Feature + refactoring
   - Multiple independent changes
   - Different components affected

**Validation**: `patterns_identified`

### Step 4: Determine Commit Strategy

**Purpose**: Decide single vs. multiple commits

**Decision Logic**:

```markdown
IF all changes related to one feature/fix:
  → Single commit

IF changes affect multiple independent areas:
  → Multiple commits (one per logical unit)

IF mix of features, fixes, refactoring:
  → Split into separate commits by type

IF changes include both code and tests:
  → Single commit (tests belong with code)
```

**Staging Recommendations**:
- Use `git add <specific-files>` instead of `git add .`
- Stage related files together for atomic commits
- Review with `git diff --cached` before committing

**Validation**: `strategy_determined`

### Step 5: Write Commit Message

**Purpose**: Craft professional message following Conventional Commits

**Format**:
```
<type>(<optional scope>): <description>

[optional body]

[optional footer]
```

**Commit Types**:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code restructuring without changing functionality
- `docs` - Documentation changes
- `style` - Formatting, missing semicolons, etc.
- `test` - Adding or updating tests
- `chore` - Build process, auxiliary tools, etc.
- `perf` - Performance improvements
- `ci` - CI/CD changes

**Deterministic AI Commit Logic**:

1. **Type selection order** (first match wins):
   - `merge` for merge commits (`Merge ...`)
   - `release` for version/release subjects (`vX.Y.Z`, `release`)
   - `docs` for docs-only changes (README/CHANGELOG/docs paths)
   - `fix` for bug/security/hotfix/error correction
   - `feat` for new behavior or capabilities
   - `refactor` for non-behavioral restructuring
   - `test` for test-only changes
   - `chore` as fallback
2. **Scope selection order** (first match wins):
   - `.opencode/skill/<name>/...` -> `<name>`
   - `AGENTS.md` updates -> `agents`
   - `README.md`-only changes -> `readme`
   - `opencode.json` or `.utcp_config.json` -> `config`
   - `.opencode/agent/...` -> `agents`
   - `.opencode/command/...` -> `commands`
   - docs-only set -> `docs`
   - fallback -> dominant top-level area or `repo`
3. **Summary normalization**:
   - Remove legacy prefixes already in the subject (`feat(scope): ...`)
   - Keep concise and specific
   - Avoid trailing period
   - Preserve high-signal context tokens (version, issue id, skill name)

**Rules**:

1. **Subject line** (<type>(<scope>): <description>):
   - Use imperative mood ("add" not "added" or "adds")
   - Keep under 50 characters
   - No period at the end
   - Lowercase after colon
   - Be specific and descriptive

2. **Body** (optional but recommended):
   - Explain "what" and "why", not "how"
   - Wrap at 72 characters
   - Separate from subject with blank line
   - Can have multiple paragraphs

3. **Footer** (optional):
   - Breaking changes: `BREAKING CHANGE: description`
   - Issue references: `Fixes #123`, `Closes #456`

**Anti-Patterns to Avoid**:
- Internal task numbers in subject (e.g., "TASK-123: fix bug")
- Vague descriptions (e.g., "fix stuff", "update files")
- Technical implementation details in subject
- Project-specific jargon without context
- Multiple unrelated changes in one commit

**Examples**:

**Good - Feature**:
```
feat(auth): add OAuth2 login support

Implements OAuth2 authentication flow to replace basic auth.
Improves security and enables SSO integration.
```

**Good - Bug Fix**:
```
fix: resolve memory leak in data processing

Large datasets were not being properly garbage collected
after processing, causing memory usage to grow over time.
```

**Good - Refactor**:
```
refactor(api): extract validation logic to middleware

Moves input validation from route handlers to reusable
middleware. Reduces code duplication and improves testability.
```

**Bad - Vague**:
```
fix: update stuff

Changed some files.
```

**Bad - Internal Reference**:
```
feat: TASK-456 new feature

Implemented the thing from the task.
```

**Validation**: `message_written`

### Step 6: Verify Commit Readiness

**Purpose**: Final checklist before committing

**Checklist**:
```markdown
□ Only files with public value are staged
□ Internal development artifacts excluded
□ Non-conventional files skipped
□ All related changes staged together
□ Commit message follows Conventional Commits format
□ Message is clear to external developers (no jargon)
□ No sensitive information (passwords, keys, tokens)
□ Changes are logically grouped (atomic commit)
□ Tests pass (if applicable)
```

**Actions**:
```bash
# Review staged changes
git diff --cached

# Check commit message
git commit -v  # Opens editor with diff

# Or commit directly
git commit -m "type(scope): description" -m "Body explaining why"
```

**Validation**: `commit_ready`

---

## 4. DECISION MATRIX

| Scenario | Strategy | Commit Type | Notes |
|----------|----------|-------------|-------|
| Single feature with tests | Single commit | `feat` | Tests belong with feature |
| Bug fix + unrelated refactor | Multiple commits | `fix`, `refactor` | Separate concerns |
| Documentation only | Single commit | `docs` | Unless multiple unrelated topics |
| Multiple independent fixes | Multiple commits | `fix` (each) | One fix per commit |
| Feature + breaking change | Single commit | `feat` | Note breaking change in footer |
| Internal artifacts present | Exclude artifacts | N/A | Don't commit, don't add to .gitignore |
| Test files in wrong location | Exclude from commit | N/A | Fix structure first |
| Config + code changes | Single commit (if related) | `feat` or `fix` | Or split if config is breaking change |

---

## 5. COMMON MISTAKES

**Including internal artifacts**:
- **Problem**: Task lists, debug notes, coverage reports in commits
- **Fix**: Exclude these files; don't add to .gitignore

**Using `git add .` blindly**:
- **Problem**: Stages everything including artifacts and non-conventional files
- **Fix**: Use `git add <specific-files>` for targeted staging

**Vague commit messages**:
- **Problem**: "fix bug", "update code", "changes"
- **Fix**: Be specific about what and why

**Mixing unrelated changes**:
- **Problem**: Feature + refactor + fix in one commit
- **Fix**: Split into multiple atomic commits

**Internal references in messages**:
- **Problem**: "TASK-123: implement feature"
- **Fix**: Write self-contained messages for external developers

**Committing non-conventional files**:
- **Problem**: Test files in root, misplaced configs
- **Fix**: Exclude and fix structure before committing

**Breaking changes without notice**:
- **Problem**: Breaking API changes without `BREAKING CHANGE:` footer
- **Fix**: Always document breaking changes in commit footer

---

## 6. EXAMPLE WORKFLOWS

### Example 1: Single Feature Commit

```text
User: "I've added user authentication, ready to commit"

Agent: "I'll analyze the changes using the git-commit skill."

[Step 1: Analyze changed files]
> git status --short
 M src/auth/login.js
 M src/auth/middleware.js
 A tests/auth.test.js
 M package.json
 A TASK_NOTES.md

[Step 2: Filter artifacts]
Excluding: TASK_NOTES.md (internal planning document)

[Step 3: Identify patterns]
All changes related to authentication feature

[Step 4: Determine strategy]
Strategy: Single commit (cohesive feature)

[Step 5: Write message]
Suggested commit message:

feat(auth): add user authentication system

Implements JWT-based authentication with login and middleware.
Adds token validation and user session management.

[Step 6: Verify readiness]
✓ Only public value files staged
✓ Artifacts excluded
✓ Message follows conventions
✓ Changes are atomic

Ready to commit:
> git add src/auth/ tests/auth.test.js package.json
> git commit -m "feat(auth): add user authentication system" \
    -m "Implements JWT-based authentication with login and middleware.
Adds token validation and user session management."
```

### Example 2: Multiple Commits (Mixed Changes)

```text
User: "Made several changes - fixed a bug, refactored some code, and updated docs"

Agent: "I'll analyze and recommend splitting into separate commits."

[Step 1: Analyze changed files]
> git status --short
 M src/api/handler.js          # Bug fix
 M src/utils/validator.js      # Refactor
 M docs/API.md                  # Documentation
 A debug_output.txt             # Artifact

[Step 2: Filter artifacts]
Excluding: debug_output.txt (temporary debugging file)

[Step 3: Identify patterns]
Three unrelated changes detected:
- Bug fix in handler
- Refactoring in validator
- Documentation update

[Step 4: Determine strategy]
Strategy: Three separate commits

[Step 5: Write messages]

Commit 1 - Bug Fix:
fix(api): handle null response in error handler

Prevents crash when error response body is null.
Adds null check before accessing response properties.

Commit 2 - Refactor:
refactor(utils): extract validation rules to constants

Moves hard-coded validation patterns to shared constants.
Improves maintainability and reduces duplication.

Commit 3 - Documentation:
docs: update API error response format

Documents the null handling behavior in error responses.
Adds examples for common error scenarios.

[Step 6: Execute commits]
> git add src/api/handler.js
> git commit -m "fix(api): handle null response in error handler" ...

> git add src/utils/validator.js
> git commit -m "refactor(utils): extract validation rules to constants" ...

> git add docs/API.md
> git commit -m "docs: update API error response format" ...
```

### Example 3: Excluding Non-Conventional Files

```text
User: "Ready to commit my new test suite"

Agent: "I'll check the file structure before committing."

[Step 1: Analyze changed files]
> git status --short
 A tests/user.test.js          # Correct location
 A tests/api.test.js           # Correct location
 A test_helper.py              # Root level (wrong!)
 A src/coverage_report.html    # Artifact

[Step 2: Filter artifacts and non-conventional files]
Excluding: src/coverage_report.html (generated artifact)
Excluding: test_helper.py (test file in root - should be in tests/)

Notice: test_helper.py violates project structure conventions.
Please move to tests/ directory before committing.

[Step 3: Proceed with conventional files only]
Staging: tests/user.test.js, tests/api.test.js

[Step 5: Write message]
test: add user and API test suites

Implements comprehensive test coverage for user management
and API endpoints. Includes happy path and error scenarios.

[Step 6: Commit]
> git add tests/user.test.js tests/api.test.js
> git commit -m "test: add user and API test suites" ...

Action Required: Please move test_helper.py to tests/ before next commit.
```

---

## 7. TROUBLESHOOTING

### Cannot Determine Commit Scope

**Symptom**: Changes span multiple unrelated areas

**Actions**:
1. List all changed files by category
2. Ask user: "These changes affect multiple areas. Should I split into separate commits?"
3. If split: Create one commit per logical area
4. If single: Use general scope or omit scope

### Internal Artifacts Keep Getting Staged

**Symptom**: `git add .` stages unwanted files

**Solutions**:
```bash
# Unstage specific files
git reset HEAD TASK_NOTES.md debug_output.txt

# Use targeted staging instead
git add src/ tests/  # Stage only specific directories
```

### Commit Message Too Long

**Symptom**: Subject line exceeds 50 characters

**Fix**:
- Move details to body
- Use shorter, more concise language
- Example:
  - Too long: "Add new user authentication system with JWT tokens and middleware"
  - Better: "feat(auth): add JWT authentication system"

### Breaking Change Not Documented

**Symptom**: API change breaks backward compatibility

**Fix**:
```
feat(api): change response format to JSON

Standardizes all API responses to use JSON format.
Removes support for XML responses.

BREAKING CHANGE: XML response format no longer supported.
Clients must update to handle JSON responses.
```

### Tests Failing Before Commit

**Symptom**: Test suite has failures

**Actions**:
1. Report failures: "Tests are failing. Fix before committing?"
2. If fix: Address failures first
3. If skip (rare): Document in commit message why tests are failing
4. Never commit broken tests without acknowledgment

---

## 8. SUCCESS CRITERIA

**Commit is successful when**:
- ✅ All changed files analyzed and categorized
- ✅ Internal artifacts filtered out
- ✅ Non-conventional files excluded
- ✅ Commit strategy determined (single/multiple)
- ✅ Message follows Conventional Commits format
- ✅ Subject under 50 characters, imperative mood
- ✅ Body explains "what" and "why" (when applicable)
- ✅ No sensitive information included
- ✅ Changes are atomic and logically grouped
- ✅ Tests pass (or failures acknowledged)

**Quality gates**:
- Only files with public value are committed
- Artifacts remain in workspace but not in Git
- Message is self-contained and clear to external developers
- Commit represents one logical change

---

## 9. RELATED RESOURCES

### Reference Files
- [worktree_workflows.md](./worktree_workflows.md) - Create isolated git workspaces with minimal branching
- [finish_workflows.md](./finish_workflows.md) - Complete development work with structured integration options
- [quick_reference.md](./quick_reference.md) - One-page cheat sheet for all git workflows
- [shared_patterns.md](./shared_patterns.md) - Common patterns and conventions across workflows

### External Resources
- [Conventional Commits Specification](https://www.conventionalcommits.org/) - Standard commit message format
- [Git Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project) - Pro Git book chapter on contributing
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) - The seven rules of great commits
- [Semantic Versioning](https://semver.org/) - Version numbering based on changes
