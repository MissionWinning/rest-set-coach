// Scenario registry — attach to a SceneObject (e.g. "LeafIndex") in the scene.
// https://developers.specs.com/docs/clad/tools/test-your-lens-with-leaf (Register Your Scenarios)
import { scenariosIndex } from "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator";
import { ScenarioMetadata } from "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata";
import { CardVisibleOnStartScenario } from "./CardVisibleOnStartScenario";
import { PinchLogsSetScenario } from "./PinchLogsSetScenario";
import { RestCountdownRunsScenario } from "./RestCountdownRunsScenario";
import { RestEndGoStateScenario } from "./RestEndGoStateScenario";
import { WorkoutSummaryScenario } from "./WorkoutSummaryScenario";

@component
export class LeafIndex extends BaseScriptComponent {
  @scenariosIndex
  static scenariosIndex: ScenarioMetadata[] = [
    { id: "card_visible_on_start", typename: CardVisibleOnStartScenario.getTypeName() },
    { id: "pinch_logs_set", typename: PinchLogsSetScenario.getTypeName() },
    { id: "rest_countdown_runs", typename: RestCountdownRunsScenario.getTypeName() },
    { id: "rest_end_go_state", typename: RestEndGoStateScenario.getTypeName() },
    { id: "workout_summary", typename: WorkoutSummaryScenario.getTypeName() },
  ];
}
