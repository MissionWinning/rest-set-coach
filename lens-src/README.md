# Rest-Set Coach — a SPECS Lens (Mission Winning AR prototype)

Built for Devpost **Learn AR with SPECS** (Nov 2026). Runs in the Lens Studio preview; no SPECS glasses needed.

**What it does:** a coach card stands beside a (virtual) squat rack and shows your rest countdown and next set. Pinch **SET DONE** to log the set: a dot fills and a 10 s demo rest starts. At 3 s the card pulses READY; at 0 it turns green, chimes, and calls the next set like a rally co-driver's pace note — **"GO — Set 3 · 5 × 100 · hold depth"**. After the 4th set it shows **"Workout logged ✓ 4/4 sets"**. Zero phone, one pinch.

The plan is hard-coded sample data (Back Squat, 4 × 5 @ 100 kg). Rest is fixed at 10 s for the demo (`REST_SECONDS` in `RestSetCoach.ts`).

- **Design brief:** [`devpost/design-brief.md`](devpost/design-brief.md) (written by the Devpost Learn `plan-lens` skill; `design-brief-draft.md` is the founder's answer sheet)
- **Built with:** Lens Studio 5.23.2 (SPECS Base Template), Spectacles Interaction Kit, Snap CLAD via the Lens Studio MCP, Claude Code, LEAF tests
- **Demo video:** <YouTube link>

## Files
- `Assets/Scripts/RestSetCoach.ts` — the whole lens logic (one component)
- `Assets/Tests/` — LEAF scenarios, one per done criterion
- `SETUP.md` — scene hierarchy and input wiring

## Run it
1. Install Lens Studio 5.22+ (5.23.2 recommended).
2. Open the `.esproj` in this folder.
3. Press play in the Preview panel (SPECS device). Pinch SET DONE with the preview hand / mouse.

## Out of scope
Rep counting, camera form-checking, saving history, syncing to the Mission Winning app, GPS route pace notes (planned for a later round).

## Disclosure
Started from the Lens Studio SPECS Base Template; everything else was created during the submission period with AI coding assistance (CLAD, Claude Code, Cursor).

## License
MIT
