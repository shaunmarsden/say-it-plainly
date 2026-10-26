# Results, round two: notes

Run on 26th October 2026. The [pre-registration](preregistration.md) was committed at 14:06 GMT, before any reply existed, and the [scores](scores-blind.md) at 14:09 GMT, before I looked at which method made which reply.

## The result

No reply lost any of the 24 items. All the difference is in what the rewrites invented and added. Six replies per method:

| Method | Items lost | Facts invented | Replies with a fact invented | Replies with an addition | Mean words |
| --- | --- | --- | --- | --- | --- |
| Bare ("make this clearer") | 0 | 2 | 2 of 6 | 5 of 6 | 203 |
| Paragraph | 0 | 0 | 0 of 6 | 0 of 6 | 141 |
| Skill (`plain-notes`) | 0 | 5 | 5 of 6 | 2 of 6 | 232 |

The drafts were 129, 138 and 114 words long (mean 127).

By draft, items lost plus facts invented:

| Draft | Bare | Paragraph | Skill |
| --- | --- | --- | --- |
| Planning call | 1 | 0 | 2 |
| Supplier call | 0 | 0 | 2 |
| Pipeline meeting | 1 | 0 | 1 |

## What happened against what I predicted

1. **Bare would do worst. It did not.** The skill invented the most.
2. **Skill and paragraph within one item per reply.** It held, narrowly (0.83 per reply apart), but not in the spirit I meant. The paragraph was clean and the skill was not.
3. **Bare would add follow-up steps more than the others.** It held: 5 of 6 bare replies added something, against none for the paragraph and 2 for the skill.

## What the skill's replies got wrong

- **Two supplier replies wrote that nothing had been decided.** The draft records no decision, but it does not say none was made. Both put this under a "Settled" heading that would otherwise have been empty.
- **Two planning replies called the review a "review meeting".** The draft says "the review". One bare reply made the same slip ("next meeting").
- **One pipeline reply wrote that no one had taken on the Quillon discount**, and added it as an action with no owner. The draft says neither.

My reading, which I have not tested, is that the skill's structure (settled, needs checking, disagree, actions) invites the model to fill each heading. The skill's own rule says to add nothing nobody said.

## What the bare replies got wrong

One bare reply wrote that whether Foxglove closes "depends on how quickly legal can move", which is a cause the draft does not give. The other bare slip was the "next meeting" label above. The larger bare problem was additions: lists of open questions, follow-ups and suggestions that nobody in the meeting raised. Several of them said so, and offered to delete them.

## The paragraph arm

It was the shortest, closest to the draft's length and the only method with nothing invented and nothing added, in all six replies.

## How much weight this bears

Not much. It is 18 replies, and I wrote the drafts, the skill and the scoring.

**The invented count rests on my judgement calls, which I fixed before unblinding.** If I had not counted "review meeting" and "next meeting" as inventions, the skill would score 3 and bare 1. If I had also not counted "nothing was decided" and "no one took it on", the skill would score 0 and bare 1. In none of these readings does the skill beat the paragraph, and in none is the paragraph worse than the skill.

**All three methods kept every hedge, figure and disagreement.** The skill's tendency to add claims did not cost any of the items I listed. It cost cleanliness, in a task where cleanliness was the point.

**The skill's replies are longer.** They are about twice the draft's length, which is the price of sorting every line under a heading and marking every gap.

I did not measure whether a reader prefers the sorted version. It may be what some readers want.

## What I will and will not do

I have not changed the skill, because the pre-registration says a change would be a new, labelled round. I would not count this result as a verdict on the skill's usefulness. It shows that on these three drafts the skill did not keep notes cleaner than a paragraph, and that it sometimes stated things about the call that the notes did not.

## Round three

I then tightened the notes skill and tested it on three new sets of notes. See the [round three results](../skill-test-notes-round-three/results.md).

## Files

- `preregistration.md`, `drafts/`, `prompts/`: what I fixed before running.
- `replies/`: the 18 replies, named at random.
- `scores-blind.md`, `scores.json`: my scores, written before unblinding.
- `mapping.json`: which reply was which method and draft.
- `analyse.py`: unblinds and adds up the totals. Run it on a folder holding `replies/`, `scores.json` and the mapping file (named `MAPPING_DO_NOT_READ_UNTIL_SCORED.json` there).
