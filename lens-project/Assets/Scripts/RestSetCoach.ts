/**
 * RestSetCoach.ts — Rest-Set Coach (Learn AR with SPECS, Nov 2026)
 *
 * One component that drives the whole lens:
 *   GO (Set 1)  --pinch SET DONE-->  REST (10 s countdown, READY at <=3 s)
 *   REST --0 s--> GO (green card, chime, pace note "GO — Set N · 5 × 100 · hold depth")
 *   4th pinch --> DONE ("Workout logged ✓ 4/4 sets", timer hidden)
 *
 * API references (every engine / SIK API used below is listed here and cited inline):
 *  [TS]   TypeScript components, @component / @input / @allowUndefined / @hint, onAwake, getTypeName:
 *         https://developers.snap.com/lens-studio/features/scripting/typescript
 *  [EVT]  createEvent("OnStartEvent" / "UpdateEvent"):
 *         https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.UpdateEvent.html
 *  [DT]   getDeltaTime(): https://developers.snap.com/lens-studio/api/lens-scripting/functions/Built-In.getDeltaTime.html
 *  [TXT]  Text.text, Text.textFill.color: https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.Text.html
 *  [RMV]  RenderMeshVisual.mainMaterial / mainPass: https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.RenderMeshVisual.html
 *  [MAT]  Material.clone(), Material.mainPass: https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.Material.html
 *  [PASS] Pass.baseColor: https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.Pass.html
 *  [AUD]  AudioComponent.play(loops): https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.AudioComponent.html
 *         (usage `audio.play(1)` as in Snapchat/Spectacles-Sample "Path Pioneer/Assets/Scripts/LoopController.ts")
 *  [SO]   SceneObject.enabled / getComponent: https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.SceneObject.html
 *  [SIK]  Interactable + onTriggerEnd.add, import path:
 *         https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/interactionsystem
 *         (usage `this.interactable.onTriggerEnd.add(...)` as in Snapchat/Spectacles-Sample
 *          "Spatial Persistence/Assets/SpatialPersistance/MenuUI/ResetButton.ts")
 *
 * Why Interactable instead of importing PinchButton: SIK's PinchButton sits on top of an Interactable
 * (it needs one on the same SceneObject), and LEAF's findInteractableByName() + trigger() drives the
 * Interactable. Listening to the Interactable works whether the SET DONE object has a PinchButton,
 * a UI Kit button, or just Interactable + Collider, and it does not depend on PinchButton's path,
 * which moves between SIK versions.
 */
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"; // [SIK]

// ---- Demo constants (brief: "REST_SECONDS = 10 constant at the top of the script") ----
export const REST_SECONDS = 10;
export const READY_AT_SECONDS = 3;
export const TOTAL_SETS = 4;
export const EXERCISE = "Back Squat";
export const REPS = 5;
export const LOAD_KG = 100;
export const PACE_CUE = "hold depth";

export type CoachState = "GO" | "REST" | "DONE";

// Colors (additive display: light, never black). vec4 = r,g,b,a.
const CARD_REST = new vec4(0.35, 0.75, 0.9, 0.35);  // translucent cyan tint
const CARD_READY = new vec4(0.95, 0.85, 0.35, 0.45); // warm amber pulse
const CARD_GO = new vec4(0.2, 0.9, 0.35, 0.5);       // green
const CARD_DONE = new vec4(0.6, 0.9, 1.0, 0.35);
const TEXT_LIGHT = new vec4(0.85, 1.0, 1.0, 1.0);
const DOT_ON = new vec4(0.6, 1.0, 1.0, 1.0);
const DOT_OFF = new vec4(0.6, 1.0, 1.0, 0.2);
const BUTTON_ON = new vec4(0.6, 1.0, 1.0, 0.8);
const BUTTON_DIM = new vec4(0.6, 1.0, 1.0, 0.35);

@component // [TS]
export class RestSetCoach extends BaseScriptComponent {
  @input // [TS]
  @hint("SceneObject holding the SET DONE Interactable (+ Collider, optionally SIK PinchButton)")
  setDoneButton: SceneObject;

  @input @hint("Big rest countdown text") timerText: Text;          // [TXT]
  @input @hint("'Set N of 4 — 5 × 100 kg'") setText: Text;           // [TXT]
  @input @hint("Pace note / status line") paceText: Text;            // [TXT]
  @input @hint("Card background (Plane) visual") cardVisual: RenderMeshVisual; // [RMV]
  @input @hint("4 dot visuals, left to right") dots: RenderMeshVisual[];      // [RMV]

  @input @allowUndefined @hint("Optional: SET DONE plate visual, dimmed during rest")
  buttonVisual: RenderMeshVisual;
  @input @allowUndefined @hint("Optional: chime AudioComponent on the card") chime: AudioComponent; // [AUD]
  @input @allowUndefined @hint("Optional: small 'DEMO 10 s' label") demoLabel: Text;

  // ---- Public, read-only-ish state for LEAF scenarios ----
  state: CoachState = "GO";
  setsDone = 0;            // sets logged so far (0..4)
  restLeft = 0;            // seconds left in the current rest
  chimeCount = 0;          // how many times the chime was requested (LEAF bonus check)

  private interactable: Interactable;
  private lastPinchTime = -1;
  private elapsed = 0;

  onAwake() { // [TS]
    this.createEvent("OnStartEvent").bind(() => this.onStart()); // [EVT]
    this.createEvent("UpdateEvent").bind(() => this.onUpdate()); // [EVT]
  }

  private onStart() {
    // Clone materials so tinting one visual does not tint every object sharing the material. [MAT][RMV]
    this.cardVisual.mainMaterial = this.cardVisual.mainMaterial.clone();
    for (const d of this.dots) d.mainMaterial = d.mainMaterial.clone();
    if (this.buttonVisual) this.buttonVisual.mainMaterial = this.buttonVisual.mainMaterial.clone();

    for (const t of [this.timerText, this.setText, this.paceText, this.demoLabel]) {
      if (t) t.textFill.color = TEXT_LIGHT; // [TXT]
    }
    if (this.demoLabel) this.demoLabel.text = "DEMO " + REST_SECONDS + " s"; // [TXT]

    this.interactable = this.setDoneButton.getComponent(Interactable.getTypeName()); // [SO][SIK]
    if (!this.interactable) {
      print("[RestSetCoach] SET DONE object has no Interactable — add SIK Interactable + Collider.");
    } else {
      this.interactable.onTriggerEnd.add(() => this.onSetDone()); // [SIK]
    }
    this.enterGo(false); // Set 1 is ready to lift on start
  }

  /** Called on pinch (SIK trigger end). Public so tests/other scripts can call it too. */
  onSetDone() {
    if (this.state === "DONE") return;
    // Debounce double triggers from one pinch (0.4 s).
    if (this.lastPinchTime >= 0 && this.elapsed - this.lastPinchTime < 0.4) return;
    this.lastPinchTime = this.elapsed;

    this.setsDone = Math.min(TOTAL_SETS, this.setsDone + 1);
    this.renderDots();
    if (this.setsDone >= TOTAL_SETS) {
      this.enterDone();
    } else {
      this.enterRest();
    }
  }

  private onUpdate() {
    const dt = getDeltaTime(); // [DT]
    this.elapsed += dt;
    if (this.state !== "REST") return;

    this.restLeft = Math.max(0, this.restLeft - dt);
    this.timerText.text = this.formatTime(this.restLeft); // [TXT]

    if (this.restLeft <= 0) {
      this.enterGo(true);
    } else if (this.restLeft <= READY_AT_SECONDS) {
      // READY pulse: alternate amber / cyan twice a second.
      const on = Math.floor(this.restLeft * 2) % 2 === 0;
      this.setCardColor(on ? CARD_READY : CARD_REST);
      this.paceText.text = "READY — step under the bar";
    }
  }

  private enterRest() {
    this.state = "REST";
    this.restLeft = REST_SECONDS;
    this.timerText.sceneObject.enabled = true; // [SO]
    this.timerText.text = this.formatTime(this.restLeft);
    this.setText.text = this.setLine(this.setsDone + 1);
    this.paceText.text = "REST — next: Set " + (this.setsDone + 1) + " · " + REPS + " × " + LOAD_KG;
    this.setCardColor(CARD_REST);
    this.setButtonColor(BUTTON_DIM);
  }

  private enterGo(withChime: boolean) {
    this.state = "GO";
    this.restLeft = 0;
    const n = this.setsDone + 1;
    this.timerText.sceneObject.enabled = true;
    this.timerText.text = "GO";
    this.setText.text = this.setLine(n);
    this.paceText.text = this.paceNote(n);
    this.setCardColor(CARD_GO);
    this.setButtonColor(BUTTON_ON);
    this.renderDots();
    if (withChime) {
      this.chimeCount++;
      if (this.chime) this.chime.play(1); // [AUD] visual GO state never depends on sound
    }
  }

  private enterDone() {
    this.state = "DONE";
    this.restLeft = 0;
    this.timerText.text = "";
    this.timerText.sceneObject.enabled = false; // [SO] timer hides after the last set
    this.setText.text = EXERCISE + " — " + TOTAL_SETS + " × " + REPS + " @ " + LOAD_KG + " kg";
    this.paceText.text = "Workout logged ✓ " + this.setsDone + "/" + TOTAL_SETS + " sets";
    this.setCardColor(CARD_DONE);
    this.setButtonColor(BUTTON_DIM);
  }

  /** "GO — Set 3 · 5 × 100 · hold depth" (rally co-driver style pace note) */
  paceNote(n: number): string {
    return "GO — Set " + n + " · " + REPS + " × " + LOAD_KG + " · " + PACE_CUE;
  }

  private setLine(n: number): string {
    return "Set " + n + " of " + TOTAL_SETS + " — " + REPS + " reps × " + LOAD_KG + " kg";
  }

  private formatTime(s: number): string {
    const whole = Math.ceil(s);
    const m = Math.floor(whole / 60);
    const sec = whole % 60;
    return m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  private renderDots() {
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].mainPass.baseColor = i < this.setsDone ? DOT_ON : DOT_OFF; // [RMV][PASS]
    }
  }

  /** Number of dots currently filled (for LEAF). */
  dotsFilled(): number {
    return Math.min(this.setsDone, this.dots.length);
  }

  /** Card tint as last set (for LEAF "card is green" checks). */
  cardColor(): vec4 {
    return this.cardVisual.mainPass.baseColor; // [PASS]
  }

  private setCardColor(c: vec4) {
    this.cardVisual.mainPass.baseColor = c; // [RMV][PASS]
  }

  private setButtonColor(c: vec4) {
    if (this.buttonVisual) this.buttonVisual.mainPass.baseColor = c; // [PASS]
  }
}
