#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rulesPath = path.join(scriptDir, "router-rules.json");

function toLower(value) {
  return String(value).toLowerCase();
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(targetPath) {
  const raw = await fs.readFile(targetPath, "utf8");
  return JSON.parse(raw);
}

async function listImmediateSkillFiles(rootPath) {
  const files = [];
  if (!(await pathExists(rootPath))) {
    return files;
  }

  const entries = await fs.readdir(rootPath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const skillPath = path.join(rootPath, entry.name, "SKILL.md");
    if (await pathExists(skillPath)) {
      files.push(skillPath);
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function findSkillFileBySuffix(skillFiles, suffix) {
  const normalizedSuffix = String(suffix || "").split("/").join(path.sep);
  const matches = skillFiles.filter((skillFile) => skillFile.endsWith(normalizedSuffix));
  if (matches.length === 0) {
    return null;
  }
  return matches.sort((a, b) => a.localeCompare(b))[0];
}

async function run() {
  const startedAt = new Date().toISOString();
  const rules = await readJson(rulesPath);

  const skillFileLists = await Promise.all(
    (rules.skillRoots || []).map((rootPath) => listImmediateSkillFiles(rootPath))
  );
  const allSkillFiles = skillFileLists.flat().sort((a, b) => a.localeCompare(b));

  const skillContentByFile = new Map();
  for (const skillFile of allSkillFiles) {
    skillContentByFile.set(skillFile, toLower(await fs.readFile(skillFile, "utf8")));
  }

  const ambiguityRules = rules.ambiguityFixtures || {};
  const ambiguityRoot = path.join(scriptDir, ambiguityRules.relativeRoot || "fixtures");
  const fixtureFiles = ambiguityRules.requiredJsonFiles || [];

  const fixtureResults = [];
  const skillScores = [];

  for (const relPath of fixtureFiles) {
    const fixturePath = path.join(ambiguityRoot, relPath);
    if (!(await pathExists(fixturePath))) {
      fixtureResults.push({
        fixture: relPath,
        pass: false,
        reason: "missing-fixture-file"
      });
      continue;
    }

    const fixtureData = await readJson(fixturePath);
    const requiredKeys = ambiguityRules.requiredKeys || [];
    const missingKeys = requiredKeys.filter((key) => !(key in fixtureData));

    if (missingKeys.length > 0) {
      fixtureResults.push({
        fixture: relPath,
        pass: false,
        reason: "invalid-fixture-schema",
        missingKeys
      });
      continue;
    }

    const coverage = [];
    for (const [skillSuffix, patterns] of Object.entries(fixtureData.skillPatterns || {})) {
      const skillFile = findSkillFileBySuffix(allSkillFiles, skillSuffix);
      if (!skillFile) {
        coverage.push({
          skillSuffix,
          pass: false,
          coverageScore: 0,
          missingPatterns: patterns
        });
        continue;
      }

      const content = skillContentByFile.get(skillFile) || "";
      const requiredPatterns = Array.isArray(patterns) ? patterns : [];
      const missingPatterns = requiredPatterns.filter(
        (pattern) => !content.includes(toLower(pattern))
      );
      const matchedCount = requiredPatterns.length - missingPatterns.length;
      const coverageScore = requiredPatterns.length === 0
        ? 100
        : Math.round((matchedCount / requiredPatterns.length) * 100);

      coverage.push({
        skillSuffix,
        skillFile,
        pass: missingPatterns.length === 0,
        coverageScore,
        missingPatterns
      });

      skillScores.push({ skillSuffix, coverageScore });
    }

    fixtureResults.push({
      fixture: relPath,
      fixtureId: fixtureData.id,
      pass: coverage.every((item) => item.pass),
      prompt: fixtureData.prompt,
      coverage
    });
  }

  const averageCoverage = skillScores.length === 0
    ? 0
    : Math.round(skillScores.reduce((sum, item) => sum + item.coverageScore, 0) / skillScores.length);

  const report = {
    startedAt,
    finishedAt: new Date().toISOString(),
    summary: {
      fixtures: fixtureFiles.length,
      passedFixtures: fixtureResults.filter((item) => item.pass).length,
      averageCoverage,
      skillFilesScanned: allSkillFiles.length
    },
    fixtureResults
  };

  const reportPath = path.join(scriptDir, "reports/benchmark-latest.json");
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(
    `Router benchmark: fixtures ${fixtureFiles.length} | avg coverage ${averageCoverage}%`
  );

  if (fixtureResults.some((item) => !item.pass)) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error("Router benchmark failed:", error.message);
  process.exitCode = 2;
});
