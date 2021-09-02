import { Dispatch } from "react";
import { saveCells } from "../action-creators";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { RootState } from "../reducers";

export const persistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  //nodejs ts issue
  let timer: any;
  //
  return (next: (action: Action) => void) => {
    return (action: Action) => {
      next(action);

      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        // debounce
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          // console.log("time to saveCells");
          // fn within fn need args - see actionCreators
          saveCells()(dispatch, getState);
          //
        }, 400);
      } else {
      }
    };
  };
};
