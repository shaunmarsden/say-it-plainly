#!/usr/bin/env python3
"""Assemble each skill's SKILL.md from the rule sources in rules/.

Every skill is built self-contained: the rules are written into the file and
nothing is linked. A skill is pasted into a chat on its own, and a pasted file
cannot open a link. Edit the sources, never the generated files.

    python3 scripts/build_skills.py            write skills/*/SKILL.md
    python3 scripts/build_skills.py --check    exit 1 if any skill is out of date
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def read(rules_dir, name):
    return (Path(rules_dir) / name).read_text(encoding="utf-8").strip()


def load(rules_dir):
    return json.loads((Path(rules_dir) / "skills.json").read_text(encoding="utf-8"))


def build(skill, rules_dir):
    text = read(rules_dir, "template.md")
    parts = {
        "name": skill["name"],
        "description": skill["description"],
        "title": skill["title"],
        "intro": skill["intro"],
        "core": read(rules_dir, "core.md"),
        "use_case": read(rules_dir, skill["use_case"]) if skill["use_case"] else "",
        "modes": read(rules_dir, "modes.md"),
        "interview": read(rules_dir, "interview.md") + "\n\n" if skill["interview"] else "",
        "formatting": read(rules_dir, "formatting.md") + "\n\n",
    }
    for key, value in parts.items():
        text = text.replace("{{" + key + "}}", value)
    if "{{" in text:
        raise ValueError("an unfilled placeholder is left in " + skill["name"])
    return re.sub(r"\n{3,}", "\n\n", text).strip() + "\n"


def stale_skills(root):
    """Names of skills whose SKILL.md is missing or differs from what the sources build."""
    root = Path(root)
    stale = []
    for skill in load(root / "rules"):
        target = root / "skills" / skill["name"] / "SKILL.md"
        if not target.exists() or target.read_text(encoding="utf-8") != build(skill, root / "rules"):
            stale.append(skill["name"])
    return stale


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args(argv)
    if args.check:
        stale = stale_skills(ROOT)
        if stale:
            print("Out of date, run scripts/build_skills.py: " + ", ".join(stale), file=sys.stderr)
            return 1
        print("All skills are up to date.")
        return 0
    for skill in load(ROOT / "rules"):
        target = ROOT / "skills" / skill["name"] / "SKILL.md"
        target.parent.mkdir(parents=True, exist_ok=True)
        wanted = build(skill, ROOT / "rules")
        target.write_text(wanted, encoding="utf-8")
        print("wrote", target.relative_to(ROOT), len(wanted.split()), "words")
    return 0


if __name__ == "__main__":
    sys.exit(main())
