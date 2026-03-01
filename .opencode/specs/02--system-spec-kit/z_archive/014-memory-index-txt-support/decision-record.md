---
title: "Decision Record: Memory Index TXT File Support [131-memory-index-txt-support/decision-record]"
description: "The memory indexing system currently discovers .md files via three functions: findMemoryFiles(), findSkillReadmes(), and findProjectReadmes(). We need to add .txt file support. ..."
trigger_phrases:
  - "decision"
  - "record"
  - "memory"
  - "index"
  - "txt"
  - "decision record"
  - "131"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Memory Index TXT File Support

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Unified File Discovery vs Separate Paths

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | Implementation Team |

---

### Context

The memory indexing system currently discovers `.md` files via three functions: `findMemoryFiles()`, `findSkillReadmes()`, and `findProjectReadmes()`. We need to add `.txt` file support. Two architectural approaches:

1. **Unified Discovery**: Modify existing functions to accept both `.md` and `.txt` in a single pass
2. **Separate Discovery**: Create parallel functions (`findMemoryFilesTxt()`, `findSkillReadmesTxt()`) for `.txt` files

### Constraints
- Must preserve all existing `.md` behavior (zero regressions)
- Performance: minimize directory traversal overhead
- Maintainability: code should be simple to understand and modify
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Use unified discovery—modify existing functions to accept both `.md` and `.txt` extensions in a single directory traversal.

**Details**: Each discovery function will check for both extensions using an extension array or regex pattern (e.g., `/\.(md|txt)$/`). No new functions will be created specifically for `.txt` files.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unified Discovery** | Single traversal, simpler code, easier maintenance | Functions become slightly more complex | 8/10 |
| Separate Discovery | Clear separation, easier to disable `.txt` | Duplicates traversal logic, harder to maintain | 4/10 |
| Plugin Architecture | Maximum flexibility, extensible | Over-engineered for 2 file types | 3/10 |

**Why Chosen**: Unified approach minimizes code duplication and directory traversal overhead. The complexity increase is minimal (adding one extension check), while maintenance burden is significantly reduced.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Single directory traversal reduces I/O overhead
- Less code duplication = easier maintenance
- Consistent behavior for `.md` and `.txt` files
- Simple to add more extensions in future (e.g., `.rst`)

**Negative**:
- Discovery functions become slightly more complex - Mitigation: Use clear extension array constants

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Extension check logic error | M | Comprehensive test coverage for both extensions |
| Performance regression | L | Benchmarks show <5% overhead for additional check |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving actual need: command docs not discoverable |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 3 alternatives (unified, separate, plugin) |
| 3 | **Sufficient?** | PASS | Simplest approach that solves the problem |
| 4 | **Fits Goal?** | PASS | Directly enables `.txt` indexing without complexity |
| 5 | **Open Horizons?** | PASS | Extensible to future file types via same pattern |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `memory-index.ts`: All discovery functions
- `memory-save.ts`: Path validation regex

**Rollback**: Revert changes to discovery functions, restart MCP server
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Command Invocation Safeguard Strategy

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | Implementation Team |

---

### Context

Command folders (`.opencode/command/*/`) contain slash command definitions that can be invoked by reading and executing their configuration. Indexing `README.txt` files in these folders poses a risk: if the indexing process executes command invocation logic, it could trigger side effects (e.g., spawning processes, modifying state).

### Constraints
- Indexing must be side-effect-free (read-only operation)
- Command invocation is legitimate during normal usage (we cannot disable it globally)
- Must not break existing command infrastructure
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Use read-only file operations exclusively in indexing flow and add explicit test to verify command invocation does NOT occur.

**Details**: All file access in `memory-index.ts` and `memory-save.ts` uses `fs.readFileSync` or `fs.promises.readFile` (read-only). No code paths execute file contents or invoke command dispatch logic. A vitest test will verify that indexing a command folder does NOT trigger command execution.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read-only operations + test** | Simple, verifiable, no side effects | Requires manual verification | 9/10 |
| Exclude command folders entirely | Zero risk of invocation | Defeats the purpose (we want these docs) | 2/10 |
| Feature flag for command indexing | User control, gradual rollout | Adds complexity, flag management overhead | 6/10 |
| Sandboxed execution environment | Maximum isolation | Over-engineered, significant complexity | 3/10 |

**Why Chosen**: Read-only operations are the simplest and most direct solution. The indexing code path already avoids execution logic, and a test provides regression protection.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Indexing remains pure read operation (no side effects)
- Test coverage provides long-term safety
- No changes to command invocation infrastructure

**Negative**:
- Requires manual verification during testing - Mitigation: Automated test checks for invocation absence

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Accidental command execution | H | Test verifies no execution, code review for execute calls |
| Test fails to catch edge case | M | Manual inspection during implementation |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must prevent side effects from indexing |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 alternatives |
| 3 | **Sufficient?** | PASS | Read-only ops sufficient to prevent execution |
| 4 | **Fits Goal?** | PASS | Enables safe indexing of command docs |
| 5 | **Open Horizons?** | PASS | Test pattern reusable for future risky paths |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- `memory-index.ts`: File discovery (read-only operations)
- `memory-save.ts`: File reading (read-only operations)
- `tests/handler-memory-index.vitest.ts`: New test for invocation absence

**Rollback**: N/A - no changes to command invocation logic
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Path Validation Extension Strategy

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | Implementation Team |

---

### Context

`memory-save.ts` validates file paths to ensure only allowed locations are indexed. Current regex requires `.md` extension and specific path prefixes (specs/, .opencode/skill/, etc.). We need to allow `.txt` files while maintaining security boundaries (no arbitrary file system access).

### Constraints
- Security: must not allow indexing of arbitrary `.txt` files (e.g., system files, /tmp/)
- Compatibility: must not break existing `.md` validation
- Simplicity: should be a minimal change
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Update regex to accept `.txt` extension only for allowed paths using explicit OR condition: `\.(md|txt)$`.

**Details**: The path validation regex in `indexMemoryFile()` will be modified to accept both `.md` and `.txt` extensions. Path prefix checks (specs/, .opencode/skill/, .opencode/command/) remain unchanged. Example regex: `/(specs\/.*\/memory\/.*|\.opencode\/skill\/.*|\.opencode\/command\/.*)\.(md|txt)$/`.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Regex extension** | Minimal change, preserves structure | Regex slightly longer | 9/10 |
| Remove extension check | Simple | Allows arbitrary file types (security risk) | 1/10 |
| Separate validation function | Clear separation | Code duplication, harder to maintain | 5/10 |
| Allowlist by path | Maximum control | Complex, hard to extend | 6/10 |

**Why Chosen**: Regex extension is the most surgical change. It preserves existing validation logic while adding `.txt` support with minimal risk.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Security boundary unchanged (path prefixes still enforced)
- Minimal code change reduces risk
- Easy to add more extensions in future (e.g., `\.(md|txt|rst)$`)

**Negative**:
- Regex becomes slightly longer - Mitigation: Negligible, still readable

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Regex too permissive | H | Explicit path prefix checks remain enforced |
| Extension check bypassed | M | Test coverage for disallowed paths |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must allow `.txt` to pass validation |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 alternatives |
| 3 | **Sufficient?** | PASS | Regex extension sufficient to enable `.txt` |
| 4 | **Fits Goal?** | PASS | Directly enables path validation for `.txt` |
| 5 | **Open Horizons?** | PASS | Pattern extensible to future file types |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- `memory-save.ts`: Path validation regex (line ~1029)

**Rollback**: Revert regex change to `.md` only
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Importance Weight for `.txt` Files

<!-- ANCHOR:adr-004-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | Implementation Team |

---

### Context

Memory files have importance weights that influence search ranking. Spec documents (spec.md, plan.md) have higher weights, while README files have reduced weight (0.3) to avoid outranking user work. We must decide the importance weight for `.txt` files.

### Constraints
- `.txt` files are primarily reference documentation (like READMEs)
- Should not outrank spec documents or user memories
- Must be consistent with existing importance weight patterns
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Assign importance weight of 0.3 to all `.txt` files (same as README.md files).

**Details**: Follow the precedent set by README indexing (see ADR-003 in Spec 126): `.txt` files are reference documentation and should have reduced importance. This prevents command `README.txt` files from outranking spec folder documentation.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reduced weight (0.3)** | Consistent with README precedent, doesn't outrank specs | Lower priority in search | 9/10 |
| Normal weight (1.0) | Equal priority with user memories | Could outrank important specs | 4/10 |
| Very low weight (0.1) | Never interferes with search | Might be too invisible | 5/10 |
| Dynamic weight by path | Flexible | Complex, hard to reason about | 3/10 |

**Why Chosen**: Reduced weight (0.3) is consistent with existing README handling and aligns with the reference documentation role of `.txt` files.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- Consistent with README.md weighting (maintains pattern)
- Prevents `.txt` files from dominating search results
- Simple to implement (single constant)

**Negative**:
- None identified

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Weight too low, docs invisible | L | Search tests verify `.txt` files appear in results |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must assign weight to enable ranking |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 weight options |
| 3 | **Sufficient?** | PASS | Single weight value sufficient |
| 4 | **Fits Goal?** | PASS | Enables discovery without outranking specs |
| 5 | **Open Horizons?** | PASS | Weight can be adjusted if needed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**Affected Systems**:
- `memory-save.ts`: Importance weight assignment (similar to README logic)

**Rollback**: Change weight to 1.0 (normal) if needed
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
-->
