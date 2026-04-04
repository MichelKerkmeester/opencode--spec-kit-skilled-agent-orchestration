# Iteration 021

## Focus
Compare the active Superset plugin and the external `opencode-lcm` reference against the live loader behavior.

## Findings
- The active Superset OpenCode plugin exports a single named async function: `SupersetNotifyPlugin`.
- The external `opencode-lcm` reference also centers on a single plugin function export pattern.
- Neither working reference depends on mixing plugin functions with extra non-function exports.

## Why It Matters
The working examples align with the live loader’s “invoke all exports” behavior much better than a mixed metadata + function module.

## Evidence
- `~/.superset/hooks/opencode/plugin/superset-notify.js`
- `external/opencode-lcm-master/src/index.ts`

## Outcome
Strong comparative evidence that single-function export modules are the compatibility baseline for the live OpenCode runtime.
