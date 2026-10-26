"""Tests for the skill build and the repository checks, including deliberate failures."""
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import build_skills  # noqa: E402
import check_repo  # noqa: E402


def scratch_copy():
    temp = Path(tempfile.mkdtemp())
    target = temp / "repo"
    shutil.copytree(ROOT, target, ignore=shutil.ignore_patterns(".git", "node_modules", "__pycache__"))
    return temp, target


class RealRepoTests(unittest.TestCase):
    def test_every_check_passes_on_the_real_repository(self):
        self.assertEqual(check_repo.run(ROOT), [])

    def test_generated_skills_match_their_sources(self):
        self.assertEqual(build_skills.stale_skills(ROOT), [])

    def test_every_skill_carries_all_twelve_core_rules_and_the_guardrails(self):
        core = (ROOT / "rules" / "core.md").read_text(encoding="utf-8").strip()
        for skill in build_skills.load(ROOT / "rules"):
            text = (ROOT / "skills" / skill["name"] / "SKILL.md").read_text(encoding="utf-8")
            self.assertIn(core, text, skill["name"])
            self.assertIn("## What you must not do", text)
            self.assertIn("Never invent a fact, number, name, date or quote", text)
            self.assertIn("## House formatting", text)

    def test_only_the_report_and_post_skills_can_interview(self):
        for skill in build_skills.load(ROOT / "rules"):
            text = (ROOT / "skills" / skill["name"] / "SKILL.md").read_text(encoding="utf-8")
            self.assertEqual("## Interview" in text, skill["name"] in ("plain-report", "plain-post"), skill["name"])

    def test_the_rewrite_mode_keeps_claims_where_they_were(self):
        text = (ROOT / "skills" / "plain-notes" / "SKILL.md").read_text(encoding="utf-8")
        self.assertIn("keeps the original's scope, certainty, emphasis and cause", text)
        self.assertIn("keep the weaker claim", text)

    def test_the_sources_use_no_dash_or_curly_quote(self):
        self.assertEqual(check_repo.check_punctuation(ROOT), [])


class DeliberateFailureTests(unittest.TestCase):
    def setUp(self):
        self.temp, self.repo = scratch_copy()

    def tearDown(self):
        shutil.rmtree(self.temp, ignore_errors=True)

    def edit(self, relative, old, new):
        path = self.repo / relative
        text = path.read_text(encoding="utf-8")
        self.assertIn(old, text)
        path.write_text(text.replace(old, new, 1), encoding="utf-8")

    def test_a_copy_of_the_real_repo_passes(self):
        self.assertEqual(check_repo.run(self.repo), [])

    def test_an_em_dash_is_caught(self):
        self.edit("rules/core.md", "Say it the way", "Say it " + chr(0x2014) + " the way")
        self.assertTrue(any("em dash" in p for p in check_repo.check_punctuation(self.repo)))

    def test_a_curly_quote_is_caught(self):
        self.edit("README.md" if (self.repo / "README.md").exists() else "rules/core.md", "the", "th" + chr(0x2019) + "e")
        self.assertTrue(any("curly" in p for p in check_repo.check_punctuation(self.repo)))

    def test_a_hand_edited_skill_is_caught_as_stale(self):
        self.edit("skills/plain-email/SKILL.md", "Plain Email", "Plain Mail")
        self.assertIn("plain-email", build_skills.stale_skills(self.repo))
        self.assertTrue(any("out of date" in p for p in check_repo.check_skills(self.repo)))

    def test_a_missing_skill_file_is_caught(self):
        (self.repo / "skills" / "plain-post" / "SKILL.md").unlink()
        self.assertIn("plain-post", build_skills.stale_skills(self.repo))

    def test_a_link_inside_a_skill_is_caught(self):
        self.edit("rules/modes.md", "Use this when the person wants a critique", "See [the guide](../README.md). Use this when the person wants a critique")
        build_skills.main = build_skills.main  # keep the module reference explicit
        for skill in build_skills.load(self.repo / "rules"):
            target = self.repo / "skills" / skill["name"] / "SKILL.md"
            target.write_text(build_skills.build(skill, self.repo / "rules"), encoding="utf-8")
        self.assertTrue(any("cannot open a link" in p for p in check_repo.check_skills(self.repo)))

    def test_a_test_cue_inside_a_skill_is_caught(self):
        self.edit("rules/core.md", "Write for one reader.", "Write for one reader, as the worked example shows.")
        for skill in build_skills.load(self.repo / "rules"):
            (self.repo / "skills" / skill["name"] / "SKILL.md").write_text(build_skills.build(skill, self.repo / "rules"), encoding="utf-8")
        self.assertTrue(any("cue a model" in p for p in check_repo.check_skills(self.repo)))

    def test_a_broken_relative_link_is_caught(self):
        (self.repo / "NOTE.md").write_text("See [missing](nowhere.md).\n", encoding="utf-8")
        self.assertTrue(any("nowhere.md" in p for p in check_repo.check_links(self.repo)))

    def test_a_missing_install_command_on_the_page_is_caught(self):
        self.edit("docs/index.html", "--skill plain-email</code>", "--skill plain-mail</code>")
        self.assertTrue(any("plain-email" in p for p in check_repo.check_page(self.repo)))

    def test_a_page_rule_that_drifts_from_the_core_rule_is_caught(self):
        self.edit("docs/index.html", "<li>Put the point first.</li>", "<li>Bury the point.</li>")
        self.assertTrue(any("does not match" in p for p in check_repo.check_page(self.repo)))

    def test_a_dropped_rule_is_caught(self):
        self.edit("docs/index.html", "      <li>Name who did it.</li>\n", "")
        self.assertTrue(any("lists 11 rules" in p for p in check_repo.check_page(self.repo)))

    def test_a_repeated_skill_name_is_caught(self):
        path = self.repo / "rules" / "skills.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        data[1]["name"] = data[0]["name"]
        path.write_text(json.dumps(data), encoding="utf-8")
        self.assertTrue(any("repeats" in p for p in check_repo.check_skills(self.repo)))

    def test_an_overlong_description_is_caught(self):
        path = self.repo / "rules" / "skills.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        data[0]["description"] = "x" * 301
        path.write_text(json.dumps(data), encoding="utf-8")
        for skill in data:
            (self.repo / "skills" / skill["name"] / "SKILL.md").write_text(build_skills.build(skill, self.repo / "rules"), encoding="utf-8")
        self.assertTrue(any("300 characters" in p for p in check_repo.check_skills(self.repo)))

    def test_an_unfilled_placeholder_is_refused(self):
        self.edit("rules/template.md", "{{intro}}", "{{intro}} {{oops}}")
        with self.assertRaises(ValueError):
            build_skills.build(build_skills.load(self.repo / "rules")[0], self.repo / "rules")


if __name__ == "__main__":
    unittest.main()
