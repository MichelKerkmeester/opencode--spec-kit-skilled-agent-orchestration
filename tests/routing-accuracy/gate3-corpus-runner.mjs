import fs from 'node:fs';

import { classifyPrompt } from '../../.opencode/skill/system-spec-kit/shared/dist/gate-3-classifier.js';

const datasetPath = process.argv[2];
if (!datasetPath) {
  console.error('Usage: gate3-corpus-runner.mjs <labeled-prompts.jsonl>');
  process.exit(2);
}

const predictions = [];
const raw = fs.readFileSync(datasetPath, 'utf8');

for (const [index, line] of raw.split(/\r?\n/).entries()) {
  const trimmed = line.trim();
  if (!trimmed) {
    continue;
  }

  const row = JSON.parse(trimmed);
  if (!row.prompt) {
    throw new Error(`Line ${index + 1}: missing prompt`);
  }

  const result = classifyPrompt(row.prompt);
  predictions.push({
    id: row.id || `line-${index + 1}`,
    triggersGate3: result.triggersGate3,
    reason: result.reason,
    matched: result.matched.map((entry) => entry.pattern),
    readOnlyMatched: result.readOnlyMatched.map((entry) => entry.pattern),
  });
}

console.log(JSON.stringify(predictions));
