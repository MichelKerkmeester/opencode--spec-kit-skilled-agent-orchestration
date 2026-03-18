// Test: Memory Quality Lane
'use strict';

const path = require('path');
const fs = require('fs');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const validator = require(path.join(DIST_DIR, 'memory', 'validate-memory-quality.js'));
const contamination = require(path.join(DIST_DIR, 'extractors', 'contamination-filter.js'));
const decisionExtractor = require(path.join(DIST_DIR, 'extractors', 'decision-extractor.js'));
const qualityScorer = require(path.join(DIST_DIR, 'extractors', 'quality-scorer.js'));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function runValidatorRuleTests() {
  const validContent = `\
\`\`\`yaml
spec_folder: "02--system-spec-kit/020-mcp-working-memory-hybrid-rag"
tool_count: 9
trigger_phrases:
  - "memory"
  - "quality"
\`\`\`

# Title

Decision: adopt deterministic scoring.
`;

  const valid = validator.validateMemoryQualityContent(validContent);
  assert(valid.valid === true, 'V-all should pass on valid fixture');

  const v1 = validator.validateMemoryQualityContent(validContent.replace('Decision: adopt deterministic scoring.', 'decisions: [TBD]'));
  assert(v1.failedRules.includes('V1'), 'V1 should fail when [TBD] leaks');

  const v2 = validator.validateMemoryQualityContent(validContent.replace('tool_count: 9', 'tool_count: 9\nblockers: [N/A]'));
  assert(v2.failedRules.includes('V2'), 'V2 should fail when [N/A] leaks with tools');

  const v3 = validator.validateMemoryQualityContent(validContent.replace('spec_folder: "02--system-spec-kit/020-mcp-working-memory-hybrid-rag"', 'spec_folder: "**bad**"'));
  assert(v3.failedRules.includes('V3'), 'V3 should fail malformed spec_folder');

  const v4 = validator.validateMemoryQualityContent(validContent + '\nNo specific decisions were made during this session.\n');
  assert(v4.failedRules.includes('V4'), 'V4 should fail fallback sentence');

  const v5 = validator.validateMemoryQualityContent(validContent.replace('  - "memory"\n  - "quality"', '  []'));
  assert(v5.failedRules.includes('V5'), 'V5 should fail empty trigger_phrases with >=5 tools');

  const inlineTriggerPhrases = validator.validateMemoryQualityContent(
    validContent.replace(
      'trigger_phrases:\n  - "memory"\n  - "quality"',
      'trigger_phrases: ["memory", "quality"]'
    )
  );
  assert(inlineTriggerPhrases.valid === true, 'inline trigger_phrases list should count as populated');
}

function runContaminationTests() {
  const filtered1 = contamination.filterContamination("I'll execute this step by step and then proceed.");
  assert(filtered1.hadContamination === true, 'contamination positive #1 should detect');

  const filtered2 = contamination.filterContamination('Let me analyze the failure and report back.');
  assert(filtered2.hadContamination === true, 'contamination positive #2 should detect');

  const clean1 = contamination.filterContamination('Decision: adopt typed validator module.');
  assert(clean1.hadContamination === false, 'contamination negative #1 should pass');

  const clean2 = contamination.filterContamination('I needled this case in a test title.');
  assert(clean2.hadContamination === false, 'contamination negative #2 should pass');

  const empty = contamination.filterContamination('');
  assert(empty.cleanedText === '', 'contamination empty input should return empty text');
}

async function runDecisionCueTests() {
  const result = await decisionExtractor.extractDecisions({
    SPEC_FOLDER: '02--system-spec-kit/020-mcp-working-memory-hybrid-rag',
    observations: [
      { narrative: 'We decided to keep strict validation in post-render stage.' },
      { narrative: 'Selected a fallback strategy for sparse trigger phrases.' },
      { narrative: 'This is just an implementation detail without choice wording.' },
    ],
    userPrompts: [
      { prompt: 'We will use lexical cues for decision extraction.' },
      { prompt: 'Prefer deterministic quality score calculations.' },
    ],
  });

  assert(result.DECISION_COUNT >= 4, 'decision lexical cues should produce concrete decisions');

  const noDecision = await decisionExtractor.extractDecisions({
    SPEC_FOLDER: '02--system-spec-kit/020-mcp-working-memory-hybrid-rag',
    observations: [{ narrative: 'Updated tests and cleaned output format.' }],
    userPrompts: [{ prompt: 'Run validation and collect logs.' }],
  });

  assert(noDecision.DECISION_COUNT === 0, 'no lexical cues should keep decision count at 0');
}

function runQualityScorerTests() {
  const allBad = qualityScorer.scoreMemoryQuality({
    content: 'x',
    validatorSignals: [
      { ruleId: 'V1', passed: false },
      { ruleId: 'V2', passed: false },
      { ruleId: 'V3', passed: false },
      { ruleId: 'V4', passed: false },
      { ruleId: 'V5', passed: false },
    ],
    hadContamination: true,
    messageCount: 0,
    toolCount: 0,
    decisionCount: 0,
  });
  assert(allBad.qualityScore === 0, 'all bad case should clamp to 0.0');

  const allGood = qualityScorer.scoreMemoryQuality({
    content: '# good',
    validatorSignals: [
      { ruleId: 'V1', passed: true },
      { ruleId: 'V2', passed: true },
      { ruleId: 'V3', passed: true },
      { ruleId: 'V4', passed: true },
      { ruleId: 'V5', passed: true },
    ],
    hadContamination: false,
    messageCount: 10,
    toolCount: 7,
    decisionCount: 2,
  });
  assert(allGood.qualityScore >= 0.9, 'all good case should be >= 0.9');
  assert(allGood.score01 === allGood.qualityScore, 'score01 should be the canonical alias for qualityScore');
  assert(allGood.score100 === Math.round(allGood.score01 * 100), 'score100 should mirror the canonical score01 scale');

  const mixed = qualityScorer.scoreMemoryQuality({
    content: '# mixed',
    validatorSignals: [
      { ruleId: 'V1', passed: false },
      { ruleId: 'V2', passed: false },
      { ruleId: 'V3', passed: true },
      { ruleId: 'V4', passed: true },
      { ruleId: 'V5', passed: true },
    ],
    hadContamination: false,
    messageCount: 0,
    toolCount: 0,
    decisionCount: 0,
  });
  assert(Math.abs(mixed.qualityScore - 0.5) < 0.0001, 'mixed two-failure case should equal 0.5');

  const contaminated = qualityScorer.scoreMemoryQuality({
    content: '# contaminated',
    validatorSignals: [
      { ruleId: 'V1', passed: true },
      { ruleId: 'V2', passed: true },
      { ruleId: 'V3', passed: true },
      { ruleId: 'V4', passed: true },
      { ruleId: 'V5', passed: true },
    ],
    hadContamination: true,
    messageCount: 10,
    toolCount: 7,
    decisionCount: 2,
  });
  assert(contaminated.qualityScore <= 0.6, 'contamination with default high severity should cap at 0.6');
  assert(inadequateFlagPresent(contaminated.qualityFlags, 'has_contamination'), 'contamination should add explicit flag');

  const lowSev = qualityScorer.scoreMemoryQuality({
    content: '# low severity',
    validatorSignals: [
      { ruleId: 'V1', passed: true },
      { ruleId: 'V2', passed: true },
      { ruleId: 'V3', passed: true },
      { ruleId: 'V4', passed: true },
      { ruleId: 'V5', passed: true },
    ],
    hadContamination: true,
    contaminationSeverity: 'low',
    messageCount: 10,
    toolCount: 7,
    decisionCount: 2,
  });
  assert(lowSev.qualityScore > 0.6, 'low severity contamination should NOT cap at 0.6');

  const medSev = qualityScorer.scoreMemoryQuality({
    content: '# medium severity',
    validatorSignals: [
      { ruleId: 'V1', passed: true },
      { ruleId: 'V2', passed: true },
      { ruleId: 'V3', passed: true },
      { ruleId: 'V4', passed: true },
      { ruleId: 'V5', passed: true },
    ],
    hadContamination: true,
    contaminationSeverity: 'medium',
    messageCount: 10,
    toolCount: 7,
    decisionCount: 2,
  });
  assert(medSev.qualityScore <= 0.85, 'medium severity should cap at 0.85');
  assert(medSev.qualityScore > 0.6, 'medium severity should NOT cap at 0.6');

  const empty = qualityScorer.scoreMemoryQuality({ content: '' });
  assert(empty.qualityScore === 0, 'empty file should score 0');
  assert(!inadequateFlagPresent(empty.qualityFlags, 'has_contamination'), 'empty file should not report contamination when none was detected');

  const emptyContaminated = qualityScorer.scoreMemoryQuality({ content: '', hadContamination: true });
  assert(inadequateFlagPresent(emptyContaminated.qualityFlags, 'has_contamination'), 'empty file should preserve explicit contamination flags when contamination was detected');

  const bonusClamp = qualityScorer.scoreMemoryQuality({
    content: '# bonus',
    validatorSignals: [
      { ruleId: 'V1', passed: true },
      { ruleId: 'V2', passed: true },
      { ruleId: 'V3', passed: true },
      { ruleId: 'V4', passed: true },
      { ruleId: 'V5', passed: true },
    ],
    messageCount: 50,
    toolCount: 20,
    decisionCount: 10,
  });
  assert(bonusClamp.qualityScore <= 1, 'bonus case should clamp to 1.0');

  const insufficient = qualityScorer.scoreMemoryQuality({
    content: '# thin but aligned',
    validatorSignals: [
      { ruleId: 'V1', passed: true },
      { ruleId: 'V2', passed: true },
      { ruleId: 'V3', passed: true },
      { ruleId: 'V4', passed: true },
      { ruleId: 'V5', passed: true },
    ],
    messageCount: 3,
    toolCount: 1,
    decisionCount: 0,
    sufficiencyScore: 0.2,
    insufficientContext: true,
  });
  assert(inadequateFlagPresent(insufficient.qualityFlags), 'insufficient context should add explicit flag');
  assert(insufficient.qualityScore <= 0.2, 'insufficient context should cap the v2 score');
}

function inadequateFlagPresent(flags, flag = 'has_insufficient_context') {
  return Array.isArray(flags) && flags.includes(flag);
}

function runErrorContentTests() {
  // V11 should fail on error-dominated description
  const errorDesc = `\
\`\`\`yaml
spec_folder: "05--agent-orchestration/028-auto-deep-research"
tool_count: 5
description: "API Error: 500 bad response"
trigger_phrases:
  - "research"
  - "investigation"
\`\`\`

# Error Test

Decision: proceed with implementation.
`;
  const v11Desc = validator.validateMemoryQualityContent(errorDesc);
  assert(v11Desc.failedRules.includes('V11'), 'V11 should fail when description contains API error text');

  // V11 should fail on error-dominated trigger phrases
  const errorTriggers = `\
\`\`\`yaml
spec_folder: "05--agent-orchestration/028-auto-deep-research"
tool_count: 5
trigger_phrases:
  - "api error type error"
  - "error request req_011cz9"
  - "500 internal server"
  - "api api overloaded"
  - "clean phrase"
\`\`\`

# Error Triggers Test

Decision: proceed with implementation.
`;
  const v11Triggers = validator.validateMemoryQualityContent(errorTriggers);
  assert(v11Triggers.failedRules.includes('V11'), 'V11 should fail when >50% trigger phrases contain error vocabulary');

  // V11 should pass on clean content
  const cleanContent = `\
\`\`\`yaml
spec_folder: "02--system-spec-kit/020-mcp-working-memory-hybrid-rag"
tool_count: 9
trigger_phrases:
  - "memory"
  - "quality"
\`\`\`

# Clean Title

Decision: adopt deterministic scoring.
`;
  const v11Clean = validator.validateMemoryQualityContent(cleanContent);
  assert(!v11Clean.failedRules.includes('V11'), 'V11 should pass on clean memory content');

  // Scorer should add has_error_content flag for V11 failure
  const errorScored = qualityScorer.scoreMemoryQuality({
    content: '# error content',
    validatorSignals: [
      { ruleId: 'V11', passed: false },
    ],
    hadContamination: true,
    messageCount: 10,
    toolCount: 7,
    decisionCount: 2,
  });
  assert(inadequateFlagPresent(errorScored.qualityFlags, 'has_error_content'), 'V11 failure should add has_error_content flag');
}

function runBenchmarkFixtureTest() {
  const benchmarkRoots = [
    path.join(__dirname, '..', 'test-fixtures', 'memory-quality-benchmarks'),
    path.join(__dirname, '..', 'test-fixtures', 'quality-benchmarks'),
    path.join(
      __dirname,
      '..', '..', '..', '..', 'specs',
      '02--system-spec-kit',
      '136-mcp-working-memory-hybrid-rag',
      'scratch',
      'quality-benchmarks'
    ),
    path.join(
      __dirname,
      '..', '..', '..', '..', '..', 'specs',
      '02--system-spec-kit',
      '136-mcp-working-memory-hybrid-rag',
      'scratch',
      'quality-benchmarks'
    ),
  ];

  const readFixtures = (dir) => fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => ({
      name,
      content: fs.readFileSync(path.join(dir, name), 'utf-8')
    }));

  let badFixtures = [];
  let goodFixtures = [];
  for (const root of benchmarkRoots) {
    const badDir = path.join(root, 'bad');
    const goodDir = path.join(root, 'good');
    if (fs.existsSync(badDir) && fs.existsSync(goodDir)) {
      badFixtures = readFixtures(badDir);
      goodFixtures = readFixtures(goodDir);
      if (badFixtures.length > 0 && goodFixtures.length > 0) {
        break;
      }
    }
  }

  if (badFixtures.length === 0 || goodFixtures.length === 0) {
    const inlineGoodFixture = `\
\`\`\`yaml
spec_folder: "02--system-spec-kit/020-mcp-working-memory-hybrid-rag"
tool_count: 9
trigger_phrases:
  - "memory"
  - "quality"
\`\`\`

# Inline benchmark fixture

Decision: adopt deterministic scoring.
`;

    goodFixtures = [
      { name: 'inline-good.md', content: inlineGoodFixture },
    ];
    badFixtures = [
      {
        name: 'inline-bad-v1.md',
        content: inlineGoodFixture.replace(
          'Decision: adopt deterministic scoring.',
          'decisions: [TBD]'
        )
      },
      {
        name: 'inline-bad-v2.md',
        content: inlineGoodFixture.replace(
          'tool_count: 9',
          'tool_count: 9\nblockers: [N/A]'
        )
      },
    ];
  }

  for (const fixture of badFixtures) {
    const result = validator.validateMemoryQualityContent(fixture.content);
    assert(result.valid === false, `bad fixture should fail: ${fixture.name}`);
  }

  for (const fixture of goodFixtures) {
    const result = validator.validateMemoryQualityContent(fixture.content);
    assert(result.valid === true, `good fixture should pass: ${fixture.name}`);
  }
}

async function main() {
  runValidatorRuleTests();
  runContaminationTests();
  await runDecisionCueTests();
  runQualityScorerTests();
  runErrorContentTests();
  runBenchmarkFixtureTest();
  console.log('test-memory-quality-lane: PASS');
}

main().catch((error) => {
  console.error('test-memory-quality-lane: FAIL');
  console.error(error.message);
  process.exit(1);
});
