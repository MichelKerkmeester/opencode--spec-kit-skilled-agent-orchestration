// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Benchmark Fixture Materializer                                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index];
    if (!entry.startsWith('--')) continue;
    const [key, ...rest] = entry.slice(2).split('=');
    if (rest.length > 0) args[key] = rest.join('=');
    else if (argv[index + 1] && !argv[index + 1].startsWith('--')) args[key] = argv[++index];
    else args[key] = true;
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function resolveInput(value, baseDir) {
  if (path.isAbsolute(value)) return value;
  const fromCwd = path.resolve(process.cwd(), value);
  return fs.existsSync(fromCwd) ? fromCwd : path.resolve(baseDir, value);
}

function fixturePathFor(fixtureRef, fixtureDir) {
  return path.join(fixtureDir, fixtureRef.endsWith('.json') ? fixtureRef : `${fixtureRef}.json`);
}

function renderFixture(fixture) {
  if (typeof fixture.markdown === 'string') {
    return fixture.markdown.endsWith('\n') ? fixture.markdown : `${fixture.markdown}\n`;
  }

  const lines = [
    `# ${fixture.title || fixture.id}`,
    '',
    fixture.description || '',
    '',
    '## Candidate',
    '',
    `candidateId: ${fixture.id}`,
    '',
    '## Evidence',
    '',
    ...(fixture.content || []),
  ];
  if ((fixture.requiredHeadings || []).some((heading) => /legal stop/i.test(heading))) {
    lines.push('', '## Legal Stop', '', 'details.gateResults: present');
  }
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.profile || !args['outputs-dir']) {
    process.stderr.write('Usage: node materialize-benchmark-fixtures.cjs --profile <path> --outputs-dir <path>\n');
    process.exit(2);
  }

  const profilePath = path.resolve(process.cwd(), args.profile);
  if (!fs.existsSync(profilePath)) {
    process.stderr.write(`Benchmark profile not found: ${profilePath}\n`);
    process.exit(1);
  }

  const profile = readJson(profilePath);
  const fixtureDir = resolveInput(profile.fixtureDir || profile.benchmark?.fixtureDir, path.dirname(profilePath));
  const fixtureRefs = profile.fixtures || profile.benchmark?.fixtures || [];
  const outputsDir = path.resolve(process.cwd(), args['outputs-dir']);
  fs.mkdirSync(outputsDir, { recursive: true });

  for (const fixtureRef of fixtureRefs) {
    const filePath = fixturePathFor(fixtureRef, fixtureDir);
    if (!fs.existsSync(filePath)) {
      process.stderr.write(`Benchmark fixture not found: ${filePath}\n`);
      process.exit(1);
    }
    const fixture = readJson(filePath);
    fs.writeFileSync(path.join(outputsDir, `${fixture.id}.md`), renderFixture(fixture), 'utf8');
  }

  process.stdout.write(JSON.stringify({
    status: 'fixtures-materialized',
    profileId: profile.profileId || profile.id,
    outputsDir,
    fixtures: fixtureRefs.length,
  }) + '\n');
}

main();
