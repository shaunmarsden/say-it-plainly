# Say It Plainly

Five skills for an AI tool that review or rewrite your writing in plain words, and a private checker that runs in your browser and sends nothing anywhere.

I write for people who are busy. These are the rules I use, written down so an AI tool can apply them to your draft: emails, meeting notes, reports and public posts. A rewrite keeps what your text claims exactly where it was. It never adds a fact you did not give.

**Try the checker:** [shaunmarsden.github.io/say-it-plainly](https://shaunmarsden.github.io/say-it-plainly/). Paste some writing and it marks the words worth a second look.

## Use a skill

The quickest way needs no install. Open a skill below, click **Raw**, copy the whole file, paste it into any AI chat, then paste your writing underneath. Say whether you want it reviewed or rewritten.

| Skill | For |
| --- | --- |
| [plain-writing](skills/plain-writing/SKILL.md) | Any piece of writing |
| [plain-email](skills/plain-email/SKILL.md) | Emails and messages |
| [plain-notes](skills/plain-notes/SKILL.md) | Meeting and call notes |
| [plain-report](skills/plain-report/SKILL.md) | Reports and proposals |
| [plain-post](skills/plain-post/SKILL.md) | Public posts and web pages |

To install one for an AI coding tool, run for example `npx skills add shaunmarsden/say-it-plainly --skill plain-email`.

**Want something shorter?** In my [test](evidence/skill-test/results.md) a single paragraph kept a draft's claims about as well as a skill did. Paste this above your writing:

> Rewrite this in plain words. Put the point first, use short everyday words, cut filler and name who did what. Keep every figure, every hedge and every disagreement exactly as strong as it is in my draft, and add no fact, name, date or owner that I did not give.

That was three drafts and 18 replies, so it is a hint, not a proof. The skills add review mode, rules for each kind of writing, and questions about what they could not tell.

## What a skill does

- **Review** critiques your text and leaves it alone. You get a verdict, the seven changes that would help most (each with the exact words quoted), what already works, and what it could not tell without more from you.
- **Rewrite** returns the edited text, then what changed, what it kept on purpose, and what it needs from you. It keeps your scope, certainty, emphasis and cause. If a clearer sentence would claim more than your original did, it keeps your weaker claim.
- **Interview** (report and post only) asks up to five questions about your reader and what only you know, then drafts from your answers.

Every skill carries all its own rules, because a pasted file cannot open a link. The twelve shared rules are in [rules/core.md](rules/core.md). Each skill adds the few that belong to its kind of writing.

My own formatting preferences, which I call house formatting (dates like 21st May, numbers one to nine spelled out, no em dashes, straight quotes, full currency figures) are an option in each skill and a checkbox in the checker. They are not rules of good writing, so they are off unless you ask.

## What I have tested

- **The checker.** 31 tests cover every flag, and the cases that must not be flagged, such as a clean email, a year in notes, or a number range. I broke the checker on purpose in 14 ways, for example by removing the overlap handling and by changing the long-sentence limit, and the tests caught all 14. One broken case slipped through the first time, because my test could not have caught it, so I rewrote the test and ran it again. In a browser I checked that pasted markup shows as plain text and creates no elements, that the page's only network request is its own `checker.js`, and that the console is clean.
- **Whether the skills keep your claims.** On 26th October 2026 I ran a pre-registered test: three made-up drafts (an email, call notes, a report), each rewritten two ways by a bare request, a one-paragraph instruction and the matching skill. I scored 18 replies without knowing which arm each came from. The bare request lost or invented 5 things, the paragraph 1 and the skill 0. The skill and the paragraph are too close to tell apart, and the notes draft separated nothing. The sample is small and I wrote the drafts, the skills and the scoring. The [results](evidence/skill-test/results.md) have the detail, including the judgement calls I made in scoring.
- **The install command.** On 26th October 2026 I ran `npx skills add shaunmarsden/say-it-plainly --skill plain-email` in an empty folder. It installed one skill, and the installed file was identical to `skills/plain-email/SKILL.md`. I ran it for that one skill only.
- **The build.** The skills are generated from the files in `rules/`, so they cannot drift apart. 20 tests cover the build and the repository checks, including deliberate failures: a stray em dash, a hand-edited skill, a link inside a skill, and a rule that differs between the page and the source.

## What I have not tested

- **Whether the skills improve real writing.** The test above measured only whether claims survived a rewrite. I have not tested whether readers find the results easier to read.
- **Anyone else's use.** Nobody outside this project has tried any of it.

## Limits

- The checker looks at words and sentence length. It cannot tell whether you are right or whether your writing is good, and it will flag things that are fine. Each flag is a prompt to look again.
- "Common in machine-written text" is not an AI detector. Plenty of people write like that too.
- Reading ease is an estimate from word and sentence length.
- The passive-voice check is a rough pattern, so it misses some passives and flags some adjectives.
- English only. The skills are 900 to 1,250 words each, because each one repeats the shared rules.

## Build and check

The skill files are generated. Edit the files in `rules/`, then run:

```sh
python3 scripts/build_skills.py
python3 scripts/check_repo.py
python3 -m unittest tests/test_build.py
node --test tests/checker.test.js
```

The same four commands run on every push.

## Where this came from

The rules owe most to George Orwell's six rules in "Politics and the English Language" (1946). The idea of a writing skill with a private checker came from Addy Osmani's [Clarity](https://clarity.addy.ie/). The rules, skills and code here are my own.

MIT licence.
