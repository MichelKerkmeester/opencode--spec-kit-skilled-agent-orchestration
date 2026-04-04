"use strict";
// ---------------------------------------------------------------
// MODULE: Run Performance Benchmarks
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ───────────────────────────────────────────────────────────────
// 1. RUN PERFORMANCE BENCHMARKS
// ───────────────────────────────────────────────────────────────
// USAGE: npx tsx scripts/evals/run-performance-benchmarks.ts <spec-folder>
//
// This script MUST be run with tsx (not compiled JS) because
// The cross-project imports rely on tsconfig path resolution.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const perf_hooks_1 = require("perf_hooks");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const api_1 = require("@spec-kit/mcp-server/api");
const NFR_P01_P95_MS = 10;
const NFR_P02_P95_MS = 20;
const NFR_P03_P95_MS = 5;
const SESSION_SAMPLES = 800;
const CAUSAL_SAMPLES = 800;
const EXTRACTION_SAMPLES = 600;
const BASELINE_COMPARE_SAMPLES = 700;
const LOAD_TEST_CONCURRENCY = 1000;
function parseArgs() {
    const [, , specFolder] = process.argv;
    if (!specFolder) {
        throw new Error('Usage: npx tsx --tsconfig scripts/tsconfig.json scripts/evals/run-performance-benchmarks.ts <spec-folder-relative-path>');
    }
    return { specFolder };
}
function resolveSpecFolderPath(specFolder) {
    if (path_1.default.isAbsolute(specFolder)) {
        return specFolder;
    }
    const direct = path_1.default.resolve(process.cwd(), specFolder);
    if (fs_1.default.existsSync(direct)) {
        return direct;
    }
    const workspaceFallback = path_1.default.resolve(__dirname, '..', '..', '..', '..', '..', specFolder);
    if (fs_1.default.existsSync(workspaceFallback)) {
        return workspaceFallback;
    }
    return direct;
}
function percentile(sorted, p) {
    if (sorted.length === 0)
        return 0;
    if (sorted.length === 1)
        return sorted[0];
    const rank = (p / 100) * (sorted.length - 1);
    const low = Math.floor(rank);
    const high = Math.ceil(rank);
    const weight = rank - low;
    if (low === high)
        return sorted[low];
    return sorted[low] + ((sorted[high] - sorted[low]) * weight);
}
function toStats(samplesMs) {
    const sorted = [...samplesMs].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, value) => acc + value, 0);
    return {
        samples: sorted.length,
        minMs: sorted[0] ?? 0,
        maxMs: sorted[sorted.length - 1] ?? 0,
        meanMs: sorted.length > 0 ? sum / sorted.length : 0,
        p50Ms: percentile(sorted, 50),
        p95Ms: percentile(sorted, 95),
        p99Ms: percentile(sorted, 99),
    };
}
function ensureScratchDir(specFolder) {
    const scratchDir = path_1.default.join(specFolder, 'scratch');
    fs_1.default.mkdirSync(scratchDir, { recursive: true });
    return scratchDir;
}
function createBenchmarkDb() {
    const db = new better_sqlite3_1.default(':memory:');
    db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      title TEXT,
      importance_tier TEXT,
      trigger_phrases TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE working_memory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      memory_id INTEGER NOT NULL,
      attention_score REAL NOT NULL,
      added_at TEXT DEFAULT CURRENT_TIMESTAMP,
      event_counter INTEGER NOT NULL DEFAULT 0,
      mention_count INTEGER NOT NULL DEFAULT 0,
      focus_count INTEGER DEFAULT 1,
      last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
      source_tool TEXT,
      source_call_id TEXT,
      extraction_rule_id TEXT,
      redaction_applied INTEGER NOT NULL DEFAULT 0,
      UNIQUE(session_id, memory_id)
    );

    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      extracted_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
    const memoryInsert = db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
    VALUES (?, 'bench-spec', ?, ?, 'important', '[]')
  `);
    for (let id = 1; id <= 250; id += 1) {
        memoryInsert.run(id, `/tmp/memory-${id}.md`, `Memory ${id}`);
    }
    const wmInsert = db.prepare(`
    INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, focus_count, last_focused)
    VALUES (?, ?, ?, 0, 0, 1, CURRENT_TIMESTAMP)
  `);
    for (let id = 1; id <= 80; id += 1) {
        const score = 0.2 + ((id % 10) * 0.075);
        wmInsert.run('bench-session', id, Math.min(0.95, score));
    }
    const edgeInsert = db.prepare(`
    INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence)
    VALUES (?, ?, 'supports', 1.0, 'bench')
  `);
    for (let source = 1; source <= 200; source += 1) {
        edgeInsert.run(String(source), String(((source + 7) % 200) + 1));
        edgeInsert.run(String(source), String(((source + 31) % 200) + 1));
        edgeInsert.run(String(source), String(((source + 63) % 200) + 1));
    }
    return db;
}
function makeResults(startId, count) {
    const rows = [];
    for (let i = 0; i < count; i += 1) {
        rows.push({
            id: ((startId + i) % 200) + 1,
            score: 1 - (i * 0.02),
        });
    }
    return rows;
}
function measureSessionBoostLatency() {
    const samples = [];
    for (let i = 0; i < SESSION_SAMPLES; i += 1) {
        const start = perf_hooks_1.performance.now();
        const input = makeResults(i, 20);
        api_1.sessionBoost.applySessionBoost(input, 'bench-session');
        samples.push(perf_hooks_1.performance.now() - start);
    }
    return toStats(samples);
}
function measureCausalBoostLatency() {
    const samples = [];
    for (let i = 0; i < CAUSAL_SAMPLES; i += 1) {
        const start = perf_hooks_1.performance.now();
        const input = makeResults(i, 20);
        api_1.causalBoost.applyCausalBoost(input);
        samples.push(perf_hooks_1.performance.now() - start);
    }
    return toStats(samples);
}
async function measureExtractionHookLatency(db) {
    let callback = null;
    (0, api_1.initExtractionAdapter)(db, (fn) => {
        callback = fn;
    });
    const extractionCallback = callback;
    if (!extractionCallback) {
        throw new Error('Extraction callback registration failed');
    }
    (0, api_1.resetExtractionMetrics)();
    const originalInfo = console.info;
    const originalWarn = console.warn;
    console.info = () => undefined;
    console.warn = () => undefined;
    const samples = [];
    try {
        for (let i = 0; i < EXTRACTION_SAMPLES; i += 1) {
            const tool = i % 3 === 0 ? 'Read' : (i % 3 === 1 ? 'Grep' : 'Bash');
            const text = i % 3 === 0
                ? `Read /tmp/spec.md id=${(i % 120) + 1}`
                : (i % 3 === 1
                    ? `error: benchmark failure ${i}`
                    : `git commit -m "bench-${i}"`);
            const start = perf_hooks_1.performance.now();
            await extractionCallback(tool, `call-${i}`, {
                content: [{ text }],
            });
            samples.push(perf_hooks_1.performance.now() - start);
        }
    }
    finally {
        console.info = originalInfo;
        console.warn = originalWarn;
    }
    return {
        stats: toStats(samples),
        metrics: (0, api_1.getExtractionMetrics)(),
    };
}
async function runLoadTest1000Concurrent() {
    const perRequestSamples = [];
    const wallStart = perf_hooks_1.performance.now();
    await Promise.all(Array.from({ length: LOAD_TEST_CONCURRENCY }, async (_, index) => {
        await new Promise((resolve) => setImmediate(resolve));
        const requestStart = perf_hooks_1.performance.now();
        const baseline = makeResults(index, 20);
        const withSession = api_1.sessionBoost.applySessionBoost(baseline, 'bench-session').results;
        api_1.causalBoost.applyCausalBoost(withSession);
        perRequestSamples.push(perf_hooks_1.performance.now() - requestStart);
    }));
    const wallClockMs = perf_hooks_1.performance.now() - wallStart;
    return {
        totalRequests: LOAD_TEST_CONCURRENCY,
        wallClockMs,
        perRequest: toStats(perRequestSamples),
    };
}
function measureBaselineVsBoosted() {
    const baselineSamples = [];
    const boostedSamples = [];
    for (let i = 0; i < BASELINE_COMPARE_SAMPLES; i += 1) {
        const input = makeResults(i, 20);
        const baseStart = perf_hooks_1.performance.now();
        const baseline = [...input].sort((left, right) => right.score - left.score);
        void baseline;
        baselineSamples.push(perf_hooks_1.performance.now() - baseStart);
        const boostedStart = perf_hooks_1.performance.now();
        const withSession = api_1.sessionBoost.applySessionBoost(input, 'bench-session').results;
        api_1.causalBoost.applyCausalBoost(withSession);
        boostedSamples.push(perf_hooks_1.performance.now() - boostedStart);
    }
    const baseline = toStats(baselineSamples);
    const boosted = toStats(boostedSamples);
    const p95DeltaMs = boosted.p95Ms - baseline.p95Ms;
    const p95DeltaPercent = baseline.p95Ms > 0 ? (p95DeltaMs / baseline.p95Ms) * 100 : 0;
    return {
        baseline,
        boosted,
        p95DeltaMs,
        p95DeltaPercent,
    };
}
function writeArtifacts(scratchDir, report) {
    const jsonPath = path_1.default.join(scratchDir, 'performance-benchmark-metrics.json');
    fs_1.default.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    const mdPath = path_1.default.join(scratchDir, 'performance-benchmark-report.md');
    const markdown = [
        '# Performance Benchmark Report (CHK-110..CHK-114)',
        '',
        `- Generated: ${report.generatedAt}`,
        `- Node: ${report.environment.node}`,
        `- Platform: ${report.environment.platform} (${report.environment.arch})`,
        '',
        '## Thresholds',
        '',
        `- NFR-P01 (session boost p95): < ${report.thresholds.nfrP01SessionBoostP95Ms}ms`,
        `- NFR-P02 (causal traversal p95): < ${report.thresholds.nfrP02CausalTraversalP95Ms}ms`,
        `- NFR-P03 (extraction hook p95): < ${report.thresholds.nfrP03ExtractionHookP95Ms}ms`,
        '',
        '## Latency Results',
        '',
        `- Session boost p95: ${report.sessionBoost.p95Ms.toFixed(3)}ms`,
        `- Causal traversal p95: ${report.causalBoost.p95Ms.toFixed(3)}ms`,
        `- Extraction hook p95: ${report.extractionHook.p95Ms.toFixed(3)}ms`,
        '',
        '## Load Test',
        '',
        `- Concurrent requests: ${report.loadTest1000Concurrent.totalRequests}`,
        `- Total wall-clock: ${report.loadTest1000Concurrent.wallClockMs.toFixed(3)}ms`,
        `- Per-request p95: ${report.loadTest1000Concurrent.perRequest.p95Ms.toFixed(3)}ms`,
        '',
        '## Baseline vs Boosted',
        '',
        `- Baseline p95: ${report.baselineVsBoosted.baseline.p95Ms.toFixed(3)}ms`,
        `- Boosted p95: ${report.baselineVsBoosted.boosted.p95Ms.toFixed(3)}ms`,
        `- p95 delta: ${report.baselineVsBoosted.p95DeltaMs.toFixed(3)}ms (${report.baselineVsBoosted.p95DeltaPercent.toFixed(2)}%)`,
        '',
        '## Checklist Gate Status',
        '',
        `- CHK-110: ${report.gates.chk110}`,
        `- CHK-111: ${report.gates.chk111}`,
        `- CHK-112: ${report.gates.chk112}`,
        `- CHK-113: ${report.gates.chk113}`,
        `- CHK-114: ${report.gates.chk114}`,
        '',
        `Raw metrics: performance-benchmark-metrics.json`,
        '',
    ].join('\n');
    fs_1.default.writeFileSync(mdPath, `${markdown}\n`, 'utf8');
}
async function main() {
    const { specFolder } = parseArgs();
    const resolvedSpecFolder = resolveSpecFolderPath(specFolder);
    const scratchDir = ensureScratchDir(resolvedSpecFolder);
    const previousFlags = {
        SPECKIT_SESSION_BOOST: process.env.SPECKIT_SESSION_BOOST,
        SPECKIT_CAUSAL_BOOST: process.env.SPECKIT_CAUSAL_BOOST,
        SPECKIT_EXTRACTION: process.env.SPECKIT_EXTRACTION,
        SPECKIT_EVENT_DECAY: process.env.SPECKIT_EVENT_DECAY,
    };
    process.env.SPECKIT_SESSION_BOOST = 'true';
    process.env.SPECKIT_CAUSAL_BOOST = 'true';
    process.env.SPECKIT_EXTRACTION = 'true';
    process.env.SPECKIT_EVENT_DECAY = 'true';
    const db = createBenchmarkDb();
    api_1.workingMemory.init(db);
    api_1.sessionBoost.init(db);
    api_1.causalBoost.init(db);
    try {
        const sessionBoostStats = measureSessionBoostLatency();
        const causalBoostStats = measureCausalBoostLatency();
        const extraction = await measureExtractionHookLatency(db);
        const load = await runLoadTest1000Concurrent();
        const baselineVsBoosted = measureBaselineVsBoosted();
        const gates = {
            chk110: sessionBoostStats.p95Ms < NFR_P01_P95_MS ? 'PASS' : 'FAIL',
            chk111: causalBoostStats.p95Ms < NFR_P02_P95_MS ? 'PASS' : 'FAIL',
            chk112: extraction.stats.p95Ms < NFR_P03_P95_MS ? 'PASS' : 'FAIL',
            chk113: (load.perRequest.samples === LOAD_TEST_CONCURRENCY &&
                Number.isFinite(load.wallClockMs) &&
                Number.isFinite(load.perRequest.p95Ms)) ? 'PASS' : 'FAIL',
            chk114: (baselineVsBoosted.baseline.samples === BASELINE_COMPARE_SAMPLES &&
                baselineVsBoosted.boosted.samples === BASELINE_COMPARE_SAMPLES &&
                Number.isFinite(baselineVsBoosted.p95DeltaMs) &&
                Number.isFinite(baselineVsBoosted.p95DeltaPercent)) ? 'PASS' : 'FAIL',
        };
        const report = {
            generatedAt: new Date().toISOString(),
            environment: {
                node: process.version,
                platform: process.platform,
                arch: process.arch,
            },
            thresholds: {
                nfrP01SessionBoostP95Ms: NFR_P01_P95_MS,
                nfrP02CausalTraversalP95Ms: NFR_P02_P95_MS,
                nfrP03ExtractionHookP95Ms: NFR_P03_P95_MS,
            },
            sessionBoost: sessionBoostStats,
            causalBoost: causalBoostStats,
            extractionHook: extraction.stats,
            loadTest1000Concurrent: load,
            baselineVsBoosted,
            gates,
            extractionMetrics: extraction.metrics,
        };
        writeArtifacts(scratchDir, report);
        console.log('Performance benchmarks complete');
        console.log(`session_boost_p95_ms=${sessionBoostStats.p95Ms.toFixed(3)}`);
        console.log(`causal_boost_p95_ms=${causalBoostStats.p95Ms.toFixed(3)}`);
        console.log(`extraction_hook_p95_ms=${extraction.stats.p95Ms.toFixed(3)}`);
        console.log(`load_concurrency=${load.totalRequests} wall_clock_ms=${load.wallClockMs.toFixed(3)}`);
        console.log(`boosted_vs_baseline_p95_delta_ms=${baselineVsBoosted.p95DeltaMs.toFixed(3)}`);
    }
    finally {
        db.close();
        process.env.SPECKIT_SESSION_BOOST = previousFlags.SPECKIT_SESSION_BOOST;
        process.env.SPECKIT_CAUSAL_BOOST = previousFlags.SPECKIT_CAUSAL_BOOST;
        process.env.SPECKIT_EXTRACTION = previousFlags.SPECKIT_EXTRACTION;
        process.env.SPECKIT_EVENT_DECAY = previousFlags.SPECKIT_EVENT_DECAY;
        if (previousFlags.SPECKIT_SESSION_BOOST === undefined)
            delete process.env.SPECKIT_SESSION_BOOST;
        if (previousFlags.SPECKIT_CAUSAL_BOOST === undefined)
            delete process.env.SPECKIT_CAUSAL_BOOST;
        if (previousFlags.SPECKIT_EXTRACTION === undefined)
            delete process.env.SPECKIT_EXTRACTION;
        if (previousFlags.SPECKIT_EVENT_DECAY === undefined)
            delete process.env.SPECKIT_EVENT_DECAY;
    }
}
main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[run-performance-benchmarks] Failed: ${message}`);
    process.exitCode = 1;
});
//# sourceMappingURL=run-performance-benchmarks.js.map