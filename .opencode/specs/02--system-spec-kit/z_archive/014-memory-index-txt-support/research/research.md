---
title: "Research: Memory Index TXT File Support [131-memory-index-txt-support/research]"
description: "This research document captures technical investigation into adding .txt file indexing support to the Spec Kit Memory system. Focus areas: command folder structure, existing fil..."
trigger_phrases:
  - "research"
  - "memory"
  - "index"
  - "txt"
  - "file"
  - "131"
importance_tier: "normal"
contextType: "research"
---
# Research: Memory Index TXT File Support

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: research | v2.2 -->

---

<!-- ANCHOR:overview -->
## OVERVIEW

This research document captures technical investigation into adding `.txt` file indexing support to the Spec Kit Memory system. Focus areas: command folder structure, existing file discovery patterns, path validation logic, and command invocation safeguards.

**Date**: 2026-02-16
**Status**: Complete
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:findings -->
## KEY FINDINGS

### Finding 1: Command Folder Documentation Uses `.txt` Format

**Context**: Slash command documentation is stored in `.opencode/command/**/README.txt` files with frontmatter metadata (title, description, trigger phrases).

**Evidence**:
- `.opencode/command/spec_kit/README.txt` contains 223 lines of structured documentation
- `.opencode/command/memory/README.txt` contains memory command reference
- All command READMEs use `.txt` extension (not `.md`)

**Significance**: These files are currently invisible to `memory_index_scan`, creating a documentation discovery gap.

**Source**: [Read tool output, line 1-223 of command/spec_kit/README.txt]

---

### Finding 2: File Discovery Uses Extension-Based Filtering

**Context**: Memory indexing discovers files via three functions: `findMemoryFiles()`, `findSkillReadmes()`, and `findProjectReadmes()` (the latter was expanded to include `.opencode/command/` paths).

**Evidence**:
```typescript
// From memory-index.ts:247
if (file.isFile() && file.name.endsWith('.md')) {
  if (file.name.toLowerCase() === 'readme.md') continue;
  results.push(path.join(constitutionalDir, file.name));
}

// From memory-index.ts:289
} else if ((entry.isFile() || entry.isSymbolicLink()) && entry.name.toLowerCase() === 'readme.md') {
  results.push(fullPath);
}
```

**Significance**: All discovery functions use `.endsWith('.md')` or explicit filename checks. Adding `.txt` requires modifying these checks to accept both extensions.

**Source**: [grep output, memory-index.ts lines 247, 289]

---

### Finding 3: Path Validation Enforces Extension and Location

**Context**: `memory-save.ts` validates paths before indexing to prevent arbitrary file system access.

**Evidence**:
```typescript
// From memory-save.ts:1029
throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), .opencode/skill/*/constitutional/, or README.md/README.txt paths');
```

**Significance**: Validation currently rejects `.txt` files. Must update regex/logic to accept `.txt` from allowed paths.

**Source**: [grep output, memory-save.ts line 1029]

---

### Finding 4: Frontmatter Parsing is Extension-Agnostic

**Context**: Memory files use YAML frontmatter for metadata (title, trigger phrases, description).

**Evidence**:
- Command `README.txt` files use frontmatter format (lines 1-13 of spec_kit/README.txt)
- Parser (`memory-parser.ts`) operates on file content, not extension
- No `.md`-specific parsing logic identified in codebase

**Significance**: No changes needed to frontmatter parsing—it will work for `.txt` files automatically.

**Source**: [Read tool output, command/spec_kit/README.txt frontmatter block]

---

### Finding 5: Command Invocation Uses Separate Code Path

**Context**: Slash commands are invoked via dispatch logic, not file reading during indexing.

**Evidence**:
- Indexing uses `fs.readFileSync` (read-only)
- No `require()` or `import()` of command files in indexing flow
- Command invocation logic likely in separate handler (not examined in memory-index.ts)

**Significance**: Low risk of command invocation during indexing, but explicit test recommended for safety.

**Source**: [Code inspection, memory-index.ts file operations]

---

### Finding 6: Incremental Indexing Uses Mtime/Hash, Not Extension

**Context**: Incremental indexing skips unchanged files by comparing mtime and content hash.

**Evidence**:
```typescript
// From memory-index.ts:440-451
if (incremental && !force) {
  const categorized: CategorizedFiles = incrementalIndex.categorizeFilesForIndexing(files);
  filesToIndex = [...categorized.toIndex, ...categorized.toUpdate];
  results.unchanged = categorized.toSkip.length;
  results.skipped_mtime = categorized.toSkip.length;
}
```

**Significance**: Incremental indexing will work for `.txt` files without modification (mtime/hash checks are path-based, not extension-based).

**Source**: [Read tool output, memory-index.ts lines 440-451]

---

### Finding 7: README Files Have Reduced Importance Weight

**Context**: Spec 126 introduced README.md indexing with importance weight 0.3 (vs 1.0 for normal memories).

**Evidence**:
- ADR-003 in Spec 126: "README files are indexed with reduced importance (0.3)"
- Rationale: Prevents READMEs from outranking user work memories

**Significance**: Should follow same precedent for `.txt` files (importance 0.3).

**Source**: [memory_context output, spec 126 reference]
<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:risks -->
## IDENTIFIED RISKS

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Command invocation triggered by indexing | Low | High | Use read-only file operations, add test |
| Path validation too permissive | Low | High | Explicit path prefix checks, test disallowed paths |
| Performance regression | Medium | Low | Leverage incremental indexing (already implemented) |
| Frontmatter parsing fails for `.txt` | Low | Low | Parser already tolerant, add fallback test |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:alternatives -->
## ALTERNATIVE APPROACHES

### Alternative 1: Separate Discovery Functions for `.txt`
**Pros**: Clear separation, easy to disable
**Cons**: Duplicates directory traversal logic, harder to maintain
**Verdict**: Rejected—prefer unified discovery (ADR-001)

### Alternative 2: Feature Flag for `.txt` Indexing
**Pros**: Gradual rollout, user control
**Cons**: Adds complexity, flag management overhead
**Verdict**: Rejected—low-risk change doesn't warrant flag

### Alternative 3: Exclude Command Folders Entirely
**Pros**: Zero risk of command invocation
**Cons**: Defeats the purpose (we want to index these docs)
**Verdict**: Rejected—use read-only safeguards instead (ADR-002)

### Alternative 4: Dynamic Importance Weight by Path
**Pros**: Fine-grained control (e.g., command docs = 0.3, spec docs = 1.0)
**Cons**: Complex, hard to reason about
**Verdict**: Rejected—uniform weight (0.3) is simpler (ADR-004)
<!-- /ANCHOR:alternatives -->

---

<!-- ANCHOR:implementation-notes -->
## IMPLEMENTATION NOTES

### Discovery Function Changes (memory-index.ts)

**Affected Lines**:
- `findMemoryFiles()`: ~150-200 (specs/**/memory/)
- `findSkillReadmes()`: ~269-300 (.opencode/skill/)
- `findProjectReadmes()`: ~310-344 (root directory, expanded to include .opencode/command/)
- `isReadmeFileName()`: ~50-55 (helper function using regex /^readme\.(md|txt)$/i)

**Pattern**:
```typescript
// Implementation approach: Use helper function with regex
const README_FILE_PATTERN = /^readme\.(md|txt)$/i;

function isReadmeFileName(fileName: string): boolean {
  return README_FILE_PATTERN.test(fileName);
}

// Used in discovery functions:
if (isReadmeFileName(entry.name)) {
  readmes.push(fullPath);
}
```

---

### Validation Regex Update (memory-save.ts)

**Affected Line**: ~1029

**Pattern**:
```typescript
// Before
/(specs\/.*\/memory\/.*|\.opencode\/skill\/.*|\.opencode\/command\/.*)\.md$/

// After
/(specs\/.*\/memory\/.*|\.opencode\/skill\/.*|\.opencode\/command\/.*)\.(md|txt)$/
```

---

### Test Coverage Requirements

1. **Functional Tests**:
   - Index `.txt` file from command folder → verify in results
   - Search for trigger phrase → verify `.txt` content returned
   - Incremental scan → verify unchanged `.txt` skipped

2. **Safety Tests**:
   - Index command folder → verify no command invocation
   - Attempt to index `.txt` from disallowed path → verify rejection

3. **Regression Tests**:
   - Run existing `.md` indexing tests → verify all pass
<!-- /ANCHOR:implementation-notes -->

---

<!-- ANCHOR:questions -->
## OPEN QUESTIONS & ANSWERS

**Q1**: Should `.txt` files be indexed with reduced importance weight?
**A1**: Yes, follow README precedent (0.3) to avoid outranking specs (ADR-004)

**Q2**: Should we support `.txt` files outside `.opencode/command/`?
**A2**: Yes, allow in specs/ and .opencode/skill/ for consistency (same paths as `.md`)

**Q3**: Do we need a feature flag for `.txt` indexing?
**A3**: No, low-risk additive change doesn't warrant flag overhead (ADR-002)

**Q4**: Will incremental indexing work for `.txt` files?
**A4**: Yes, mtime/hash tracking is path-based, not extension-based (Finding 6)

**Q5**: Could indexing trigger command invocation?
**A5**: Low risk—indexing uses read-only file operations, no execute logic (Finding 5)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:references -->
## REFERENCES

- **Spec 126**: Full spec document indexing (README.md weight precedent)
- **memory-index.ts**: File discovery functions, incremental indexing
- **memory-save.ts**: Path validation logic
- **command/spec_kit/README.txt**: Example `.txt` file with frontmatter
- **AGENTS.md**: Gate 3 spec folder requirements
<!-- /ANCHOR:references -->

---

<!-- ANCHOR:conclusion -->
## CONCLUSION

Adding `.txt` file indexing is a low-risk, additive change that fills a documentation discovery gap for command folders. The implementation requires:

1. Modifying four discovery functions to accept `.txt` extension
2. Updating path validation regex to allow `.txt` from allowed paths
3. Assigning reduced importance weight (0.3) to match README precedent
4. Adding test coverage for safety (command invocation) and functionality

No changes needed to frontmatter parsing, incremental indexing, or embedding generation—these subsystems are already extension-agnostic.

**Recommended Approach**: Follow ADRs 001-004 for unified discovery, read-only safeguards, regex extension, and reduced importance weight.
<!-- /ANCHOR:conclusion -->

---

<!--
Research document - Technical investigation findings
Captures evidence, alternatives, and implementation notes
-->
