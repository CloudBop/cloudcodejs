import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { persistMiddleware } from "./middleware/persist-mw";
export const store = createStore(
  reducers,
  {},
  applyMiddleware(persistMiddleware, thunk)
);

/**manual redux tests */
// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: null,
//     type: "code",
//   },
// });
// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: null,
//     type: "text",
//   },
// });

// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: null,
//     type: "code",
//   },
// });
// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: null,
//     type: "text",
//   },
// });

// console.log(store.getState());
