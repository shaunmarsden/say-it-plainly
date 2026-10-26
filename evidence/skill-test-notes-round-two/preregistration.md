# Pre-registration, round two: do the notes skill and a paragraph beat a bare request on messy notes?

Written on 26th October 2026, before any reply in this round existed. The time of the first commit on this branch is the proof.

## Why a second round

In [round one](../skill-test/results.md) the notes draft separated nothing: all six replies kept every item, whichever method made them. That left the notes skill unshown. These three drafts are messier, with more disagreements, more half-known owners and dates, and more places to fill a gap.

## Method

The same as round one, and the prompts are built the same way (see `../skill-test/preregistration.md`).

- **Bare.** "Rewrite this to make it clearer."
- **Paragraph.** The same one-paragraph instruction as in round one.
- **Skill.** The text of `plain-notes` pasted first, then "Rewrite it."

Every prompt starts with "(The names and figures below are made up.)" and ends with the draft. Nothing says this is a test.

3 drafts (`drafts/`) x 3 methods x 2 runs = 18 replies, each from a fresh subagent on the same model as me (Sonnet 5.5) with Claude Code's own context. Replies are stored under random names. I score them without knowing the method, then unblind. I do not change the skill, the paragraph or the drafts after seeing a reply.

## Scoring (fixed now)

I score the rewritten text only. Each item is kept (1) or lost (0). Weakened, hardened or dropped counts as lost. Where a reply gives two versions, I score the first.

Planning call
- A1 Priya's 10 hours a week stays, as Priya's figure.
- A2 Dev's 6 hours stays, as Dev's figure, and his claim that Priya counted setup time stays as his claim, not as fact.
- A3 The hours disagreement stays unsettled: no blended figure, and Callum's view stays his own hedged view.
- A4 The 40k stays as two versions (Priya: approved, Dev: a request, not approved), unresolved. It is not written as approved or as a request.
- A5 The proposal owner stays uncertain (Jo, or maybe Callum), and "I think by Friday" stays uncertain. Nobody is assigned and no date is fixed.
- A6 Dev's worry about the data-sharing terms stays an impression, with no reason invented.
- A7 The decision (second pilot in the Leeds depot) stays, and Dev not looking convinced stays an impression. It is not written as agreed by all.
- A8 The November review stays, and "possibly the 12th" stays uncertain.

Supplier call
- B1 Tidewell stays as one of two other suppliers, and the second stays unnamed.
- B2 "Tidewell is cheaper" and "support is slow" stay as Mei's views, and the slow support stays secondhand ("has heard"). Neither is written as fact.
- B3 The quote of 52,000 for 12 months stays with no currency added. Hollis (above budget) and Mei (fine) both stay, unresolved. Hollis confirming the budget figure next week stays.
- B4 The contract end date stays as two versions (Hollis: 31st March, Mei thought 30th April), unresolved, with Ravi checking the contract.
- B5 Onboarding of around 4 weeks stays with the caveat that it comes from another customer and may not apply.
- B6 "Nobody mentioned a security review" stays. It is not turned into "no concerns" or "not needed".
- B7 The next call on 5th November stays uncertain ("I think"), and Hollis wanting Ravi to bring a reference customer stays.

Pipeline meeting
- C1 Alma's view that Foxglove closes this month stays as her view.
- C2 Ben's disagreement (legal has not started) stays as his, unresolved.
- C3 Chidi's "might be quick because the contract is standard" stays as his hedged view.
- C4 Marlow: discussed, not decided. It is not written as moved or as staying.
- C5 Ben will update the forecast stays. Chidi's "would look at the Foxglove contract if he has time" stays conditional, not a firm action.
- C6 Quillon stays as Alma wanting 15% to 10%, Ben saying it would lose the deal, and the note-taker having no view. It is unresolved.
- C7 The one decision (forecast call on Monday, not Tuesday) stays, and nothing else is written as a decision.
- C8 The forecast total of 1.2m stays, with the note-taker unsure whether it includes Marlow. No currency is added.

Every reply also gets two counts.
- **Invented**: facts, names, dates, owners, numbers, causes or reasons that are not in the draft, including a currency added to a bare figure, an owner assigned where the draft had none, and a reason given for a worry the draft did not explain.
- **Additions**: actions, next steps or follow-ups that the draft did not state, whether or not the reply labels them. Questions the reply asks the writer do not count.

Main measure: items lost plus facts invented, per reply, by method. Additions are reported next to it, not added to it.

Secondary, hints only: word count of the rewrite against the draft, and flags from this repo's checker (my own tool).

## What I expect

1. Bare loses or invents more than the other two methods.
2. Skill and paragraph differ by less than one item per reply on average.
3. Bare adds follow-up steps in more replies than either of the others. This comes from round one, where both bare notes replies added them.

If the skill does not beat the paragraph here either, the README will say the notes skill has not been shown to add fidelity over a paragraph. If it is worse, it will say that.

## What I will not do

- Add runs to change the result.
- Change the skill, the paragraph or the drafts and count the result as part of this round.
- Count a missing reply as anything but a failed run.

## Limits I already know about

- Three drafts and 18 replies is small. I wrote the drafts, the skill and the scoring, and I built the drafts to tempt a rewrite.
- The skill's replies have a recognisable shape, so my scoring is not fully blind.
- It tests fidelity, not whether a reader finds the result easier to read.
