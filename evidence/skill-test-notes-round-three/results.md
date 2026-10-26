# Results, round three: the tightened notes skill

Run on 26th October 2026. The [pre-registration](preregistration.md) was committed at 14:17 GMT, before any reply existed, and the [scores](scores-blind.md) at 14:21 GMT, before I looked at which method made which reply.

## The result

Six replies per method, on three new sets of made-up notes.

| Method | Items lost | Facts invented | Replies with a problem | Replies with an addition | Mean words |
| --- | --- | --- | --- | --- | --- |
| Bare ("make this clearer") | 1 | 6 | 3 of 6 | 6 of 6 | 210 |
| Paragraph | 0 | 0 | 0 of 6 | 0 of 6 | 102 |
| Skill v1 (before the change) | 1 | 4 | 4 of 6 | 4 of 6 | 188 |
| **Skill v2 (after the change)** | **0** | **0** | **0 of 6** | **0 of 6** | **172** |

The drafts were 104, 87 and 111 words long (mean 101).

By draft, items lost plus facts invented:

| Draft | Bare | Paragraph | Skill v1 | Skill v2 |
| --- | --- | --- | --- | --- |
| Workshop | 1 | 0 | 2 | 0 |
| Pipeline review | 6 | 0 | 1 | 0 |
| Escalation call | 0 | 0 | 2 | 0 |

## What happened against what I predicted

1. **Skill v2 invents less than v1.** It held: 0 against 4 (and 0 against 1 item lost).
2. **Skill v2 still does not beat the paragraph.** It held, as a tie. v2 and the paragraph both scored nothing lost, nothing invented and nothing added in all six replies. I had expected the paragraph to stay ahead and I was not confident v2 would match it.
3. **Bare adds follow-ups more often than the paragraph.** It held: 6 of 6 bare replies added something, and none of the paragraph's did.

## What changed between v1 and v2

Where v1 wrote "no one made a decision in the meeting" or "no other decisions were made", v2 wrote what the notes record ("the notes record nothing as settled"). Where v1 listed missing owners as actions, v2 did not. Where v1's first-round faults were "review meeting" and "nothing was decided", v2's replies kept "the check-in" and "the review" in the writer's words, and one said so itself.

## What the bare replies got wrong

The worst was a bare reply on the pipeline notes. It wrote "treat it as unapproved" for an approval that Omar had claimed and the writer had not seen, wrote that nobody had checked the forecast, gave a reason why it mattered, and said no one had been given the Aldwick job. Every bare reply added follow-ups, open questions or suggestions that nobody in the meeting raised.

## How much weight this bears

Less than the table suggests.

**The fix was tuned to the faults and the new drafts were built to tempt them.** The new rules name the exact slips round two found ("review meeting", "next meeting", "nothing was decided"). The drafts contain "the review", "the check-in" and a meeting that records no decision. A v2 reply said "'the check-in', in your word, not 'review meeting' or 'next meeting'", which is the rule's own wording coming back. So this shows that the skill now follows those rules on those kinds of fault. It does not show the skill is clean on faults I have not thought of.

**It is a small sample,** 24 replies on three drafts, and I wrote the drafts, the skill and the scoring.

**The skill's replies are still longer.** v2's rewrites ran about 1.7 times the length of the paragraph's (172 words against 102). They sort every line under a heading and add "the notes do not say" lines. That is the price of the structure. I did not measure whether a reader wants it.

**The invented count rests on judgement calls** fixed before unblinding and listed in the scores file. All four of v1's invented facts were claims of the kind "nobody decided anything" or "no one has been asked". If I had not counted claims of that kind, v1 would score 0 invented and 1 lost, and the difference between v1 and v2 would rest on that one lost item and on the follow-ups v1 added (4 of 6 replies, against none for v2). v2 and the paragraph score nothing under any reading.

## What this changes in the README

The skill change ships in this pull request. The README now says what the three rounds showed: the first version of the notes skill added claims that a paragraph did not, the tightened version did not, on three new sets of notes built to tempt the same faults. It does not say the notes skill is better than the paragraph, because it has not been shown to be.

## Files

- `preregistration.md`, `drafts/`, `prompts/`, `plain-notes-v1.md`: what I fixed before running.
- `replies/`: the 24 replies, named at random.
- `scores-blind.md`, `scores.json`: my scores, written before unblinding.
- `mapping.json`: which reply was which method and draft.
- `analyse.py`: unblinds and adds up the totals. Run it on a folder holding `replies/`, `scores.json` and the mapping file (named `MAPPING_DO_NOT_READ_UNTIL_SCORED.json` there).
