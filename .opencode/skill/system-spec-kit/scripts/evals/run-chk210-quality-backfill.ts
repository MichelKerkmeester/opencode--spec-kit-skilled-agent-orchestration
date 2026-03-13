// --- 1. RUN CHK-210 QUALITY BACKFILL ---
// SCRIPT: CHK-210 Quality Metadata Backfill

const fs = require('fs');
const { execFileSync } = require('child_process');
const { parseMemoryFile } = require('@spec-kit/mcp-server/lib/parsing/memory-parser');
const { validateMemoryQualityContent } = require('../memory/validate-memory-quality.ts');
const { scoreMemoryQuality } = require('../extractors/quality-scorer.ts');

type DbRow = { id: number; file_path: string };
type QualityScoreResult = { qualityScore: number; qualityFlags: string[] };

function parseArgs() {
  const [, , specFolderPrefix, dbPath] = process.argv;
  if (!specFolderPrefix || !dbPath) {
    throw new Error('Usage: npx tsx scripts/evals/run-chk210-quality-backfill.ts <spec-folder-prefix> <sqlite-db-path>');
  }
  return { specFolderPrefix, dbPath };
}

function runSqlJson(dbPath: string, sql: string): Array<Record<string, unknown>> {
  const output = execFileSync('sqlite3', ['-json', dbPath, sql], { encoding: 'utf8' }).trim();
  return output ? JSON.parse(output) : [];
}

function runSql(dbPath: string, sql: string): void {
  execFileSync('sqlite3', [dbPath, sql], { stdio: 'pipe' });
}

function hasQualityKeys(content: string): boolean {
  return /\nquality_score:\s*[0-9.]+/i.test(content) && /\nquality_flags:\s*(?:\n|$)/i.test(content);
}

function injectQualityMetadata(content: string, qualityScore: number, qualityFlags: string[]): string {
  const yamlMatch = content.match(/```yaml\n([\s\S]*?)\n```/);
  if (!yamlMatch) return content;

  let yamlBlock = yamlMatch[1];
  yamlBlock = yamlBlock.replace(/\n# Quality Signals[\s\S]*$/i, '');

  const qualityLines = [
    `quality_score: ${qualityScore.toFixed(2)}`,
    'quality_flags:',
    ...(qualityFlags.length > 0 ? qualityFlags.map((flag) => `  - "${flag}"`) : ['  []']),
  ].join('\n');

  const replacement = `${yamlBlock}\n\n# Quality Signals\n${qualityLines}`;
  return content.replace(yamlMatch[1], replacement);
}

function computeQuality(content: string): QualityScoreResult {
  const validation = validateMemoryQualityContent(content);
  const qualitySignals = validation.ruleResults.map((rule: { ruleId: string; passed: boolean }) => ({
    ruleId: rule.ruleId,
    passed: rule.passed,
  }));

  const messageCount = Number(content.match(/\nmessage_count:\s*(\d+)/i)?.[1] ?? '0');
  const toolCount = Number(content.match(/\ntool_count:\s*(\d+)/i)?.[1] ?? '0');
  const decisionCount = Number(content.match(/\ndecision_count:\s*(\d+)/i)?.[1] ?? '0');

  return scoreMemoryQuality({
    content,
    validatorSignals: qualitySignals,
    hadContamination: false,
    messageCount,
    toolCount,
    decisionCount,
  });
}

function main() {
  const { specFolderPrefix, dbPath } = parseArgs();

  const before = runSqlJson(
    dbPath,
    `SELECT COUNT(*) AS recent_rows,\n            SUM(CASE WHEN quality_score IS NOT NULL THEN 1 ELSE 0 END) AS quality_score_non_null,\n            SUM(CASE WHEN quality_flags IS NOT NULL THEN 1 ELSE 0 END) AS quality_flags_non_null\n     FROM (\n       SELECT id, quality_score, quality_flags\n       FROM memory_index\n       WHERE spec_folder LIKE '${specFolderPrefix.replace(/'/g, "''")}%'
         AND document_type='memory'\n       ORDER BY datetime(updated_at) DESC, id DESC\n       LIMIT 10\n     );`
  )[0];

  const rows = runSqlJson(
    dbPath,
    `SELECT id, file_path\n     FROM memory_index\n     WHERE spec_folder LIKE '${specFolderPrefix.replace(/'/g, "''")}%'
       AND document_type='memory'\n       AND (quality_flags IS NULL OR quality_score IS NULL)\n     ORDER BY datetime(updated_at) DESC, id DESC\n     LIMIT 50;`
  ) as DbRow[];

  let filesUpdated = 0;
  let rowsUpdated = 0;

  for (const row of rows) {
    const filePath = row.file_path;
    if (!filePath || !fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    if (!hasQualityKeys(content)) {
      const computed = computeQuality(content);
      const updated = injectQualityMetadata(content, computed.qualityScore, computed.qualityFlags);
      if (updated !== content) {
        fs.writeFileSync(filePath, updated, 'utf8');
        content = updated;
        filesUpdated += 1;
      }
    }

    const parsed = parseMemoryFile(filePath);
    const qualityScore = Number.isFinite(parsed.qualityScore) ? parsed.qualityScore : 0;
    const qualityFlagsJson = JSON.stringify(Array.isArray(parsed.qualityFlags) ? parsed.qualityFlags : []);

    runSql(
      dbPath,
      `UPDATE memory_index\n       SET quality_score = ${qualityScore},\n           quality_flags = '${qualityFlagsJson.replace(/'/g, "''")}',\n           updated_at = datetime('now')\n       WHERE id = ${Number(row.id)};`
    );
    rowsUpdated += 1;
  }

  const after = runSqlJson(
    dbPath,
    `SELECT COUNT(*) AS recent_rows,\n            SUM(CASE WHEN quality_score IS NOT NULL THEN 1 ELSE 0 END) AS quality_score_non_null,\n            SUM(CASE WHEN quality_flags IS NOT NULL THEN 1 ELSE 0 END) AS quality_flags_non_null\n     FROM (\n       SELECT id, quality_score, quality_flags\n       FROM memory_index\n       WHERE spec_folder LIKE '${specFolderPrefix.replace(/'/g, "''")}%'
         AND document_type='memory'\n       ORDER BY datetime(updated_at) DESC, id DESC\n       LIMIT 10\n     );`
  )[0];

  console.log(JSON.stringify({ before, after, filesUpdated, rowsUpdated }, null, 2));
}

main();
