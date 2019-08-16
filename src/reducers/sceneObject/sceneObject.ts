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

const reducer = (state = initState): SceneObject => state;

export default reducer;
