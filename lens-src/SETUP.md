# SETUP — assemble Rest-Set Coach in Lens Studio 5.23.2 (≈10 min)

Start: Lens Studio → **SPECS Base Template** (it already contains the camera and **SpectaclesInteractionKit** + SIK setup). Units are **cm**. The camera starts at the origin looking down **−Z**.

## 0. Import scripts
Copy `Assets/Scripts/RestSetCoach.ts` into the project's `Assets/Scripts/`. (Optional tests: install **Leaf** from the Asset Library or run `/specs-leaf-install-packages` in CLAD, then copy `Assets/Tests/` into the project's `Assets/Tests/` (tests import `../Scripts/RestSetCoach`).)

## 1. Scene hierarchy (names matter — LEAF finds objects by name)

```
CoachRoot                 position (0, -20, -150)   rotation (0,0,0)
├── Rack                  position (-45, 0, 0)          (virtual squat rack, ~120 × 200 cm)
│   ├── PostLeft          Box mesh, pos (-60, 0, 0),  scale → 5 × 200 × 5 cm
│   ├── PostRight         Box mesh, pos ( 60, 0, 0),  scale → 5 × 200 × 5 cm
│   └── Bar               Box mesh, pos (  0, 40, 0), scale → 140 × 3 × 3 cm
└── CoachCard             position (65, 10, 30)   ← RestSetCoach script goes HERE   (≈1.2 m from start)
    ├── CardBg            Plane/Box mesh, scale → 40 × 30 × 0.5 cm, semi-transparent unlit material
    ├── TimerText         Text, size ~ 8 cm digits, pos (0, 6, 1)
    ├── SetText           Text, ~3 cm, pos (0, -1, 1)
    ├── PaceText          Text, ~2.5 cm, pos (0, -5, 1)
    ├── DemoLabel         Text, ~1.5 cm, pos (14, 12, 1)    (optional, shows "DEMO 10 s")
    ├── Dots              pos (0, -9, 1)
    │   ├── Dot1          Sphere mesh ~2 cm, x = -6
    │   ├── Dot2          x = -2
    │   ├── Dot3          x =  2
    │   └── Dot4          x =  6
    └── SetDoneButton     pos (0, -13, 2)   Box mesh 14 × 4 × 1 cm  ("SET DONE" child Text)
        ├── (components) Collider (Box, fit to mesh) + SIK **Interactable** (+ optional SIK **PinchButton**)
        └── SetDoneLabel  Text "SET DONE", ~2 cm, pos (0,0,0.6)
CoachChime                (optional) — or put the AudioComponent directly on CoachCard
LeafIndex                 (optional, tests) — LeafIndex.ts script
```

Positions of CoachCard are relative to CoachRoot, so the card ends up at world ≈ (65, -10, -120): to the right of the rack, a little below eye level, facing the user (no rotation needed because the camera looks down −Z and Text faces +Z).

## 2. Materials (additive display — never black)
- `CardBg`: Unlit material, **Blend Mode = Normal** (transparent), base color cyan with alpha ~0.35. The script tints it (cyan rest / amber READY / green GO).
- Dots and button plate: Unlit, Blend Mode Normal. Each object can share one material — the script **clones** materials at start so tints stay independent.
- Text: light cyan/white (the script sets it at start).

## 3. Wire the RestSetCoach inputs (Inspector on CoachCard)
| Input | Drag in |
|---|---|
| Set Done Button | `SetDoneButton` (SceneObject) |
| Timer Text | `TimerText` (Text component) |
| Set Text | `SetText` |
| Pace Text | `PaceText` |
| Card Visual | `CardBg` (RenderMeshVisual) |
| Dots (array, 4) | `Dot1`, `Dot2`, `Dot3`, `Dot4` RenderMeshVisuals, in order |
| Button Visual (optional) | `SetDoneButton` RenderMeshVisual |
| Chime (optional) | AudioComponent with a short chime audio asset (Asset Library → search "chime"/"ding"), Play On Awake **off** |
| Demo Label (optional) | `DemoLabel` |

## 4. Interaction check
- `SetDoneButton` must have **Collider + Interactable** (SIK). Interactable *Targeting Mode* = Direct/Indirect (default) so a far pinch-ray works in Preview.
- If you add **PinchButton**, keep it on the same object; the script listens to the Interactable's `onTriggerEnd`, so it fires either way.

## 5. Play
Preview → SPECS device → Interactive Preview. Expected: green "GO / GO — Set 1 · 5 × 100 · hold depth" → pinch SET DONE → dot 1 fills, "Set 2 of 4", 0:10 countdown → amber READY pulse at 3 s → green GO + chime "GO — Set 2 · 5 × 100 · hold depth" → … → after 4th pinch "Workout logged ✓ 4/4 sets", timer hides.

## 6. Tests (LEAF)
Add `LeafIndex.ts` to a `LeafIndex` SceneObject. Open the LEAF panel, **reset the Preview before each scenario** (every scenario assumes a fresh start), run: `card_visible_on_start`, `pinch_logs_set`, `rest_countdown_runs`, `rest_end_go_state`, `workout_summary` (~33 s). Report PASS/FAIL in SUBMISSION_DRAFT.md honestly.

## CLAD shortcut
Paste to Claude Code (with the Lens Studio MCP connected): *"Import lens-src/Assets/Scripts/RestSetCoach.ts and build the scene exactly as lens-src/SETUP.md describes, wire every input in section 3, then install LEAF, add lens-src/Assets/Tests, and run all 5 scenarios, resetting the preview between each."*
