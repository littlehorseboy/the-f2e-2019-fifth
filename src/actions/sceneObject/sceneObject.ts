import { WithPIXIDisplayObject, SceneObjectI } from '../../reducers/sceneObject/sceneObject';

export const ADDSCENEOBJECT = 'ADDSCENEOBJECT';
export const REMOVEALLSCENEOBJECT = 'REMOVEALLSCENEOBJECT';

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

interface RemoveAllSceneObjectActionI {
  type: typeof REMOVEALLSCENEOBJECT;
  payload: {
    sceneTarget: keyof SceneObjectI;
  };
}

export const removeAllSceneObject = (
  sceneTarget: keyof SceneObjectI,
): RemoveAllSceneObjectActionI => ({
  type: REMOVEALLSCENEOBJECT,
  payload: {
    sceneTarget,
  },
});

export type sceneObjectActionTypes = AddSceneObjectActionI | RemoveAllSceneObjectActionI;
