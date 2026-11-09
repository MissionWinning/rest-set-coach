// LEAF 3. rest_countdown_runs — reset Preview before running.
import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario";
import { DefaultLeafInteractor } from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor";
import { findInteractableByName } from "Leaf.lspkg/Interactors/InteractableUtils";
import { expect } from "Leaf.lspkg/Utils/common/Expect";
import { getCoach, getText, wait, SET_DONE_BUTTON } from "./CoachTestUtils";
import { REST_SECONDS } from "../Scripts/RestSetCoach";

@component
export class RestCountdownRunsScenario extends Scenario {
  async run(): Promise<void> {
    const coach = getCoach();
    const interactor = new DefaultLeafInteractor();
    await interactor.trigger(findInteractableByName(SET_DONE_BUTTON));
    await wait(this, 50);

    expect(coach.state).toBe("REST");
    // timing tolerance (slow preview frames): first visible value may already be 0:09
    expect(getText("TimerText").indexOf("0:")).toBe(0);
    const start = coach.restLeft;
    expect(start).toBeGreaterThan(REST_SECONDS - 2);

    await wait(this, 2000);
    expect(coach.restLeft).toBeLessThan(start - 1.5);
    expect(coach.state).toBe("REST");
  }
}
