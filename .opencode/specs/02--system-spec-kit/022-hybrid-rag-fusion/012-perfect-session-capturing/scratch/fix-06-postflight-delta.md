● Todo added: Align postflight delta guard

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 198-290
  └ 93 lines read

● Grep "HAS_POSTFLIGHT_DELTA|delta" in *.ts (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
  └ 40 lines found

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 290-325
  └ 35 lines read

● Grep "const hasPostflightDelta|hasPostflightDelta" in *.ts
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
  └ 2 lines found

● Edit .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts

● Grep "const hasPostflightDelta =|if
\(hasPostflightDelta\)|DELTA_UNCERTAINTY_SCORE|DELTA_CONTEXT_SCORE" in *.ts
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
  └ 10 lines found

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 236-310
  └ 75 lines read

● Todo completed: fix-postflight-delta-guard

● Run scripts workspace checks
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/scripts' && npm run -s check
  └ 5 lines...

Updated `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` so `hasPostflightDelta` now requires all three preflight/postflight metrics and is the only gate for delta computation. This prevents partial deltas from being produced when uncertainty/context data is missing. Verified with `rg` that the guard wraps the computation, and `npm run -s check` passed in `.opencode/skill/system-spec-kit/scripts`.


Total usage est:        1 Premium request
API time spent:         54s
Total session time:     1m 5s
Total code changes:     +18 -32
Breakdown by AI model:
 gpt-5.4                 154.8k in, 3.5k out, 125.4k cached (Est. 1 Premium request)
