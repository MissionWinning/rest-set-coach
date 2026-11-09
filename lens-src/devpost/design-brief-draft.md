---
status: draft (Snowden's answer sheet for the plan-lens interview — plan-lens must still interview you and write devpost/design-brief.md; use these as YOUR answers, change anything you disagree with)
---

# Design brief (draft answers): Rest-Set Coach

> How to use: run `plan-lens`, and when it asks each question, answer in your own words using the matching section below. Don't paste this file in whole — the rules say the Lens must be *planned with the skill pack*, and plan-lens is learner-led.

## Q1 The idea
"Between sets at the gym I pull out my phone to check my rest timer and what's next, and log the set. I want that on glasses: a rest timer and my next set sitting next to the rack, and I pinch once to log the set." (This is my real product, Mission Winning — "Log a set. No account. No wearable.")

## Q2 The one spatial moment
I've just racked the bar. Without touching my phone, I see a small card standing beside the rack at chest height: a big rest countdown, and under it "NEXT: Set 3 of 4 — 5 reps × 100 kg". When rest hits zero it chimes and turns green ("GO"). I do the set, then pinch the big "SET DONE" button on the card; it logs the set, ticks a dot, and the next rest starts.
- Glasses strengths: leaves my body free (hands on the bar, eyes up), draws in the world (lives at the rack, not in my pocket).
- Why worse on a phone: chalky hands, phone on the floor, unlocking it breaks focus and kills rest timing.

## Q3 Product or overlay
- Product (the coach card is the experience).
- Real version would sense: nothing required. (Future: rep counting — out of scope.)
- Stand-in for the preview: a virtual squat rack (simple box frame, ~120 cm wide × 200 cm tall) placed 1.5 m in front of the start position, so the card has something real-sized to sit beside. The workout plan is hard-coded sample data (Back Squat, 4 sets × 5 @ 100 kg, 10 s demo rest).

## Q4 Where things live
- Looking at: the rack / bar while resting.
- Coach card: a child of the virtual rack (rack + card share one root placed ~1.5 m in front of the start position), to the right of the rack, ~140 cm high (a little below eye level), ~1.2 m from where I stand. Size about 40 cm wide × 30 cm tall. Faces me on start.
- Rest timer: biggest text on the card, readable from 2 m (default ~8 cm tall digits).
- Next-set line: under the timer, ~3 cm text.
- Set dots (●●○○): along the bottom of the card.
- SET DONE button: bottom of card, ≥ 12 cm wide (default), highlights when aimed at.

## Q5 Hands
- Pinch SET DONE (SIK PinchButton / UI Kit button) → logs the set, starts rest.
- No voice; no custom gestures.

## Q6 When things show
- During rest: timer counts down in white/cyan; SET DONE dimmed but pressable.
- Rest hits 0: chime (spatial sound from the card), card turns green and shows a rally-style "pace note" call for the next set, e.g. "GO — Set 3 · 5 × 100 · hold depth" (co-driver style: short, one line, eyes-up).
- 3 s before rest ends: card pulses / "READY" so I can step under the bar on time.
- After the last set: card shows "Workout logged ✓ 4/4 sets" summary, then the timer hides.
- Out of view: the chime is the cue; no arrows.
- No black/dark panels — light text on a semi-transparent tinted card (additive display).

## Q7 Done criteria (checkable in Lens Studio preview)
1. On start, a coach card appears beside a virtual rack ~1.2 m in front of me, readable from the start position.
2. Pinching SET DONE logs the set: the set counter advances (Set 1 → Set 2) and one dot fills.
3. After SET DONE, a 10 s rest countdown starts and visibly counts down.
4. When the countdown reaches 0, the card turns green and shows "GO" with the next set's pace note (the chime plays too; the visual change must work even if the sound doesn't).
5. After the 4th set, the card shows the "Workout logged 4/4" summary.

## Out of scope
Rep counting, camera form-checking, saving history between sessions, syncing to the Mission Winning app, multiple exercises.

## Risks and open questions
- Rest is fixed at 10 s for the demo (a constant at the top of the script, shown as a small "DEMO 10 s" label on the card). Real 90 s rest is out of scope for this build.
- Feel unproven: readability at real gym lighting, whether pinch with chalky hands is reliable on real SPECS.
- Innovation: fitness timers are common; the hook is "a rally co-driver for the rack": the plan lives at the rack and calls your next set like a pace note — zero phone, one pinch. (Founder's rally co-driver idea merged in; full route/GPS version kept for a later round.)
