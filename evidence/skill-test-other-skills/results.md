# Results: the other four skills

Run on 26th October 2026. The [pre-registration](preregistration.md) was committed at 17:43 GMT, before any reply existed, and the [scores](scores-blind.md) at 17:45 GMT, before I looked at which method made which reply.

## The result

Eight replies per method (four drafts, two runs each):

| Method | Items lost | Facts invented | Additions | Mean words | Mean checker flags |
| --- | --- | --- | --- | --- | --- |
| Bare ("make this clearer") | 0 | 1 | 0 | 96 | 0.9 |
| Paragraph | 0 | 0 | 0 | 86 | 0.5 |
| Skill | 0 | 0 | 0 | 86 | 1.2 |

The drafts were 93, 95, 76 and 85 words long (mean 87).

Every method kept every item in every reply. The single difference is one invented detail in one bare email: it wrote "our depot", where the draft said "the depot". By draft, nothing separated the skills from the paragraph on any of the four kinds of writing.

## What happened against what I predicted

1. **The skill is no worse than the paragraph on items lost.** It held, trivially: nobody lost anything.
2. **Bare adds things more often than the paragraph.** It did not hold. Bare added nothing to the rewritten text.
3. **For at least one draft, the skill invents or adds more than the paragraph.** It did not hold. The structure that made the notes skill fill in gaps did not appear with these four skills.

## What this does and does not show

**It shows no fault, not a good skill.** On short drafts with one or two traps each, all three methods did what was asked. The test could not tell them apart, and I would not read it as a point for the skills or for the paragraph.

**The drafts are too easy.** At 76 to 95 words, there is little to restructure and little room to invent. The notes rounds used messier drafts with more traps, and that is where a method could go wrong. A harder round on these four kinds of writing is the test that would show something.

**Two of my three predictions failed.** I expected the skills to show the same filling-in that the notes skill did. They did not, on these drafts.

**It is small.** 24 replies, four drafts I wrote, and scoring I wrote. I judged "invented" myself. The one case I counted was clear, because another reply in the test had flagged the same ambiguity.

## One thing I noticed that I did not plan to measure

The post skill tells the model to cut engagement bait and cut hashtags. Both skill replies on the post cut the hashtags and the closing question. None of the four bare and paragraph replies cut the closing question (each rewrote or shortened it), and two of them kept the hashtags. This is a rough observation from reading the replies, and not one of the measures in the plan. It suggests the post skill does something a plain request does not, but I have not tested it.

## What this changes in the README

The README and the checker page now say four rounds, thirteen drafts and 84 replies, and that the fourth round found no fault but was too easy to separate the methods. They do not say the other four skills are better than a paragraph.

## Files

- `preregistration.md`, `drafts/`, `prompts/`: what I fixed before running.
- `replies/`: the 24 replies, named at random.
- `scores-blind.md`, `scores.json`: my scores, written before unblinding.
- `mapping.json`: which reply was which method and draft.
- `analyse.py`: unblinds and adds up the totals. Run it on a folder holding `replies/`, `scores.json` and the mapping file (named `MAPPING_DO_NOT_READ_UNTIL_SCORED.json` there).
