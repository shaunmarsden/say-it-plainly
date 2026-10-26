# Pre-registration: do the skills help?

Written on 26th October 2026 at 12:45 GMT, before any reply was generated. The commit time on this file is the proof.

## The question

When I ask an AI tool to rewrite a draft, does pasting one of the `say-it-plainly` skills first keep the draft's claims intact better than a plain request, or better than one short paragraph of instructions?

## The three arms

Each arm gets the same fictional draft. The words "Rewrite it." come last in every arm. Nothing in any prompt says this is a test.

- **Bare.** "Rewrite this to make it clearer."
- **Paragraph.** One paragraph: use plain words, put the point first, cut filler, name who did what, keep every figure, hedge and disagreement exactly as strong as in the draft, and add no fact, name, date or owner.
- **Skill.** The whole text of the matching skill (`plain-email`, `plain-notes` or `plain-report`), pasted first, then "Rewrite it."

## The drafts

Three made-up drafts in `drafts/`: an email, call notes and a short report. Each has planted traps: a hedge that a tidy rewrite would harden, a disagreement it would be tempted to settle, a gap (an owner, a name) it would be tempted to fill.

## Design

3 drafts x 3 arms x 2 runs = 18 replies. Each reply comes from a fresh subagent that reads one prompt file and writes its reply to one file. Replies are stored under random names. I score them from those files without looking at which arm each came from, then unblind.

The subagents run on the same model as me (Sonnet 5.5) with Claude Code's own context, so replies may differ from a plain chat window. That affects all arms equally but limits what the result says.

## Scoring (fixed now)

I score the rewritten text only, not the notes a skill adds around it. Each item below is kept (1) or lost (0). Weakened, hardened or dropped counts as lost.

Email
- E1 "Mid-June" stays an estimate, not a promise or fixed date.
- E2 The need to check with Owen before promising stays.
- E3 Price of £18,000 for the first year stays exactly.
- E4 The training Dan ran in the pilot stays.
- E5 The ask for the signed order form by Friday stays.
- E6 The question about IT approval of single sign-on stays.
- E7 The question about who to speak to on the data-sharing agreement stays.

Notes
- N1 Maria's 4% stays, as her view ("thinks").
- N2 Tom's 6% for last quarter stays, as his view.
- N3 The disagreement is left unsettled (no blended or chosen figure), and it stays clear that nobody checked.
- N4 Maria's interest in extra seats stays an impression, with no number committed.
- N5 Budget sign-off with an unnamed finance director stays.
- N6 Nobody is named as the sender of the revised terms.
- N7 Maria's end-of-month wish stays uncertain.
- N8 The decision to stay on the current plan until the terms are reviewed stays.

Report
- R1 The 12% rise and the 2,050 to 2,300 figures stay exactly.
- R2 "May be related" stays at that strength (no "caused", "driven by", "due to").
- R3 The onboarding emails starting the same month stay as a second possible cause.
- R4 The admission that the two cannot be separated stays.
- R5 UK queue only checked, Ireland not looked at, both stay.
- R6 The recommendation stays a lean towards holding the 3.3 release, with the decision left to the reader.
- R7 No invented figure, cause or name.

Every reply also gets an **invented** count: facts, names, dates, owners, numbers or causes that are not in the draft.

Main measure: items lost plus facts invented, per reply, by arm. Lower is better.

Secondary measures, read as hints only: word count of the rewrite against the draft, and the number of flags the checker in this repo raises on the rewrite. The checker is mine and uses my own rules, so it cannot show that a rewrite is better, only that it is plainer by my rules.

## What I expect

1. Bare loses or invents more than the other two arms.
2. Skill and paragraph differ by less than one item per reply on average.

If both hold, the README will say the skills match a good paragraph and add structure and a checker, not more fidelity. If the skill is better, it will say that, with the numbers. If it is worse, it will say that.

## What I will not do

- Add runs to change the result.
- Edit a skill, prompt or draft after seeing replies and count the result as part of this test. A fix would be a new, labelled round.
- Count a missing reply as anything but a failed run, reported as such.

## Limits I already know about

- Three drafts is a small sample, and 18 replies show a pattern at most.
- I wrote the skills, the drafts and the scoring. The drafts are built to expose the failure the skills guard against.
- The skill arm's output has a recognisable shape, so my scoring is not fully blind.
- It tests fidelity, not whether a reader finds the rewrite easier to read.
