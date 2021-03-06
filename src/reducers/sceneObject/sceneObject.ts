import { sceneObjectActionTypes, ADDSCENEOBJECT, REMOVEALLSCENEOBJECT } from '../../actions/sceneObject/sceneObject';

export interface WithPIXIDisplayObject {
  id: string;
  description: string;
  displayObject: PIXI.Text | PIXI.TilingSprite | PIXI.Sprite | PIXI.Container;
  vx?: number;
  vy?: number;
}

export interface SceneObjectI {
  startScene: WithPIXIDisplayObject[];
  gameScene: WithPIXIDisplayObject[];
  endScene: WithPIXIDisplayObject[];
  karmaScene: WithPIXIDisplayObject[];
}

const initState: SceneObjectI = {
  startScene: [],
  gameScene: [],
  endScene: [],
  karmaScene: [],
};

const reducer = (state = initState, action: sceneObjectActionTypes): SceneObjectI => {
  switch (action.type) {
    case ADDSCENEOBJECT:
      return {
        ...state,
        [action.payload.sceneTarget]: [
          ...state[action.payload.sceneTarget],
          action.payload.displayObject,
        ],
      };
    case REMOVEALLSCENEOBJECT:
      return {
        ...state,
        [action.payload.sceneTarget]: [],
      };
    default:
      return state;
  }
};

export default reducer;
