import { SceneObject } from '../../reducers/sceneObject/sceneObject';

export const ADDSCENEOBJECT = 'ADDSCENEOBJECT';


interface AddSceneObjectActionI {
  type: typeof ADDSCENEOBJECT;
  payload: {
    sceneTarget: keyof SceneObject;
    displayObject: PIXI.DisplayObject;
  };
}

export const addSceneObject = (
  sceneTarget: keyof SceneObject,
  displayObject: PIXI.DisplayObject,
): AddSceneObjectActionI => ({
  type: ADDSCENEOBJECT,
  payload: {
    sceneTarget,
    displayObject,
  },
});

export type sceneObjectActionTypes = AddSceneObjectActionI;
