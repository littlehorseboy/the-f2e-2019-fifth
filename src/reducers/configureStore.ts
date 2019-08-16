import { createStore, combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension/developmentOnly';
import sceneObjectReducer from './sceneObject/sceneObject';

const rootReducer = combineReducers({
  sceneObjectReducer,
});

const store = createStore(
  rootReducer,
  devToolsEnhancer({}),
);

export default store;
