# Iteration 061
## Focus
Auto-Deep-Research top-level launch path and startup contract.

## Questions Evaluated
- How does the repo present itself to the user at the CLI boundary?
- What startup work is hidden behind the simple `auto deep-research` command?
- What does this suggest for our own hook and non-hook CLI entrypoints?

## Evidence
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/README.md:21-28`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/README.md:70-118`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/cli.py:109-147`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/__init__.py:1-9`

## Analysis
This repo gives users a very simple front door, but the command does a lot of work under the hood. It builds the Docker environment, picks a port, sets up browser and file environments, loads the triage agent, and then enters the interactive loop. That is a useful pattern for usability, but the launch path is still tightly coupled to runtime setup.

## Findings
- A single command can hide a lot of setup without making the user manage those details.
- The launch flow is opinionated and convenient, but it mixes bootstrap, environment creation, and task execution in one path.
- For our internal system, that means we should keep the front door simple while still separating startup from research or review state semantics.

## Compatibility Impact
This pattern fits both hook and non-hook CLIs if bootstrap is treated as a wrapper around the real packet state, not as the source of truth itself.

## Next Focus
Inspect retry and provider fallback behavior inside the core completion path.
