# Iteration 025

## Focus
Rank the most likely root causes now that live loader semantics are visible.

## Findings
- The earlier “missing `server` export” theory is not sufficient because the working Superset plugin uses a named function export and the live loader invokes exports directly.
- The strongest current risk factors are:
  1. mixed export shape in the repo plugin module
  2. duplicate plugin naming between local file auto-load and bare package specifier
  3. runtime-version mismatch between bundled loader behavior and local helper types
- The bare plugin specifier in `opencode.json` remains especially suspect because it resolves through package-install semantics, not local-file semantics.

## Why It Matters
The next fix should target runtime compatibility and config resolution together, not only module typing.

## Evidence
- Combined evidence from iterations 017-024

## Outcome
The highest-confidence fix path is now narrower and more concrete than before.
