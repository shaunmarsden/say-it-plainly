# Pre-registration: the other four skills against a paragraph and a bare request

Written on 26th October 2026, before any reply existed. The time of the first commit on this branch is the proof.

## Why

Round one tested `plain-email` and `plain-report` on one draft each. Nobody has tested `plain-post` or `plain-writing` at all. In the later notes rounds, the notes skill invented and added claims that a paragraph did not, until I tightened it. Does the same happen with these four skills?

## The three methods

The same shapes as before. Every prompt starts "(The names and figures below are made up.)" and ends with the draft.

- **Bare.** "Rewrite this to make it clearer."
- **Paragraph.** "Rewrite this in plain words. Put the point first, use short everyday words, cut filler and name who did what. Keep every figure, every hedge and every disagreement exactly as strong as it is in my draft, and add no fact, name, date or owner that I did not give."
- **Skill.** The text of the matching skill from `main` pasted first, then "Rewrite it." The email draft gets `plain-email`, the report `plain-report`, the post `plain-post` and the general paragraph `plain-writing`.

4 drafts (`drafts/`) x 3 methods x 2 runs = 24 replies, each from a fresh subagent on the same model as me (Sonnet 5.5) with Claude Code's own context, stored under random names. I score blind, then unblind. I do not change a skill, the paragraph or a draft after seeing a reply.

## Scoring (fixed now)

Rewritten text only. Each item is kept (1) or lost (0). Weakened, hardened or dropped counts as lost. Where a reply gives two versions, I score the first.

Email
- E1 The delay at the depot stays, and stays our fault (a staffing problem on our side). It is not moved to the carrier or softened.
- E2 "Should reach you by the 12th" stays an expectation, and the carrier not having confirmed it stays.
- E3 The refund stays conditional on the parcel not arriving by the 15th, for the £6.50 delivery charge only, with the item cost not refunded.
- E4 The ask stays: tell us by Friday if the delivery address has changed.
- E5 The sign-off stays Dana, customer care.

Report
- R1 The fall from 41 to 29 minutes over four weeks stays exactly.
- R2 "Weekdays only, because the pilot did not cover weekends" stays.
- R3 The team lead's view that most of the gain comes from the extra Monday person stays as his view, and "we have not tested that" stays.
- R4 The recommendation stays: extend the rota to weekdays at all sites, and hold off on weekends until there is data.
- R5 The cost stays roughly £2,400 a month per site, as a finance estimate and not a quote.
- R6 The decision needed by 8 November stays.

Post
- P1 Three weeks and 11 reports stay.
- P2 "It got the structure right every time" stays.
- P3 The figure wrong in 2 of 11 reports, both times a number from a different client's file, stays.
- P4 The cause stays unknown ("I don't know why. Maybe the prompt, maybe the tool"). It is not settled either way.
- P5 "A human checks every number before anything goes out" stays.
Dropping the closing question and the hashtags is not a loss: the post skill tells the model to cut engagement bait.

General
- G1 The Leeds team moved to the new booking tool on the 3rd.
- G2 Most were fine, two said it was slower, one has not logged in yet. None of these is changed or counted differently.
- G3 Bookings are down about 8% on the same week last year, the bank holiday caveat stays, and "I would not read much into it" stays as the writer's judgement.
- G4 Rachel is looking at keeping the old tool running alongside until the end of the month, and there is no decision yet. Nothing is written as decided.

Every reply also gets two counts, defined as in the notes rounds.

- **Invented**: facts, names, dates, owners, numbers, causes or reasons not in the draft, including a label that changes what an item is, a claim that something did or did not happen that the draft does not make, and a cause the draft does not give. Not counted: saying that the draft does not give something.
- **Additions**: actions, next steps, follow-ups, open questions, suggestions or claims in the rewritten text that the draft did not state, labelled or not. One per reply, however many items. Questions put to the writer outside the rewritten text do not count.

Main measure: items lost plus facts invented, per reply, by method. Additions are reported next to it. Secondary, hints only: word count against the draft, and this repo's checker flags.

## What I expect

1. The skill is no worse than the paragraph on items lost.
2. Bare adds things more often than the paragraph.
3. For at least one of the four drafts, the skill invents or adds more than the paragraph. In the notes rounds, structure invited filling.

If the skill is worse than the paragraph on a kind of writing, the README says so for that skill.

## What I will not do

- Add runs to change the result.
- Change a skill or the paragraph and count the result as part of this test. A change would be a new, labelled round.
- Count a missing reply as anything but a failed run.

## Limits I already know about

- Four drafts and 24 replies is small, with two runs each. I wrote the drafts, the skills and the scoring, and I built the drafts to tempt a rewrite.
- The drafts are short. A longer email, report or post may behave differently.
- It tests fidelity, not whether a reader finds the result easier to read, and not the skills' review mode or their interview mode.
- The skill's replies have a recognisable shape, so my scoring is not fully blind.
