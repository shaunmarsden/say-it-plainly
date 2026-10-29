# Results: round five, harder drafts for the other four skills

Run on 29th October 2026. The [pre-registration](preregistration.md) was committed at 09:12 GMT, before any reply existed, and the [scores](scores-blind.md) at 09:16 GMT, before I looked at which method made which reply.

## The result

Eight replies per method (four drafts, two runs each), 35 items per run:

| Method | Items lost | Facts invented | Lost plus invented | Additions | Mean words in the rewrite |
| --- | --- | --- | --- | --- | --- |
| Bare ("make this clearer") | 2 | 2 | 4 | 2 | 197 |
| Paragraph | 0 | 0 | 0 | 0 | 212 |
| Skill | 0 | 0 | 0 | 2 | 206 |

The drafts were 167 to 276 words (mean 236).

All four predictions held:

1. **At least one method lost or invented something.** Bare did, on three of the four drafts.
2. **The paragraph and the skill each lost and invented less than bare.** Both had none, against four for bare.
3. **The skill was no worse than the paragraph** on lost plus invented. Both were zero.
4. **On the post, both skill replies cut the closing question and the hashtags.** One of the four bare and paragraph replies did (a bare one).

## What bare got wrong

- **The team update (both bare replies).** The draft said boxes "will be left in the kitchen", which reads as empty boxes being provided. Both bare replies turned it into an instruction to leave packed boxes there. Both skill replies spotted the ambiguity and asked about it, outside the rewrite. Both paragraph replies kept the original wording.
- **The email and the report (one bare reply each).** Each moved an action from "we" to "I" ("I have opened a claim", "I only asked people who used the kiosk"), giving it an owner the draft did not name.
- **Additions.** One bare email promised to offer a refund if the lamp was out of stock. One bare report said a longer pilot "should settle" the staff-time disagreement.

## What the skill added

Both report skill replies added a sentence on how sure the writer was. One said "The evidence is limited", built from facts in the draft. The other said "How sure I am: not very.", which states the writer's confidence more strongly than the draft did. The report skill tells the model to "say how sure you are, and why", so this is the skill doing what it says. But it puts words in the writer's mouth, and a writer who pastes it should check that sentence before sending.

## What this changes in the README

On these drafts, the paragraph matched the skills on keeping the draft's claims, and both did better than a bare request. That is the same answer as rounds one to three, now on longer drafts for all four of the other skills. The README and the checker page now say five rounds, seventeen drafts and 108 replies, and mention the report skill's confidence sentence.

## How much weight this bears

- **It is small.** 24 replies, two runs each, on four drafts I wrote with scoring I wrote.
- **The differences are a handful of slips.** Four by bare, none by the other two. I would read it as "bare is riskier on long drafts", not as a measured rate.
- **The paragraph and the skill are still tied** on fidelity. This round does not show that the skills keep claims better than the paragraph.
- **Judgement calls** (a "we" turning into "I", the ambiguous boxes, the confidence sentences) were fixed before unblinding and are listed in the scores.
- **Word counts** are of the rewrite only, cut where a reply's "what I changed" notes began. The skill replies were much longer in full, because they add those notes.
- **The replies came from subagents** on Sonnet 5.5, as in rounds one to four, with Claude Code's own context.

## Files

- `preregistration.md`, `drafts/`, `prompts/`: what I fixed before running.
- `replies/`: the 24 replies, named at random.
- `scores-blind.md`, `scores.json`: my scores, written before unblinding.
- `mapping.json`: which reply was which method and draft.
- `analyse.py`: unblinds and adds up the totals. Run `python3 evidence/skill-test-round-five/analyse.py evidence/skill-test-round-five`.
