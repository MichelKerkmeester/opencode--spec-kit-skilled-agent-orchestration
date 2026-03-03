# Sub-Agent Utilization Ledger (Merged)

## Run A: Codex 5.3 xhigh (Observed)
Source:
- `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/prompts/run-outputs/codex-5-3-xhigh-run.log`
- `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/prompts/run-outputs/codex-5-3-xhigh-last-message.md`

Observed orchestration:
- Hard cap detected: 6 total sub-agent threads
- Effective model: 1 coordinator + 5 workers
- Saturation strategy: full worker saturation in waves

| Runtime | Reported/Observed Capacity | Workers Used | Coordinator | Wave Count | Saturation |
|---|---:|---:|---:|---:|---:|
| Codex 5.3 xhigh | 6 total | 5 | 1 | 2 | 100% while active |

## Run B: Gemini 3.1 Pro Preview (Reported)
Source:
- `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/prompts/run-outputs/gemini-3-1-pro-preview-run.log`

Reported orchestration in output:
- 1 coordinator + 14 workers
- 2 waves, 100% stated saturation

| Runtime | Reported/Observed Capacity | Workers Used | Coordinator | Wave Count | Saturation |
|---|---:|---:|---:|---:|---:|
| Gemini 3.1 Pro Preview | 15 total (reported) | 14 | 1 | 2 | 100% (reported) |

## Merged Operational Rule
1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Run in waves until all scenarios are complete.
5. Record utilization table and evidence paths in final report.
