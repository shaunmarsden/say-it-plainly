# Pre-registration: round five, harder drafts for the other four skills

Written on 29th October 2026, before any reply existed. The time of the first commit on this branch is the proof.

## Why

Round four tested `plain-email`, `plain-report`, `plain-post` and `plain-writing` against a paragraph and a bare request. Every method kept every item and only one fact was invented, so nothing separated them. The [results](../skill-test-other-skills/results.md) said the drafts were too easy: 76 to 95 words, with one or two traps each. This round uses longer, messier drafts with more to lose.

## The drafts

Four new made-up drafts (`drafts/`), 167 to 276 words, each with filler to cut and seven to nine items a rewrite could lose, weaken, harden or fill in. They include unknown causes, hedges ("usually", "I think"), conditions, a disagreement left open, small samples, things not checked, and gaps a rewrite might fill with an owner or a date.

## The three methods

Exactly as in round four. Every prompt starts "(The names and figures below are made up.)" and ends with the draft.

- **Bare.** "Rewrite this to make it clearer."
- **Paragraph.** "Rewrite this in plain words. Put the point first, use short everyday words, cut filler and name who did what. Keep every figure, every hedge and every disagreement exactly as strong as it is in my draft, and add no fact, name, date or owner that I did not give."
- **Skill.** The text of the matching skill from `main` pasted first, then a line, then "Rewrite it." The email gets `plain-email`, the report `plain-report`, the post `plain-post` and the team update `plain-writing`.

4 drafts x 3 methods x 2 runs = 24 replies, each from a fresh subagent on Sonnet 5.5 (the model used in rounds one to four) with Claude Code's own context, stored under random names. I score blind, then unblind.

## Scoring (fixed now)

Rewritten text only. Where a reply gives two versions, I score the first. Each item is kept (1) or lost (0). Weakened, hardened or dropped counts as lost.

Email
- E1 The order came in two parcels; the first arrived on the 2nd.
- E2 The carrier marked the second parcel (the blue table lamp) delivered on the 4th.
- E3 The driver's photo shows a door that does not look like hers, so it may have gone to the wrong address, and what happened is not known. Not stated as mis-delivered.
- E4 A claim is open with the carrier, who usually reply within five working days but do not promise it.
- E5 A replacement can be sent if she confirms her address, only if the lamp is in stock, and Priya thinks it is but has not checked.
- E6 Or a refund of £84.00 for the lamp; the £4.95 delivery charge is refunded either way.
- E7 The ask: reply by Thursday the 14th with her choice. If she does not, they wait for the carrier's answer. Not "we will refund automatically" or anything else.
- E8 The apology stays an apology for the hassle. It does not become an admission that the company or the carrier was at fault.
- E9 Signed Priya, customer care, reference 7730.

Report
- R1 Six weeks, two stores, Hexham and Morpeth.
- R2 Hexham's average return time fell from 7 to 4 minutes.
- R3 No reliable Morpeth figure, because its kiosk was offline for 9 of the 42 days.
- R4 62 responses, 71% good or very good, a small sample, and only kiosk users were asked.
- R5 Gareth says saved staff time went on helping customers with the kiosk; the regional lead thinks it will settle; it is not resolved.
- R6 Two suspected fraudulent returns at Hexham, and it is not known whether either was linked to the kiosk.
- R7 The recommendation: four more stores for three months, not all 40 yet.
- R8 £3,100 per kiosk plus about £150 a month for support; quote valid until 30th November.
- R9 Weekend trading and staff morale not looked at.
- R10 Decision needed from the operations director by 21st November, so the order can be placed before the quote runs out.

Post
- P1 Two months, 140 calls.
- P2 About six minutes saved a call, by rough timing on 20 calls, the rest not timed.
- P3 Next steps wrong in 9 of 140, usually when two people talked at once.
- P4 Once a complaint went against the wrong customer, and a colleague caught it before it reached the CRM.
- P5 The writer still reads every summary before saving and does not plan to stop.
- P6 Two of the four in the team stopped after a week, finding checking slower than writing their own notes.
- P7 Only one tool tried, so the writer does not know whether another would do better.
Cutting the opener, the closing question and the hashtags is not a loss.

Team update
- G1 The move is planned for the weekend of 6th and 7th December and is provisional, because the landlord has not confirmed access.
- G2 The movers pack desks, monitors and chairs.
- G3 Everyone boxes their own personal items by Thursday 4th December; boxes in the kitchen.
- G4 12 spaces for 30 people; how they are shared out is not decided.
- G5 Sam suggested a weekly rota and Lena prefers first come, first served; nothing agreed. Neither is presented as the plan.
- G6 Broadband booked for 2nd December, may slip by up to a week, so wifi may not work for the first few days.
- G7 Working from home on Monday 8th December is optional.
- G8 £18,500, about £2,000 over the first estimate, mostly the goods lift hire.
- G9 Questions to Marta by Friday.

Every reply also gets two counts, defined as in rounds two to four.

- **Invented:** facts, names, dates, owners, numbers, causes or reasons not in the draft, including a label that changes what an item is, a claim that something did or did not happen that the draft does not make, and a cause the draft does not give. Not counted: saying that the draft does not give something.
- **Additions:** actions, next steps, follow-ups, open questions, suggestions or claims in the rewritten text that the draft did not state. One per reply, however many items. Questions put to the writer outside the rewritten text do not count.

Main measure: items lost plus facts invented, per method, out of 35 items per run. Additions reported alongside. Secondary: word count of the rewrite against the draft.

One further check, from a finding in round four I had not planned to measure: on the post, whether the reply cut both the closing question and the hashtags.

## What I expect

1. At least one method loses or invents something. The drafts are hard enough to show a difference.
2. The paragraph and the skill each lose and invent less than bare, in total.
3. The skill is no worse than the paragraph in total.
4. On the post, both skill replies cut the closing question and the hashtags, and at most two of the four bare and paragraph replies do.

If the skill is worse than the paragraph on a kind of writing, the README says so for that skill.

## What I will not do

- Add runs to change the result.
- Change a skill, the paragraph or a draft and count the result as part of this test.
- Count a missing reply as anything but a failed run.

## Limits I already know about

- Four drafts and 24 replies, two runs each. I wrote the drafts, the skills and the scoring, and I built the drafts to tempt a rewrite.
- It tests fidelity, not whether the result is easier to read, and not review or interview mode.
- The skill's replies have a recognisable shape, so my scoring is not fully blind.
