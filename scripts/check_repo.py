#!/usr/bin/env python3
"""Cheap, deterministic checks for this repository.

They confirm structure, links and punctuation. They cannot judge whether the
rules or the skills are any good.

    python3 scripts/check_repo.py
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_skills  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TEXT_SUFFIXES = {".md", ".html", ".js", ".json", ".py", ".yml"}
SKIP_DIRS = {".git", "node_modules"}
# Characters the house style rules out: em dash, en dash, curly quotes.
FORBIDDEN = {0x2014: "em dash", 0x2013: "en dash", 0x2018: "curly quote", 0x2019: "curly apostrophe",
             0x201C: "curly quote", 0x201D: "curly quote"}
MAX_SKILL_WORDS = 1400


def text_files(root):
    for path in sorted(Path(root).rglob("*")):
        if path.is_file() and path.suffix in TEXT_SUFFIXES and not (SKIP_DIRS & set(path.relative_to(root).parts)):
            yield path


def check_punctuation(root):
    problems = []
    for path in text_files(root):
        for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            for char in line:
                if ord(char) in FORBIDDEN:
                    problems.append("%s:%d has a %s" % (path.relative_to(root), number, FORBIDDEN[ord(char)]))
                    break
    return problems


def check_links(root):
    problems = []
    for path in text_files(root):
        if path.suffix == ".md":
            targets = re.findall(r"\]\(([^)\s]+)\)", path.read_text(encoding="utf-8"))
        elif path.suffix == ".html":
            targets = re.findall(r'(?:href|src)="([^"]+)"', path.read_text(encoding="utf-8"))
        else:
            continue
        for target in targets:
            if re.match(r"^(https?:|mailto:|#)", target):
                continue
            clean = target.split("#")[0]
            if clean and not (path.parent / clean).exists():
                problems.append("%s links to %s, which does not exist" % (path.relative_to(root), target))
    return problems


def check_skills(root):
    root = Path(root)
    problems = []
    manifest = build_skills.load(root / "rules")
    names = [s["name"] for s in manifest]
    if len(names) != len(set(names)):
        problems.append("rules/skills.json repeats a skill name")
    for name in build_skills.stale_skills(root):
        problems.append("skills/%s/SKILL.md is out of date: run scripts/build_skills.py" % name)
    for skill in manifest:
        path = root / "skills" / skill["name"] / "SKILL.md"
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        if not text.startswith("---\nname: %s\ndescription: " % skill["name"]):
            problems.append("%s has the wrong front matter" % path.relative_to(root))
        if "\n" in skill["description"] or len(skill["description"]) > 300:
            problems.append("%s: the description must be one line of 300 characters or fewer" % skill["name"])
        if re.search(r"\]\((?!https?:)[^)]*\)", text):
            problems.append("%s links to a file, but a pasted skill cannot open a link" % path.relative_to(root))
        if re.search(r"(?i)tested|evaluat|worked example|see the example", text.split("## What you must not do")[0]):
            problems.append("%s mentions a test or an example, which can cue a model that is being tested" % path.relative_to(root))
        if len(text.split()) > MAX_SKILL_WORDS:
            problems.append("%s is over %d words" % (path.relative_to(root), MAX_SKILL_WORDS))
        for heading in ("## The rules", "## Review", "## Rewrite", "## What you must not do"):
            if heading not in text:
                problems.append("%s is missing %s" % (path.relative_to(root), heading))
    return problems


def check_page(root):
    root = Path(root)
    problems = []
    page = root / "docs" / "index.html"
    if not page.exists():
        return ["docs/index.html is missing"]
    html = page.read_text(encoding="utf-8")
    for skill in build_skills.load(root / "rules"):
        command = "npx skills add shaunmarsden/say-it-plainly --skill " + skill["name"]
        if command not in html:
            problems.append("the page does not show the install command for " + skill["name"])
        if "skills/%s/SKILL.md" % skill["name"] not in html:
            problems.append("the page does not link " + skill["name"])
    core = (root / "rules" / "core.md").read_text(encoding="utf-8")
    leads = [re.sub(r"\*\*|\.$", "", m.group(1)).strip().rstrip(".") for m in re.finditer(r"^\d+\.\s+\*\*(.+?)\*\*", core, re.M)]
    items = [re.sub(r"<[^>]+>", "", m).strip().rstrip(".") for m in re.findall(r'<li>(.*?)</li>', html.split('class="rules"')[1].split("</ol>")[0])]
    if len(leads) != 12:
        problems.append("rules/core.md should hold twelve numbered rules, found %d" % len(leads))
    if len(items) != len(leads):
        problems.append("the page lists %d rules but rules/core.md has %d" % (len(items), len(leads)))
    for lead, item in zip(leads, items):
        # The last rule's lead is long; the page repeats its words, so compare the start.
        if not lead.lower().startswith(item.lower()[:25]) and not item.lower().startswith(lead.lower()[:25]):
            problems.append("the page rule '%s' does not match the core rule '%s'" % (item, lead))
    return problems


def run(root=ROOT):
    return check_punctuation(root) + check_links(root) + check_skills(root) + check_page(root)


def main():
    problems = run()
    if problems:
        print("\n".join(problems), file=sys.stderr)
        return 1
    print("All repository checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
