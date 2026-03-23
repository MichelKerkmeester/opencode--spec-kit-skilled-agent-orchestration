Verified. I scoped this to `mcp_server` references in the two evaluation catalog entries, per your request.

Prior audit context: [implementation-summary.md:34](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/007-evaluation/implementation-summary.md:34>).

1. **Feature 01 — Ablation studies (`eval_run_ablation`)**
- Catalog entry: [01-ablation-studies-evalrunablation.md](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md>)

File verification:
- `133/133` `mcp_server/...` references exist (catalog lines `32-92`, `114-185`).

Function/signature verification:
- `handleEvalRunAblation(args: RunAblationArgs): Promise<MCPResponse>` exists at [handlers/eval-reporting.ts:166](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:166>).
- `runAblation(searchFn: AblationSearchFn, config: AblationConfig = { channels: ALL_CHANNELS }): Promise<AblationReport | null>` exists at [lib/eval/ablation-framework.ts:361](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:361>).
- Tool signature fields exist in [tool-schemas.ts:458](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:458>) and validator schema in [schemas/tool-input-schemas.ts:338](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:338>).

Flag/default checks:
- `SPECKIT_ABLATION` gate: true only when env is `'true'` (case-insensitive) at [ablation-framework.ts:45](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:45>).
- Disabled-flag error at handler level at [eval-reporting.ts:176](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:176>).
- Defaults confirmed:
  - `mode` defaults to ablation path (only `k_sensitivity` branches) at [eval-reporting.ts:167](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:167>).
  - `channels` default to all via `normalizeChannels` at [eval-reporting.ts:72](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:72>).
  - `recallK` default `20` at [eval-reporting.ts:196](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:196>).
  - `storeResults` default true at [eval-reporting.ts:237](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:237>).
  - `includeFormattedReport` default true at [eval-reporting.ts:239](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:239>).

Behavioral accuracy:
- One-channel-at-a-time ablation loop: [ablation-framework.ts:404](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:404>).
- Per-channel try/catch with partial continuation: [ablation-framework.ts:410](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:410>), [ablation-framework.ts:482](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:482>).
- Exact-binomial sign test: [ablation-framework.ts:229](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:229>).
- Verdict spectrum (`CRITICAL` / `negligible` / `HARMFUL`): [ablation-framework.ts:734](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:734>).
- Negative timestamp run IDs for persisted ablation snapshots: [ablation-framework.ts:530](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:530>).

Unreferenced implementing files (not listed in catalog):
- [mcp_server/tools/lifecycle-tools.ts:58](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58>)
- [mcp_server/tools/types.ts:314](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:314>)
- [mcp_server/handlers/index.ts:131](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:131>)
- [mcp_server/lib/architecture/layer-definitions.ts:102](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:102>)
- [mcp_server/api/eval.ts:10](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/eval.ts:10>)
- [mcp_server/api/index.ts:9](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts:9>)

Verdict: **PARTIAL**

---

2. **Feature 02 — Reporting dashboard (`eval_reporting_dashboard`)**
- Catalog entry: [02-reporting-dashboard-evalreportingdashboard.md](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md>)

File verification:
- `10/10` listed `mcp_server/...` references exist (lines `32-39`, `45-46`; `8` unique paths).

Function/signature verification:
- `handleEvalReportingDashboard(args: ReportingDashboardArgs): Promise<MCPResponse>` exists at [handlers/eval-reporting.ts:316](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:316>).
- `generateDashboardReport(config: ReportConfig = {}): Promise<DashboardReport>` exists at [lib/eval/reporting-dashboard.ts:511](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:511>).
- Formatter signatures exist at [reporting-dashboard.ts:576](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:576>) and [reporting-dashboard.ts:650](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:650>).

Flag/default checks:
- `format` default `text` in schema: [tool-schemas.ts:504](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:504>) and runtime fallback: [eval-reporting.ts:326](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:326>).
- `SPECKIT_DASHBOARD_LIMIT` default `10000`: [reporting-dashboard.ts:25](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:25>).
- Request `limit` applied after sprint grouping: [reporting-dashboard.ts:534](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:534>).

Behavioral accuracy:
- Uses `eval_metric_snapshots` and `eval_channel_results`: [reporting-dashboard.ts:186](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:186>), [reporting-dashboard.ts:230](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:230>).
- Sprint label `sprint/sprintLabel` with fallback `run-{eval_run_id}`: [reporting-dashboard.ts:250](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:250>), [reporting-dashboard.ts:262](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:262>).
- Trend uses latest metric values + `isHigherBetter` with latency/inversion lower-is-better: [reporting-dashboard.ts:170](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:170>), [reporting-dashboard.ts:413](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:413>), [reporting-dashboard.ts:420](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:420>).
- Channel rows grouped per run/channel before sprint aggregation: [reporting-dashboard.ts:240](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:240>), [reporting-dashboard.ts:547](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:547>).

Unreferenced implementing files (not listed in catalog):
- [mcp_server/tool-schemas.ts:494](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:494>)
- [mcp_server/schemas/tool-input-schemas.ts:348](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:348>)
- [mcp_server/tools/lifecycle-tools.ts:59](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:59>)
- [mcp_server/tools/types.ts:325](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:325>)
- [mcp_server/handlers/index.ts:132](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:132>)
- [mcp_server/lib/architecture/layer-definitions.ts:103](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:103>)

Note on behavioral strictness:
- Catalog says “no writes/mutation side effects”, but dashboard calls `initEvalDb()` via `getDb()`; first init can create dir/schema (`mkdir`, `CREATE TABLE IF NOT EXISTS`) at [eval-db.ts:130](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:130>) and [eval-db.ts:142](
</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:142>).

Verdict: **PARTIAL**

---

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 01 | Ablation studies (`eval_run_ablation`) | Yes (`133/133`) | Yes | Yes | Yes (6 key implementation files) | PARTIAL |
| 02 | Reporting dashboard (`eval_reporting_dashboard`) | Yes (`10/10`, 8 unique) | Yes | Yes | Yes (6 key implementation files) | PARTIAL |

I did not run runtime test execution; this was static code-level verification with line-accurate source tracing.