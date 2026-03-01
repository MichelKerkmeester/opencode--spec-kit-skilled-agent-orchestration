#!/usr/bin/env python3
"""Strip emojis from H2 headings and TOC entries in markdown files.
Spec: 005-remove-emojis-from-docs | Shared transformation script.

Usage: python3 strip_emojis.py <directory> [--exempt file1 file2 ...]
"""
import re, sys, os

# Comprehensive emoji Unicode ranges covering decorative heading emojis
_E = re.compile('['
    '\U0001F300-\U0001F9FF'  # Misc Symbols, Emoticons, Transport, Maps
    '\U0001FA00-\U0001FAFF'  # Symbols and Pictographs Extended-A
    '\U0001F000-\U0001F02F'  # Mahjong, Dominos
    '\U0001F1E0-\U0001F1FF'  # Regional indicators (flags)
    '\U00002600-\U000026FF'  # Misc Symbols
    '\U00002700-\U000027BF'  # Dingbats
    '\U0000FE00-\U0000FE0F'  # Variation Selectors
    '\U0000200D'             # Zero Width Joiner
    '\U000020E3'             # Combining Enclosing Keycap
    '\U000023E9-\U000023FA'  # Control symbols
    '\U000025AA-\U000025FE'  # Geometric shapes
    '\U00002934-\U00002935'  # Arrows
    '\U00002B05-\U00002B07'  # Arrows
    '\U00002B1B-\U00002B1C'  # Squares
    '\U00002B50'             # Star
    '\U00002B55'             # Circle
    '\U0000231A-\U0000231B'  # Watch, Hourglass
    '\U00003030'             # Wavy dash
    '\U0000303D'             # Part alternation mark
    '\U00003297'             # Circled Ideograph Congratulation
    '\U00003299'             # Circled Ideograph Secret
    ']+')


def _strip_heading(ln):
    """Strip emojis from a heading line, preserving leading whitespace."""
    stripped = ln.lstrip()
    leading = ln[:len(ln) - len(stripped)]
    cleaned = _E.sub('', stripped)
    cleaned = re.sub(r'  +', ' ', cleaned)
    return leading + cleaned


def process_file(fp):
    """Process a single .md file. Returns (was_modified, message)."""
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False, f'READ_ERROR: {e}'

    if not _E.search(content):
        return False, 'clean'

    lines = content.split('\n')
    out, changed = [], False

    for ln in lines:
        orig = ln

        # 1. H2 headings (## with emoji) - works both at line start and indented (code blocks)
        if ln.lstrip().startswith('## ') and _E.search(ln):
            ln = _strip_heading(ln)

        # 2. TOC markdown links: [text with emoji](url)
        if _E.search(ln) and '](' in ln:
            def _clean_link(m):
                txt, url = m.group(1), m.group(2)
                if _E.search(txt):
                    txt = re.sub(r'  +', ' ', _E.sub('', txt))
                return f'[{txt}]({url})'
            ln = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', _clean_link, ln)

        if ln != orig:
            changed = True
        out.append(ln)

    if changed:
        try:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write('\n'.join(out))
            return True, 'modified'
        except Exception as e:
            return False, f'WRITE_ERROR: {e}'

    return False, 'emojis_not_in_h2_or_toc'


def main():
    if len(sys.argv) < 2:
        print('Usage: strip_emojis.py <directory> [--exempt file1 file2 ...]')
        sys.exit(1)

    target = sys.argv[1]
    exempt = set()
    if '--exempt' in sys.argv:
        idx = sys.argv.index('--exempt')
        exempt = set(os.path.abspath(p) for p in sys.argv[idx + 1:])

    if not os.path.isdir(target):
        print(f'ERROR: {target} is not a directory', file=sys.stderr)
        sys.exit(1)

    skip_dirs = {'node_modules', '.git', '__pycache__', 'venv', '.venv'}
    mods, total, errors = 0, 0, 0

    for root, dirs, files in os.walk(target):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for f in sorted(files):
            if not f.endswith('.md'):
                continue
            fp = os.path.join(root, f)
            if os.path.abspath(fp) in exempt:
                continue
            total += 1
            ok, msg = process_file(fp)
            if ok:
                mods += 1
                print(f'  MOD: {os.path.relpath(fp, target)}')
            elif msg.startswith('ERROR') or msg.startswith('READ_ERROR') or msg.startswith('WRITE_ERROR'):
                errors += 1
                print(f'  ERR: {os.path.relpath(fp, target)} - {msg}')

    print(f'\n{"="*60}')
    print(f'Directory: {target}')
    print(f'Scanned: {total} | Modified: {mods} | Unchanged: {total - mods - errors} | Errors: {errors}')
    print(f'{"="*60}')
    sys.exit(0 if errors == 0 else 1)


if __name__ == '__main__':
    main()
