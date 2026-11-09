// LEAF 4. rest_end_go_state — reset Preview before running.
import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario";
import { DefaultLeafInteractor } from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor";
import { findInteractableByName } from "Leaf.lspkg/Interactors/InteractableUtils";
import { expect } from "Leaf.lspkg/Utils/common/Expect";
import { getCoach, getText, wait, isGreen, SET_DONE_BUTTON } from "./CoachTestUtils";
import { REST_SECONDS } from "../Scripts/RestSetCoach";

@component
export class RestEndGoStateScenario extends Scenario {
  async run(): Promise<void> {
    const coach = getCoach();
    const interactor = new DefaultLeafInteractor();
    await interactor.trigger(findInteractableByName(SET_DONE_BUTTON));
    const chimesBefore = coach.chimeCount;

    await wait(this, REST_SECONDS * 1000 + 500);
    expect(coach.state).toBe("GO");
    expect(getText("PaceText")).toBe("GO — Set 2 · 5 × 100 · hold depth");
    expect(getText("TimerText")).toBe("GO");
    expect(isGreen(coach.cardColor())).toBeTruthy();
    // Bonus (not required): chime was requested once.
    expect(coach.chimeCount).toBe(chimesBefore + 1);
  }
}
