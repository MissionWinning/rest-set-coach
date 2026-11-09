/**
 * Shared helpers for the Rest-Set Coach LEAF scenarios.
 * LEAF imports/API: https://developers.specs.com/docs/clad/tools/test-your-lens-with-leaf
 * DelayedCallbackEvent.reset(seconds): https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.DelayedCallbackEvent.html
 */
import { findSceneObjectByName } from "Leaf.lspkg/Utils/common/Utils";
import { RestSetCoach } from "../Scripts/RestSetCoach";

export const COACH_OBJECT = "CoachCard";      // SceneObject holding RestSetCoach
export const SET_DONE_BUTTON = "SetDoneButton"; // SceneObject holding the SIK Interactable
export const CAMERA_OBJECT = "Camera Object";   // SPECS Base Template camera name (check in your scene)

export function getCoach(): RestSetCoach {
  const so = findSceneObjectByName(COACH_OBJECT);
  // Custom TS components are fetched with getTypeName(): https://developers.snap.com/lens-studio/features/scripting/typescript
  return so.getComponent(RestSetCoach.getTypeName()) as RestSetCoach;
}

export function getText(name: string): string {
  return (findSceneObjectByName(name).getComponent("Text") as Text).text;
}

/** Wait using a DelayedCallbackEvent on the scenario component (LEAF also ships sleep(ms)). */
export function wait(owner: BaseScriptComponent, ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    const e = owner.createEvent("DelayedCallbackEvent");
    e.bind(() => resolve());
    e.reset(ms / 1000);
  });
}

/** Green = G clearly dominant over R and B. */
export function isGreen(c: vec4): boolean {
  return c.g > 0.6 && c.g > c.r + 0.3 && c.g > c.b + 0.3;
}
