# Resource Map Extractor

`extract-from-evidence.cjs` exposes one pure CommonJS function:

```js
const { emitResourceMap } = require('./extract-from-evidence.cjs');
```

## Input Contract

`emitResourceMap({ shape, deltas, packet, scope, createdAt }) -> string`

- `shape`: required. Either `'review'` or `'research'`.
- `deltas`: required. Array of parsed delta objects, delta record arrays, or `{ records: [...] }` / `{ events: [...] }` wrappers.
- `packet`: optional metadata object. Current implementation reads `title`, `name`, `packet`, `packetId`, `scope`, and `specFolder` when present.
- `scope`: optional one-line summary for the emitted map.
- `createdAt`: optional ISO timestamp. Defaults to `new Date().toISOString()`.

## Output Contract

Returns a fully rendered `resource-map.md` string using the phase-002 ten-category skeleton:

- `READMEs`
- `Documents`
- `Commands`
- `Agents`
- `Skills`
- `Specs`
- `Scripts`
- `Tests`
- `Config`
- `Meta`

Empty categories are omitted without renumbering the remaining headings.

## Shape Adapters

### Review

- Tracks repo paths from `file`, `path`, `filePath`, `sourcePath`, and `target`.
- Uses the latest severity seen for each `finding_id` / `findingId`.
- Counts final `P0`, `P1`, and `P2` findings per file.
- Files referenced but ending clean are emitted with `Action=Validated`.

### Research

- Tracks repo paths from `source_paths`, `sourcePath`, `citations`, `sources`, `file`, and `path`.
- Deduplicates citations per iteration, so the same file only counts once per iteration.
- Emits `Action=Cited` with `Citations=<N>` in the `Note` column.

## Deterministic Fallbacks

- Unknown or unsupported evidence rows are skipped and surfaced via `- **Degraded**: true` plus a degraded-row count in the Summary block.
- URLs are ignored because the output surface is a repo file ledger.
- Traversal-style relative paths such as `../outside.md` are rejected during normalization.
- Unknown file extensions fall back to the `Documents` category.
