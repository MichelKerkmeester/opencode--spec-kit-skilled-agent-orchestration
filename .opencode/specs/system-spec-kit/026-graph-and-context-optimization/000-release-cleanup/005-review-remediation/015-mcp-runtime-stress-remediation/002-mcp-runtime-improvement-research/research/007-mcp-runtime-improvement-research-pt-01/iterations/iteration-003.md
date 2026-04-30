# Iteration 003 - Q2 CocoIndex mirror-folder duplicates

## Focus

Q2: diagnose why CocoIndex can return the same chunk from runtime mirror folders such as `.gemini/specs/`, `.claude/specs/`, `.codex/specs/`, and `.opencode/specs/`, then recommend a canonical-source or deduplication protocol.

Q1 was not reopened. Iteration 001 already answered the rebuild plus restart protocol, and Iteration 002 already answered Q5.

## Actions Taken

1. Read Iterations 001 and 002 plus the 006 live-probe note to avoid duplicating already-settled questions.
2. Inspected the CocoIndex skill settings contract, the project `.cocoindex_code/settings.yml`, and the installed `cocoindex_code` indexer/query/server implementation.
3. Verified the runtime mirror shape on disk: `.claude/specs`, `.codex/specs`, and `.gemini/specs` are symlinks to `../.opencode/specs`.
4. Compared duplicate candidate files through the symlink aliases with `find -L` plus `shasum`.
5. Re-ran a direct `ccc search "memory_context truncation" --limit 10` probe. The command was slow to return, but eventually reproduced the duplicate-collapse pattern live.

## Findings

### 1. Mirror duplicates are structurally real because runtime spec roots are symlinks

`ls -la .claude .codex .gemini` shows:

- `.claude/specs -> ../.opencode/specs`
- `.codex/specs -> ../.opencode/specs`
- `.gemini/specs -> ../.opencode/specs`

Following symlinks confirms the same physical files appear under multiple logical paths. For the Q3-related duplicate example, all four paths hash identically:

- `.claude/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-040.md`
- `.codex/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-040.md`
- `.gemini/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-040.md`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-040.md`

All four produce SHA1 `c899950ecbfe82ea95d83fbe2d39e94c590f6672`.

The Q2 live-probe file has the same pattern. `research-06.md` hashes to `7fbc7be52d469ddecbf69aff40cae71a6116111b` through `.claude/specs`, `.codex/specs`, `.gemini/specs`, and `.opencode/specs`.

This means the vector system is not inventing duplicates. The workspace exposes the same content through multiple root aliases.

### 2. The current project settings exclude only the canonical `.opencode/specs` path, not the mirror aliases

The project settings at `.cocoindex_code/settings.yml:1-15` include these relevant excludes:

- `**/.git`
- `**/.venv`
- `**/.env`
- `**/.DS_Store`
- `**/.cocoindex_code`
- `**/.opencode/specs/**`
- `**/.opencode/changelog/**`

There are no excludes for:

- `**/.claude/specs/**`
- `**/.codex/specs/**`
- `**/.gemini/specs/**`
- `**/.agents/specs/**`
- `**/specs/**`

There is also no broad hidden-directory exclude in the project settings. The package default contains `**/.*` at `cocoindex_code/settings.py:73-83`, but the project-local settings have replaced that with a narrower list. That replacement allows hidden runtime roots such as `.claude`, `.codex`, and `.gemini` to remain eligible unless each mirror is explicitly excluded.

One subtle risk: excluding `.opencode/specs/**` while leaving symlink mirrors eligible can prefer aliases over the canonical source. If spec docs should be indexed at all, the canonical source should be `.opencode/specs`, with runtime mirrors excluded. If CocoIndex should remain code-first, all spec roots should be excluded consistently.

### 3. The indexer stores the alias path, not a realpath-canonical source identity

`cocoindex_code/indexer.py:180-189` declares each chunk with:

- `id = await id_gen.next_id(chunk.text)`
- `file_path = file.file_path.path.as_posix()`
- `content = chunk.text`
- `start_line` and `end_line`
- `embedding = await embedder.embed(chunk.text)`

The indexer does not record `realpath`, inode identity, `content_hash`, or a canonical logical path. If the walker sees the same file through `.claude/specs/...` and `.codex/specs/...`, both rows have identical content and embeddings but different `file_path` values.

That explains the identical 0.6811 scores reported in 006: identical chunk text embedded with the same model yields identical vector distance. The path differs, but the scorer has no path identity concept beyond the returned `file_path`.

### 4. Query and MCP presentation return raw nearest-neighbor rows with no dedupe stage

`cocoindex_code/query.py:115-145` reads nearest-neighbor rows from `code_chunks_vec`, slices offset only when no path filter is used, then maps every row directly to `QueryResult`. There is no grouping by content hash, no grouping by canonical path, and no diversity/MMR pass.

`cocoindex_code/project.py:174-203` passes those results straight through as `SearchResult`, and `cocoindex_code/server.py:139-155` maps them straight into MCP response models.

So Q2 has two contributing causes:

1. Index-time alias duplication: symlinked runtime roots are eligible for indexing.
2. Query-time no-dedup behavior: the top-k response can be consumed entirely by exact duplicate chunks.

### 5. Live CLI re-probe confirms top-k duplicate collapse

`ccc search "memory_context truncation" --limit 10` eventually returned ten results that were all the same checklist chunk at line 85 with identical score `0.645`. The aliases included `.gemini/specs`, top-level `specs`, `.agents/specs`, `.claude/specs`, and `.codex/specs`, in both `02--system-spec-kit/...` and `system-spec-kit/...` forms.

That live output strengthens the earlier file-system finding: this is not only a theoretical symlink/indexing hazard. The active CocoIndex result set can spend the entire top 10 on duplicate aliases for one semantic hit.

## Questions Answered

### Q2 root cause

CocoIndex mirror duplicates happen because the same spec content is exposed through multiple symlinked runtime roots, and the indexer stores each alias path as a separate chunk without a canonical identity. Query results then return raw vector nearest neighbors without content/path dedupe. Identical content produces identical embeddings and identical scores, so a top-10 response can collapse to one effective unique chunk.

### Q2 recommended fix

Use two layers, because either one alone leaves a failure mode:

1. Index-time canonicalization:
   - Resolve `realpath` for each candidate before indexing.
   - Track a `canonical_file_path` or `source_realpath` field.
   - Skip duplicate realpaths already seen during a scan.
   - Exclude runtime spec mirrors by default: `**/.claude/specs/**`, `**/.codex/specs/**`, `**/.gemini/specs/**`, `**/.agents/specs/**`.

2. Query-time dedup:
   - Group candidate rows by `sha256(normalized content) + start_line + end_line`, or by `source_realpath + start_line + end_line` when realpath is available.
   - Prefer canonical paths in tie-breaks: source code paths first for code queries; `.opencode/specs` first for spec-doc queries; runtime mirror aliases last.
   - Over-fetch before dedup, for example fetch `limit * 4`, then return the first `limit` unique groups.
   - Emit telemetry: `dedupedAliases`, `uniqueResultCount`, and `duplicateGroups`.

For this repo, the immediate settings-level mitigation depends on intended corpus:

- Code-first CocoIndex: exclude all spec roots, including `.opencode/specs/**` and the symlink mirrors.
- Mixed code plus canonical spec search: index `.opencode/specs/**` only and exclude `.claude/specs/**`, `.codex/specs/**`, `.gemini/specs/**`, `.agents/specs/**`, and any top-level `specs/**` mirror.

The safer product default is code-first. Spec packet retrieval is already served better by Spec Kit Memory, while CocoIndex should find implementation source by concept.

## Questions Remaining

- Q3: source-vs-markdown ranking imbalance remains open. Q2 explains exact duplicate collapse, but not why markdown beats source after duplicates are removed.
- Q4: weak retrieval hallucination guardrails remain open.
- Q6: empty/stale structural code graph recovery remains open.
- Q7: supersedes-heavy causal edge growth remains open.
- Q8: broader intent classifier consistency remains open.

## Next Focus

Q3: investigate why markdown research outranks implementation source on technical implementation queries, then recommend path-class boosts or ranking weights that make `mcp_server/` implementation files win when the query intent is code/implementation.
