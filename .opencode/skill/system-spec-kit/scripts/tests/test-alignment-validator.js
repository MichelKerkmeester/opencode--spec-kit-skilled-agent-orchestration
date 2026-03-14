// ───────────────────────────────────────────────────────────────
// 1. ALIGNMENT VALIDATOR DRIFT TESTS
// ───────────────────────────────────────────────────────────────
// PURPOSE: Validate telemetry schema/docs drift detection behavior
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const Module = require('module');

const TEST_ROOT = path.resolve(__dirname, '..');
const SKILL_ROOT = path.resolve(TEST_ROOT, '..');
const ALIGNMENT_VALIDATOR_TS = path.join(TEST_ROOT, 'spec-folder', 'alignment-validator.ts');
const TYPESCRIPT_MODULE_PATH = path.join(SKILL_ROOT, 'node_modules', 'typescript');

const results = {
  passed: 0,
  failed: 0,
};

function log(message) {
  console.log(message);
}

function pass(testName, evidence) {
  results.passed += 1;
  log(`   PASS ${testName}`);
  if (evidence) {
    log(`      ${evidence}`);
  }
}

function fail(testName, reason) {
  results.failed += 1;
  log(`   FAIL ${testName}`);
  log(`      ${reason}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function loadAlignmentValidatorModule() {
  const typescript = require(TYPESCRIPT_MODULE_PATH);
  const source = fs.readFileSync(ALIGNMENT_VALIDATOR_TS, 'utf8');
  const sourceWithoutPromptDependency = source.replace(
    /import\s+\{\s*promptUserChoice\s*\}\s+from\s+'\.\.\/utils\/prompt-utils';/,
    "const promptUserChoice = async () => { throw new Error('promptUserChoice is unavailable in this test runtime'); };"
  );

  const transpiled = typescript.transpileModule(sourceWithoutPromptDependency, {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: ALIGNMENT_VALIDATOR_TS,
  });

  const loadedModule = new Module(ALIGNMENT_VALIDATOR_TS, module);
  loadedModule.filename = ALIGNMENT_VALIDATOR_TS;
  loadedModule.paths = Module._nodeModulePaths(path.dirname(ALIGNMENT_VALIDATOR_TS));
  loadedModule._compile(transpiled.outputText, ALIGNMENT_VALIDATOR_TS);

  return loadedModule.exports;
}

function makeDocsMarkdown(contentBySection) {
  const sections = Object.entries(contentBySection)
    .map(([sectionName, rows]) => {
      const lines = [
        `### ${sectionName}`,
        '',
        '| Field | Type | Description |',
        '|-------|------|-------------|',
      ];
      for (const field of rows) {
        lines.push(`| \`${field}\` | \`unknown\` | test |`);
      }
      lines.push('');
      return lines.join('\n');
    })
    .join('\n');

  return `# Telemetry\n\n${sections}`;
}

function makeSchemaSource(contentByInterface) {
  return Object.entries(contentByInterface)
    .map(([interfaceName, fields]) => {
      const body = fields.map((field) => `  ${field}: unknown;`).join('\n');
      return `interface ${interfaceName} {\n${body}\n}\n`;
    })
    .join('\n');
}

async function run() {
  log('\nRunning alignment-validator drift checks...\n');

  let alignmentValidator = null;
  try {
    alignmentValidator = loadAlignmentValidatorModule();
    pass('T-AV00: module loads from TypeScript source');
  } catch (error) {
    fail('T-AV00: module loads from TypeScript source', error.message);
    summarizeAndExit();
    return;
  }

  const {
    computeTelemetrySchemaDocsFieldDiffs,
    formatTelemetrySchemaDocsDriftDiffs,
    validateTelemetrySchemaDocsDrift,
  } = alignmentValidator;

  try {
    assert(typeof computeTelemetrySchemaDocsFieldDiffs === 'function', 'computeTelemetrySchemaDocsFieldDiffs must be a function');
    assert(typeof formatTelemetrySchemaDocsDriftDiffs === 'function', 'formatTelemetrySchemaDocsDriftDiffs must be a function');
    assert(typeof validateTelemetrySchemaDocsDrift === 'function', 'validateTelemetrySchemaDocsDrift must be a function');
    pass('T-AV01: telemetry drift functions are exported');
  } catch (error) {
    fail('T-AV01: telemetry drift functions are exported', error.message);
  }

  const schemaFixture = makeSchemaSource({
    RetrievalTelemetry: ['enabled', 'timestamp', 'latency', 'mode', 'fallback', 'quality'],
    LatencyMetrics: ['totalLatencyMs', 'candidateLatencyMs'],
    ModeMetrics: ['selectedMode', 'modeOverrideApplied', 'pressureLevel'],
    FallbackMetrics: ['fallbackTriggered', 'fallbackReason', 'degradedModeActive'],
    QualityMetrics: ['resultCount', 'avgRelevanceScore', 'topResultScore', 'qualityProxyScore'],
  });

  const docsFixtureWithDrift = makeDocsMarkdown({
    RetrievalTelemetry: ['runId', 'timestamp', 'latency', 'mode', 'fallback', 'quality'],
    LatencyMetrics: ['vectorMs', 'totalMs'],
    ModeMetrics: ['selected', 'overridden', 'pressureLevel'],
    FallbackMetrics: ['triggered', 'reason', 'degraded'],
    QualityMetrics: ['score', 'relevanceComponent', 'latencyComponent'],
  });

  try {
    const diffs = computeTelemetrySchemaDocsFieldDiffs(schemaFixture, docsFixtureWithDrift);
    const latencyDiff = diffs.find((diff) => diff.interfaceName === 'LatencyMetrics');
    assert(Array.isArray(diffs) && diffs.length > 0, 'Expected drift diff entries');
    assert(latencyDiff, 'Expected LatencyMetrics diff');
    assert(latencyDiff.schemaOnlyFields.includes('candidateLatencyMs'), 'Expected schema-only candidateLatencyMs');
    assert(latencyDiff.docsOnlyFields.includes('vectorMs'), 'Expected docs-only vectorMs');
    pass('T-AV02: computeTelemetrySchemaDocsFieldDiffs returns field-level drift');
  } catch (error) {
    fail('T-AV02: computeTelemetrySchemaDocsFieldDiffs returns field-level drift', error.message);
  }

  try {
    const diffs = computeTelemetrySchemaDocsFieldDiffs(schemaFixture, docsFixtureWithDrift);
    const formatted = formatTelemetrySchemaDocsDriftDiffs(diffs);
    assert(formatted.includes('+ candidateLatencyMs (schema-only)'), 'Missing schema-only formatted diff');
    assert(formatted.includes('- vectorMs (docs-only)'), 'Missing docs-only formatted diff');
    pass('T-AV03: formatTelemetrySchemaDocsDriftDiffs prints +/- per field');
  } catch (error) {
    fail('T-AV03: formatTelemetrySchemaDocsDriftDiffs prints +/- per field', error.message);
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alignment-validator-drift-'));
  const schemaPath = path.join(tempDir, 'retrieval-telemetry.ts');
  const docsPath = path.join(tempDir, 'README.md');
  fs.writeFileSync(schemaPath, schemaFixture, 'utf8');
  fs.writeFileSync(docsPath, docsFixtureWithDrift, 'utf8');

  try {
    let errorMessage = '';
    try {
      await validateTelemetrySchemaDocsDrift({ schemaPath, docsPath, useCache: false });
    } catch (error) {
      errorMessage = error.message;
    }

    assert(errorMessage.includes('Telemetry schema/docs drift detected'), 'Expected drift error header');
    assert(errorMessage.includes('+ candidateLatencyMs (schema-only)'), 'Expected schema-only diff in error');
    assert(errorMessage.includes('- vectorMs (docs-only)'), 'Expected docs-only diff in error');
    pass('T-AV04: validateTelemetrySchemaDocsDrift fails with field-level diffs');
  } catch (error) {
    fail('T-AV04: validateTelemetrySchemaDocsDrift fails with field-level diffs', error.message);
  }

  try {
    const docsFixtureAligned = makeDocsMarkdown({
      RetrievalTelemetry: ['enabled', 'timestamp', 'latency', 'mode', 'fallback', 'quality'],
      LatencyMetrics: ['totalLatencyMs', 'candidateLatencyMs'],
      ModeMetrics: ['selectedMode', 'modeOverrideApplied', 'pressureLevel'],
      FallbackMetrics: ['fallbackTriggered', 'fallbackReason', 'degradedModeActive'],
      QualityMetrics: ['resultCount', 'avgRelevanceScore', 'topResultScore', 'qualityProxyScore'],
    });

    fs.writeFileSync(docsPath, docsFixtureAligned, 'utf8');
    await validateTelemetrySchemaDocsDrift({ schemaPath, docsPath, useCache: false });
    pass('T-AV05: validateTelemetrySchemaDocsDrift passes when schema/docs align');
  } catch (error) {
    fail('T-AV05: validateTelemetrySchemaDocsDrift passes when schema/docs align', error.message);
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup failures
    }
  }

  summarizeAndExit();
}

function summarizeAndExit() {
  log('\nSummary:');
  log(`   Passed: ${results.passed}`);
  log(`   Failed: ${results.failed}`);
  process.exit(results.failed > 0 ? 1 : 0);
}

run().catch((error) => {
  fail('T-AVXX: unexpected failure', error.message);
  summarizeAndExit();
});
