# Results: do the skills help?

Run on 26th October 2026. The [pre-registration](preregistration.md) was committed at 12:42 GMT, before any reply existed. The [scores](scores-blind.md) were committed at 12:45 GMT, before I looked at which arm each reply came from.

## The result

Items lost plus facts invented, summed over six replies per arm (lower is better):

| Arm | Items lost | Facts invented | Total | Replies with a problem |
| --- | --- | --- | --- | --- |
| Bare ("make this clearer") | 3 | 2 | 5 | 4 of 6 |
| Paragraph | 1 | 0 | 1 | 1 of 6 |
| Skill | 0 | 0 | 0 | 0 of 6 |

By draft:

| Draft | Bare | Paragraph | Skill |
| --- | --- | --- | --- |
| Email | 2 | 0 | 0 |
| Notes | 0 | 0 | 0 |
| Report | 3 | 1 | 0 |

Both things I predicted came true. The bare request did worst. The skill and the paragraph were within one item per reply of each other (0.17 per reply apart).

## What went wrong in the bare arm

- Both bare emails added a promise that Sam never made: "I'll confirm once I've spoken to him" in one, "I'll tell you as soon as I have his answer" in the other. Both replies flagged the addition and offered to delete it.
- Two of the three lost report items turned "may be related to the release" into "may be the cause".
- One bare report also cut "lean towards", so a leaning read as a firm recommendation.

The one paragraph-arm loss was the same "may be the cause" slip.

## What this does not show

- **The skill is not shown to beat the paragraph.** One lost item in 18 replies, against none, is not a difference I would defend. On this evidence a good paragraph keeps claims as well as a skill.
- **The notes draft separated nothing.** All six notes replies kept every item, whichever arm they came from.
- **Eighteen replies from three made-up drafts is small.** I built the drafts to tempt a rewrite into hardening a hedge or filling a gap, and I wrote the skills, the drafts and the scoring.
- **I did not measure readability.** I measured whether claims survived, not whether the result is easier to read.
- **The arm was not fully hidden.** The skill's replies have a recognisable shape (what changed, what I kept, what I need from you), so I could often guess the arm while scoring.
- **The replies came from subagents** running on the same model as me, with Claude Code's own context. A plain chat window may behave differently.

## Judgement calls

I fixed these before unblinding and wrote them in the scores file.

- I counted "may be the cause" as a loss, because "may be related" claims less. If I had counted it as kept, bare would score 3 instead of 5 and paragraph would score 0. The order of the arms would not change.
- I counted one email's "I expect ... mid-June, but I need to confirm" as kept, though it is firmer than "I think we can probably". If I had counted it as lost, bare would score 6.
- Both bare notes replies added a short list of follow-up steps that nobody said, one labelled as suggestions and one disclosed in its change notes. They are not facts, so they count 0. The skill's notes replies added no such list.

## Other things I noticed, not scored

- The notes rewrites from the bare arm (169 and 179 words) and the skill arm (176 and 189) came out longer than the 120-word draft. The paragraph arm's came out at 129. Added structure costs words.
- The checker in this repo found no clear difference between arms (mean flags per rewrite: bare 2.2, paragraph 1.7, skill 2.2). It is my own tool and I would not lean on it.
- The skill replies ask questions the others do not, such as who Aisha is and whose "I" is speaking in the notes. That may be useful. I did not score it.

## What this changes in the README

It now says what was tested: that on three drafts the skills kept claims as well as a short paragraph and better than a bare request. It does not say the skills improve writing, because I have not shown that.

## Files

- `preregistration.md`, `drafts/`, `prompts/`: what I fixed before running.
- `replies/`: all 18 replies, named at random.
- `scores-blind.md`, `scores.json`: my scores, written before unblinding.
- `mapping.json`: which reply was which arm and draft.
- `analyse.py`: unblinds and adds up the totals. Run it on a folder holding `replies/`, `scores.json` and the mapping file (here `mapping.json` must be named `MAPPING_DO_NOT_READ_UNTIL_SCORED.json`).
