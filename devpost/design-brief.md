---
status: approved
approved: Mon Nov 9 2026, ~4:35 PM ET. Snowden confirmed all 7 answers in PLAN_LENS_QUESTIONS.md as his own.
---

# Design brief: Rest-Set Coach (Pace-Note)

## The one spatial moment
I've just racked the bar. A small card stands beside the rack at chest height. Rest hits zero, the card turns green and calls the next set like a rally co-driver: "GO — Set 3 · 5 × 100 · hold depth". I do the set and pinch SET DONE, which logs it, fills a dot and starts the next rest.

## Why it belongs on glasses
- Uses: leaves your body free (hands on the bar, eyes up), draws in the world (it lives at the rack, not in a pocket).
- Why it's better than the phone version: chalky hands, the phone is on the floor, and unlocking it breaks focus and rest timing. A phone timer can't stand at the rack and call you in.
- Not a form coach (no animated demos) and not body tracking or a ghost race.

## Product or overlay
- Type: product. The coach card is the experience. This is Mission Winning's "Log a set. No account. No wearable." on glasses.
- What the real version would sense: nothing.
- Stand-in for the preview: a virtual squat rack (box frame, about 120 cm wide × 200 cm tall) and a hard-coded plan: Back Squat, 4 × 5 @ 100 kg, 10 s demo rest.

## Where things live
- Where the user is looking during the main task: the rack.
- Coach card: beside the rack, a little below eye level, about 40 × 30 cm, facing me. Big rest digits (about 8 cm), the next-set line under them (about 3 cm), the GO pace note in the status line, set dots along the bottom, and a SET DONE button at least 12 cm wide.
- **Placement change during the build:** Snowden's answer put the card about 1.2 m away, to the right of the rack. The built Lens puts it about 1.5 m straight ahead (CoachRoot at (-40, -10, -190) cm, card at about (0, 0, -150) cm world), with the rack to its left. Lens Studio's SPECS preview has a narrow field of view, and at 1.2 m to the right the card fell out of frame.
- Rack: box posts and a bar, behind and left of the card.

## Hands and input
- SET DONE: one pinch on the big button (SIK Interactable + collider). It logs the set and starts the rest.
- Targets are big and highlight when aimed at.
- Voice: none. No custom gestures.

## When things show
- During rest: a white/cyan countdown and a small "DEMO 10 s" label. SET DONE is dimmed.
- At 3 s left: the card pulses amber with "READY — step under the bar".
- At 0: the card turns green and shows the pace-note call. This works without sound. A chime is planned (optional).
- After set 4: "Workout logged 4/4 sets" and the timer hides.
- If the card is out of view: the chime is the cue. No arrows.
- No dark panels: light text on a tinted, semi-transparent card.

## Done criteria
Each one can be checked in Lens Studio's preview, and each has a LEAF scenario.
1. On start, the card appears beside the virtual rack and is readable (`card_visible_on_start`).
2. Pinching SET DONE advances Set 1 → Set 2 and fills one dot (`pinch_logs_set`).
3. A 10 s rest countdown starts and visibly counts down (`rest_countdown_runs`).
4. At 0, the card turns green and shows "GO — <next set pace note>" (`rest_end_go_state`). This is the hero shot, in the first 10 s of the video.
5. After the 4th set, it shows "Workout logged 4/4" (`workout_summary`).

## Out of scope
- Rep counting, camera form checks, form animations, body tracking, saved history, syncing with the Mission Winning app, multiple exercises, live GPS.

## Risks and open questions
- The rest is fixed at 10 s for the demo. Real 90 s rests are out of scope.
- Feel unproven: readability in real gym light, and whether a pinch with chalky hands is reliable on real SPECS.
- Innovation: fitness timers are common on Spectacles. The hook is the rally co-driver pace-note call at the rack.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
