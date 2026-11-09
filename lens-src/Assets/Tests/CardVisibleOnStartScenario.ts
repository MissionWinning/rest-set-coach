// LEAF 1. card_visible_on_start — https://developers.specs.com/docs/clad/tools/test-your-lens-with-leaf
import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario";
import { findSceneObjectByName } from "Leaf.lspkg/Utils/common/Utils";
import { expect } from "Leaf.lspkg/Utils/common/Expect";
import { COACH_OBJECT, CAMERA_OBJECT } from "./CoachTestUtils";

@component
export class CardVisibleOnStartScenario extends Scenario {
  async run(): Promise<void> {
    const card = findSceneObjectByName(COACH_OBJECT);
    expect(card).toBeTruthy();
    expect(card.isEnabledInHierarchy).toBeTruthy();
    const cam = findSceneObjectByName(CAMERA_OBJECT);
    expect(cam).toBeTruthy();
    // Lens Studio world units are cm. Brief: card ~1.2 m away, root ~1.5 m in front.
    const camPos = cam.getTransform().getWorldPosition();
    const cardPos = card.getTransform().getWorldPosition();
    const dist = camPos.distance(cardPos);
    expect(dist).toBeGreaterThan(80);
    expect(dist).toBeLessThan(220);
    // Camera faces -Z at start in Lens Studio, so "in front" means smaller Z.
    expect(cardPos.z).toBeLessThan(camPos.z);
  }
}
