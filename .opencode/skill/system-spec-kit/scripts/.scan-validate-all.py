#!/usr/bin/env python3
"""Run validate.sh --strict across every spec folder and summarize failures."""
import subprocess
import re
from pathlib import Path

ROOT = Path('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs')
VALIDATE = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh'
EXCLUDES = ('/z_archive/', '/z_future/', '/research/iterations/', '/review/iterations/',
            '/.tmp/', '/tmp-test-fixtures/')

folders = set()
for p in ROOT.rglob('spec.md'):
    s = str(p)
    if any(seg in s for seg in EXCLUDES):
        continue
    folders.add(str(p.parent))

folders = sorted(folders)
print(f'Scanning {len(folders)} spec folders...')

passed = 0
warns_only = 0
errors = 0
error_list = []
warn_list = []

for f in folders:
    try:
        r = subprocess.run(['bash', VALIDATE, f, '--strict'],
                           capture_output=True, text=True, timeout=60)
        out = r.stdout + r.stderr
    except subprocess.TimeoutExpired:
        errors += 1
        rel = f[len(str(ROOT))+1:]
        error_list.append(f'{rel} | TIMEOUT')
        continue
    m = re.search(r'Summary: Errors: (\d+)\s+Warnings: (\d+)', out)
    if not m:
        errors += 1
        rel = f[len(str(ROOT))+1:]
        error_list.append(f'{rel} | NO_SUMMARY')
        continue
    e, w = int(m.group(1)), int(m.group(2))
    rel = f[len(str(ROOT))+1:]
    if e > 0:
        errors += 1
        # Collect error rule names
        err_rules = re.findall(r'^✗ ([A-Z_]+):', out, re.MULTILINE)
        error_list.append(f'{rel} | errors={e} warns={w} | rules={",".join(set(err_rules))}')
    elif w > 0:
        warns_only += 1
        warn_rules = re.findall(r'^⚠ ([A-Z_]+):', out, re.MULTILINE)
        warn_list.append(f'{rel} | warns={w} | rules={",".join(set(warn_rules))}')
    else:
        passed += 1

print()
print('=== SUMMARY ===')
print(f'Total:       {len(folders)}')
print(f'PASSED:      {passed}')
print(f'WARNS only:  {warns_only}')
print(f'HAS ERRORS:  {errors}')
print()
print('=== FOLDERS WITH ERRORS ===')
for line in error_list:
    print(line)
print()
print(f'=== FOLDERS WITH WARNINGS ONLY ({len(warn_list)}) ===')
for line in warn_list[:30]:
    print(line)
if len(warn_list) > 30:
    print(f'...(and {len(warn_list)-30} more)')
