import { sceneObjectActionTypes, ADDSCENEOBJECT } from '../../actions/sceneObject/sceneObject';

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
  karmaScene: WithPIXIDisplayObject[];
}

const initState: SceneObjectI = {
  startScene: [],
  gameScene: [],
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
    default:
      return state;
  }
};

export default reducer;
