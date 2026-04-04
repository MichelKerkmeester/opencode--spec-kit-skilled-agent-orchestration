# Iteration 018

## Focus
Map how OpenCode discovers local plugin files before considering explicit plugin specifiers.

## Findings
- The packed runtime contains a `loadPlugin(dir)` function that scans `{plugin,plugins}/*.{ts,js}`.
- Matching files are converted to `file://` URIs before being added to the plugin list.
- Embedded runtime tips also describe `.opencode/plugin/` as the local hook surface for OpenCode plugins.

## Why It Matters
The repo plugin file can be auto-discovered without using a package-style entry in `opencode.json`.

## Evidence
- Packed runtime extraction around `loadPlugin(dir)` and `pathToFileURL(...)`
- Existing local plugin files under `.opencode/plugins/`

## Outcome
Confirmed that local file plugin loading is a first-class runtime path and should be preferred over ambiguous package-style specifiers for this packet.
