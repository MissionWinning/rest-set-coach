// LEAF 5. workout_summary — reset Preview before running. Takes ~33 s (3 real 10 s rests).
import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario";
import { DefaultLeafInteractor } from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor";
import { findInteractableByName } from "Leaf.lspkg/Interactors/InteractableUtils";
import { expect } from "Leaf.lspkg/Utils/common/Expect";
import { getCoach, getText, wait, SET_DONE_BUTTON } from "./CoachTestUtils";
import { REST_SECONDS, TOTAL_SETS } from "../Scripts/RestSetCoach";

@component
export class WorkoutSummaryScenario extends Scenario {
  async run(): Promise<void> {
    const coach = getCoach();
    const interactor = new DefaultLeafInteractor();
    const button = findInteractableByName(SET_DONE_BUTTON);
    for (let i = 1; i <= TOTAL_SETS; i++) {
      await interactor.trigger(button);
      await wait(this, 100);
      expect(coach.setsDone).toBe(i);
      if (i < TOTAL_SETS) {
        await wait(this, REST_SECONDS * 1000 + 500); // full rest -> GO
        expect(coach.state).toBe("GO");
      }
    }
    expect(coach.state).toBe("DONE");
    expect(coach.dotsFilled()).toBe(4);
    expect(getText("PaceText").indexOf("4/4")).toBeGreaterThan(-1);
  }
}
