import initialState from './initialState';
import { reducer as counterPlusOneReducer } from './counterPlusOne';
import { reducer as counterMinusOneReducer } from './counterMinusOne';
import { reducer as resetCounterReducer } from './resetCounter';
import { reducer as fetchRedditReactjsListReducer } from './fetchRedditReactjsList';

const reducers = [
  counterPlusOneReducer,
  counterMinusOneReducer,
  resetCounterReducer,
  fetchRedditReactjsListReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Put global reducers here
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
