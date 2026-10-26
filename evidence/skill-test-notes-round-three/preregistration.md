# Pre-registration, round three: did tightening the notes skill help?

Written on 26th October 2026, before any reply in this round existed. The time of the first commit on this branch is the proof.

## Why a third round

[Round two](../skill-test-notes-round-two/results.md) found that the `plain-notes` skill invented more than a one-paragraph instruction did. It wrote that nothing had been decided, it relabelled "the review" as a "review meeting", and it wrote that no one had taken an action on. I have changed the skill to address those faults, and this round tests whether the change worked, on new drafts.

## What I changed in the skill

All in `rules/use-cases/notes.md`, with the skill rebuilt from it (the diff is in this branch).

- Use a heading only if a line belongs under it. If the notes record nothing as settled, leave that heading out.
- Write "decided" only if the notes say someone made the call.
- For a missing owner or date, write what the notes do not say ("the notes do not name an owner").
- New rule: a gap in the notes is not a fact about the meeting. Do not write that nothing was decided, that nobody took something on, or that no one knew.
- New rule: use the writer's own word for each thing. Do not turn "the review" or "the check-in" into a meeting, a request into an agreement, or an estimate into a fact.
- Do not add a cause, an action, a follow-up or an open question that the notes do not contain. Put your own questions in "What I need from you".
- In the skill's one-line intro, "It never adds a detail nobody said" became "It is told to add no detail nobody said".

## The four methods

The same prompt shapes as before. Every prompt starts "(The names and figures below are made up.)" and ends with the draft.

- **Bare.** "Rewrite this to make it clearer."
- **Paragraph.** The same one-paragraph instruction as before.
- **Skill v1.** The `plain-notes` text from before the change (from commit dac56bb), pasted first, then "Rewrite it."
- **Skill v2.** The changed `plain-notes` text, pasted first, then "Rewrite it."

3 new drafts (`drafts/`) x 4 methods x 2 runs = 24 replies, each from a fresh subagent on the same model as me (Sonnet 5.5), with replies stored under random names. I score blind, then unblind. I do not change the skill, the paragraph or the drafts after seeing a reply.

## Scoring (fixed now)

Rewritten text only. Each item is kept (1) or lost (0). Weakened, hardened or dropped counts as lost. Where a reply gives two versions, I score the first.

Workshop
- P1 Fiona's end-of-November data load stays as her view.
- P2 Tomasz's "optimistic", with his reason (the Leeds records on paper), stays as his view.
- P3 Rhys's "about a third" stays as his hedged estimate, attributed to him.
- P4 "The training session was moved" stays, with the new place or time unknown and nothing invented about it.
- P5 The licences stay as two figures (Fiona 25, Tomasz 15), unresolved, with no blended figure and no money added.
- P6 Sunita sending the security questionnaire stays, with "I believe by Wednesday" still uncertain.
- P7 Fiona seeming pleased with the demo stays an impression, and Tomasz not saying much stays an observation. It is not turned into a view about the demo.
- P8 The check-in stays "probably" the first week of December, and is not called a meeting.

Pipeline review
- Q1 Gwen's "safe" and Idris's "gone quiet" stay as each person's view, unresolved.
- Q2 Omar looking at the Harlow contract terms "when he can" stays conditional, with no date.
- Q3 Kestrel stays as Idris wanting to drop it and Gwen not, with no decision. It is not written as dropped or kept.
- Q4 The 12% Aldwick discount stays as Omar's claim of approval, with the writer not having seen the approval. It is not written as approved.
- Q5 The 640k stays, with no currency added, and Gwen and Idris disagreeing on whether it includes Kestrel.
- Q6 "Someone needs to chase the Aldwick paperwork" stays, with no owner named.
- Q7 "The deal review is next Thursday" stays, and no date is worked out.
- Q8 Nothing is written as a decision.

Escalation call
- R1 Beatrice's "about two hours" and Karim's "nearer four, from their logs" both stay, unresolved, with Zoe checking ours.
- R2 Beatrice wanting a credit stays, with Piers saying credits are not his call and Karim not commenting. No decider is named.
- R3 Piers thinking the cause was the certificate renewal stays as his view, not confirmed by engineering.
- R4 Zoe sending the incident report stays, with "I think she said Friday" still uncertain.
- R5 Karim's question about the Dover site stays, with Piers not knowing. No answer is invented.
- R6 The SLA review stays parked until the credit is sorted, with no date.
- R7 The decision (call again on Monday morning) stays, called a call and not a meeting, with no date added.
- R8 Nothing else is written as a decision, and no cause, owner or figure is invented.

Every reply also gets two counts, defined as in round two.

- **Invented**: facts, names, dates, owners, numbers, causes or reasons not in the draft. This includes a label that changes what an item is ("review meeting" for "the review"), a claim that something did or did not happen that the draft does not make ("nothing was decided", "no one took it on", "nobody knew"), and a cause the draft does not give. It does not include saying that the notes do not record a source, date or owner.
- **Additions**: actions, next steps, follow-ups, open questions or suggestions in the rewritten notes that the draft did not state, labelled or not. One per reply, however many items. Questions put to the writer outside the rewritten notes do not count.

Main measure: items lost plus facts invented, per reply, by method. Additions are reported next to it. Secondary, hints only: word count and this repo's checker flags.

## What I expect

1. Skill v2 invents less than skill v1.
2. Skill v2 still does not beat the paragraph. I expect the paragraph to stay cleanest and shortest, and I am not confident v2 will match it.
3. Bare adds follow-ups more often than the paragraph.

If v2 does not invent less than v1, the change did not work and the README says so. If v2 matches or beats the paragraph, the README says that, with the caveat below.

## What I will not do

- Add runs to change the result.
- Change the skill, the paragraph or the drafts and count the result as part of this round.
- Count a missing reply as anything but a failed run.

## Limits I already know about

- **The fix is tuned to the faults found, and the new drafts are built to tempt the same faults** (no recorded decision, "the review" and "the check-in", an owner nobody named). A good result shows that the fix works on these kinds of fault. It does not show the skill is good in general.
- Three drafts and 24 replies is small. I wrote the drafts, the skill and the scoring.
- The skill's replies have a recognisable shape, so my scoring is not fully blind.
- It tests fidelity, not whether a reader finds the result easier to read.
