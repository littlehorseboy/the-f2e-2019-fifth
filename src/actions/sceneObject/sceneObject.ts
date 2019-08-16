import { WithPIXIDisplayObject, SceneObjectI } from '../../reducers/sceneObject/sceneObject';

export const ADDSCENEOBJECT = 'ADDSCENEOBJECT';

interface AddSceneObjectActionI {
  type: typeof ADDSCENEOBJECT;
  payload: {
    sceneTarget: keyof SceneObjectI;
    displayObject: WithPIXIDisplayObject;
  };
}

export const addSceneObject = (
  sceneTarget: keyof SceneObjectI,
  displayObject: WithPIXIDisplayObject,
): AddSceneObjectActionI => ({
  type: ADDSCENEOBJECT,
  payload: {
    sceneTarget,
    displayObject,
  },
});

export type sceneObjectActionTypes = AddSceneObjectActionI;
