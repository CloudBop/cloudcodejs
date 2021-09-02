import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";

interface BundleState {
  [key: string]:
    | {
        loading: boolean;
        code: string;
        err: string;
        //
      }
    // allow state to be undefined
    | undefined;
}

const initialState: BundleState = {};

const bundleReducer = produce(
  // immer produce doesn't have to return anythin, but return is needed for ts annotation
  (state: BundleState = initialState, action: Action): BundleState => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        //
        state[action.payload.cellId] = {
          loading: true,
          code: "",
          err: "",
        };

        return state;
      case ActionType.BUNDLE_COMPLETE:
        //
        state[action.payload.cellId] = {
          loading: false,
          code: action.payload.bundle.code,
          err: action.payload.bundle.err,
        };
        return state;
      //
      default:
        return state;
    }
  },
  // || ts complains.
  initialState
);

export default bundleReducer;
