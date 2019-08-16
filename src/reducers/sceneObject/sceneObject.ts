import { sceneObjectActionTypes, ADDSCENEOBJECT } from '../../actions/sceneObject/sceneObject';

export interface SceneObject {
  startScene: PIXI.DisplayObject[];
  gameScene: PIXI.DisplayObject[];
  karmaScene: PIXI.DisplayObject[];
}

const initState: SceneObject = {
  startScene: [],
  gameScene: [],
  karmaScene: [],
};

const reducer = (state = initState, action: sceneObjectActionTypes): SceneObject => {
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
