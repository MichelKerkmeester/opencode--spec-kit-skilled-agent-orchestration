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

async function walkMarkdownFiles(rootPath) {
  const discovered = [];

  async function visit(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const nextPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await visit(nextPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        discovered.push(nextPath);
      }
    }
  }

  if (await pathExists(rootPath)) {
    await visit(rootPath);
  }

  return discovered.sort((a, b) => a.localeCompare(b));
}

function findSkillFileBySuffix(skillFiles, suffix) {
  const normalizedSuffix = String(suffix || "").split("/").join(path.sep);
  const matches = skillFiles.filter((skillFile) => skillFile.endsWith(normalizedSuffix));
  if (matches.length === 0) {
    return null;
  }
  return matches.sort((a, b) => a.localeCompare(b))[0];
}

function markerMatches(content, marker) {
  for (const pattern of marker.patterns) {
    try {
      const regex = new RegExp(pattern, "i");
      if (regex.test(content)) {
        return true;
      }
    } catch {
      // Invalid marker regex should not crash test execution.
    }
  }
  return false;
}

async function listImmediateSubdirectories(targetPath) {
  if (!(await pathExists(targetPath))) {
    return [];
  }

  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function isSubdirMentioned(skillText, categoryName, subdirName) {
  const lowered = toLower(skillText);
  const escaped = subdirName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const variants = [
    new RegExp(`\\b${escaped}\\b`, "i"),
    new RegExp(`${categoryName}[/\\\\]${escaped}`, "i")
  ];
  return variants.some((rx) => rx.test(lowered));
}

function addAssertion(assertions, name, pass, details = {}) {
  assertions.push({ name, pass, details });
}

function normalizeHeadingText(text) {
  return String(text)
    .replace(/^\s*\d+(?:\.\d+)*\.?\s+/, "")
    .replace(/^[^A-Za-z0-9]+/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function parseMarkdownHeadings(content) {
  const lines = String(content).split(/\r?\n/);
  const headings = [];
  let inFencedCodeBlock = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (/^```/.test(line.trim())) {
      inFencedCodeBlock = !inFencedCodeBlock;
      continue;
    }

    if (inFencedCodeBlock) {
      continue;
    }

    const match = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (!match) {
      continue;
    }

    const level = match[1].length;
    const text = match[2].trim();
    headings.push({
      level,
      text,
      normalized: normalizeHeadingText(text),
      line: index + 1,
      raw: line
    });
  }

  return headings;
}

function findSmartRoutingSectionH3(headings, rules) {
  const sectionNames = new Set(
    rules.headingChecks.smartRoutingSections.map((name) => normalizeHeadingText(name))
  );

  const smartRoutingHeadingIndex = headings.findIndex(
    (heading) => heading.level === 2 && sectionNames.has(heading.normalized)
  );

  if (smartRoutingHeadingIndex === -1) {
    return {
      sectionFound: false,
      h3Headings: []
    };
  }

  const h3Headings = [];
  for (let index = smartRoutingHeadingIndex + 1; index < headings.length; index += 1) {
    const heading = headings[index];
    if (heading.level <= 2) {
      break;
    }
    if (heading.level === 3) {
      h3Headings.push(heading);
    }
  }

  return {
    sectionFound: true,
    h3Headings
  };
}

async function run() {
  const startedAt = new Date().toISOString();
  const rules = await readJson(rulesPath);
  const assertions = [];
  const scannedSkills = [];
  const skillContentByFile = new Map();

  const skillFileLists = await Promise.all(
    rules.skillRoots.map((rootPath) => listImmediateSkillFiles(rootPath))
  );
  const allSkillFiles = skillFileLists.flat().sort((a, b) => a.localeCompare(b));

  addAssertion(assertions, "skill-files-discovered", allSkillFiles.length > 0, {
    roots: rules.skillRoots,
    discoveredCount: allSkillFiles.length
  });

  const recursiveMarker = rules.requiredMarkers.find(
    (marker) => marker.id === "recursive-discovery"
  );

  for (const skillFile of allSkillFiles) {
    const content = await fs.readFile(skillFile, "utf8");
    skillContentByFile.set(skillFile, content);
    const headings = parseMarkdownHeadings(content);

    const markerResults = {};
    for (const marker of rules.requiredMarkers) {
      markerResults[marker.id] = markerMatches(content, marker);
    }

    const bannedHits = rules.bannedPhrases.filter((phrase) => content.includes(phrase));

    addAssertion(
      assertions,
      `markers-present:${skillFile}`,
      Object.values(markerResults).every(Boolean),
      { markerResults }
    );

    addAssertion(
      assertions,
      `banned-phrases-absent:${skillFile}`,
      bannedHits.length === 0,
      { bannedHits }
    );

    const forbiddenH3Names = new Set(
      rules.headingChecks.forbiddenH3.map((name) => normalizeHeadingText(name))
    );
    const forbiddenH3Headings = headings.filter(
      (heading) => heading.level === 3 && forbiddenH3Names.has(heading.normalized)
    );

    addAssertion(
      assertions,
      `activation-detection-absent:${skillFile}`,
      forbiddenH3Headings.length === 0,
      {
        forbiddenMatches: forbiddenH3Headings.map((heading) => ({
          heading: heading.text,
          line: heading.line
        }))
      }
    );

    const smartRoutingResult = findSmartRoutingSectionH3(headings, rules);
    const requiredH3Names = new Set(
      (rules.headingChecks.requiredH3InSmartRouting || []).map((name) => normalizeHeadingText(name))
    );
    const presentH3Names = new Set(
      smartRoutingResult.h3Headings.map((heading) => heading.normalized)
    );
    const missingRequiredH3 = Array.from(requiredH3Names).filter(
      (requiredName) => !presentH3Names.has(requiredName)
    );

    addAssertion(
      assertions,
      `smart-routing-required-h3:${skillFile}`,
      smartRoutingResult.sectionFound && missingRequiredH3.length === 0,
      {
        smartRoutingSectionFound: smartRoutingResult.sectionFound,
        requiredH3: rules.headingChecks.requiredH3InSmartRouting || [],
        missingRequiredH3,
        foundH3InSmartRouting: smartRoutingResult.h3Headings.map((heading) => ({
          heading: heading.text,
          line: heading.line
        }))
      }
    );

    const smartRouterHeadingName = normalizeHeadingText("SMART ROUTER PSEUDOCODE");
    const smartRouterPseudocodeCount = smartRoutingResult.h3Headings.filter(
      (heading) => heading.normalized === smartRouterHeadingName
    ).length;

    addAssertion(
      assertions,
      `smart-router-pseudocode-single:${skillFile}`,
      smartRoutingResult.sectionFound && smartRouterPseudocodeCount === 1,
      {
        smartRoutingSectionFound: smartRoutingResult.sectionFound,
        smartRouterPseudocodeCount
      }
    );

    const baseDir = path.dirname(skillFile);
    const referencesSubdirs = await listImmediateSubdirectories(path.join(baseDir, "references"));
    const assetsSubdirs = await listImmediateSubdirectories(path.join(baseDir, "assets"));

    const unlistedReferences = referencesSubdirs.filter(
      (name) => !isSubdirMentioned(content, "references", name)
    );
    const unlistedAssets = assetsSubdirs.filter(
      (name) => !isSubdirMentioned(content, "assets", name)
    );
    const hasUnlisted = unlistedReferences.length > 0 || unlistedAssets.length > 0;

    addAssertion(
      assertions,
      `recursive-marker-required-for-unlisted:${skillFile}`,
      !hasUnlisted || Boolean(markerResults[recursiveMarker.id]),
      {
        hasUnlisted,
        unlistedReferences,
        unlistedAssets,
        recursiveMarkerPresent: Boolean(markerResults[recursiveMarker.id])
      }
    );

    scannedSkills.push({
      skillFile,
      markerResults,
      bannedHits,
      headingCount: headings.length,
      referencesSubdirs,
      assetsSubdirs,
      unlistedReferences,
      unlistedAssets
    });
  }

  const fixtureRoot = path.join(scriptDir, rules.fixture.relativeRoot);
  const fixtureMarkdownFiles = await walkMarkdownFiles(fixtureRoot);
  const fixtureMarkdownRelative = fixtureMarkdownFiles.map((absolutePath) =>
    path.relative(fixtureRoot, absolutePath).split(path.sep).join("/")
  );
  const missingFixtureFiles = rules.fixture.requiredMarkdownFiles.filter(
    (relPath) => !fixtureMarkdownRelative.includes(relPath)
  );

  addAssertion(
    assertions,
    "fixture-recursive-discovery-finds-nested-unlisted-markdown",
    missingFixtureFiles.length === 0,
    {
      fixtureRoot,
      discoveredMarkdownFiles: fixtureMarkdownRelative,
      missingFixtureFiles
    }
  );

  const ambiguityRules = rules.ambiguityFixtures || null;
  if (ambiguityRules) {
    const ambiguityRoot = path.join(scriptDir, ambiguityRules.relativeRoot || "fixtures");

    for (const relPath of ambiguityRules.requiredJsonFiles || []) {
      const fixturePath = path.join(ambiguityRoot, relPath);
      const exists = await pathExists(fixturePath);

      addAssertion(
        assertions,
        `ambiguity-fixture-exists:${relPath}`,
        exists,
        { fixturePath }
      );

      if (!exists) {
        continue;
      }

      let fixtureData = null;
      try {
        fixtureData = await readJson(fixturePath);
      } catch (error) {
        addAssertion(
          assertions,
          `ambiguity-fixture-json-valid:${relPath}`,
          false,
          { fixturePath, error: error.message }
        );
        continue;
      }

      const requiredKeys = ambiguityRules.requiredKeys || [];
      const missingKeys = requiredKeys.filter((key) => !(key in fixtureData));
      addAssertion(
        assertions,
        `ambiguity-fixture-schema:${relPath}`,
        missingKeys.length === 0,
        { fixturePath, requiredKeys, missingKeys }
      );

      if (missingKeys.length > 0 || typeof fixtureData.skillPatterns !== "object") {
        continue;
      }

      for (const [skillSuffix, patterns] of Object.entries(fixtureData.skillPatterns)) {
        const skillFile = findSkillFileBySuffix(allSkillFiles, skillSuffix);
        if (!skillFile) {
          addAssertion(
            assertions,
            `ambiguity-patterns-skill-found:${relPath}:${skillSuffix}`,
            false,
            { skillSuffix, availableSkillFiles: allSkillFiles }
          );
          continue;
        }

        const content = toLower(skillContentByFile.get(skillFile) || "");
        const patternList = Array.isArray(patterns) ? patterns : [];
        const missingPatterns = patternList.filter(
          (pattern) => !content.includes(toLower(pattern))
        );

        addAssertion(
          assertions,
          `ambiguity-patterns-covered:${relPath}:${skillSuffix}`,
          missingPatterns.length === 0,
          {
            skillFile,
            requiredPatterns: patternList,
            missingPatterns
          }
        );
      }
    }
  }

  const passed = assertions.filter((item) => item.pass).length;
  const failed = assertions.length - passed;

  const reportPath = path.join(scriptDir, rules.report.relativePath);
  await fs.mkdir(path.dirname(reportPath), { recursive: true });

  const report = {
    startedAt,
    finishedAt: new Date().toISOString(),
    summary: {
      total: assertions.length,
      passed,
      failed,
      skillFilesScanned: allSkillFiles.length
    },
    assertions,
    scannedSkills
  };

  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(
    `Smart Router tests: total ${assertions.length} | passed ${passed} | failed ${failed}`
  );

  if (failed > 0) {
    const failedItems = assertions.filter((item) => !item.pass).slice(0, 10);
    for (const item of failedItems) {
      console.log(`FAIL: ${item.name}`);
    }
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error("Smart Router test runner failed:", error.message);
  process.exitCode = 2;
});
