// LEAF 2. pinch_logs_set — reset Preview before running.
import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario";
import { DefaultLeafInteractor } from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor";
import { findInteractableByName } from "Leaf.lspkg/Interactors/InteractableUtils";
import { expect } from "Leaf.lspkg/Utils/common/Expect";
import { getCoach, getText, wait, SET_DONE_BUTTON } from "./CoachTestUtils";

@component
export class PinchLogsSetScenario extends Scenario {
  async run(): Promise<void> {
    const coach = getCoach();
    expect(coach).toBeTruthy();
    expect(getText("SetText").indexOf("Set 1 of 4")).toBe(0);
    expect(coach.dotsFilled()).toBe(0);

    const interactor = new DefaultLeafInteractor();
    const button = findInteractableByName(SET_DONE_BUTTON);
    expect(button).toBeTruthy();
    await interactor.trigger(button);
    await wait(this, 100);

    expect(getText("SetText").indexOf("Set 2 of 4")).toBe(0);
    expect(coach.setsDone).toBe(1);
    expect(coach.dotsFilled()).toBe(1);
  }
}
