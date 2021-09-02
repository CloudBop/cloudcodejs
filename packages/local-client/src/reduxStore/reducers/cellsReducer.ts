import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsReducerState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsReducerState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cellsReducer = produce(
  // immer allows 'mutable' state syntax
  (
    state: CellsReducerState = initialState,
    action: Action
  ): CellsReducerState => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        state.data[id].content = content;
        //using immer, return can be undefined
        //...but TS will typecheck state as [ ... | undefined ]
        return state;

      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        state.order = state.order.filter((id) => id !== action.payload);
        //...but TS will typecheck state as [ ... | undefined ]
        return state;
      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        //
        const idx = state.order.findIndex((id) => id === action.payload.id);
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        const oobound = targetIdx < 0 || targetIdx > state.order.length - 1;
        if (oobound)
          //...but TS will typecheck state as [ ... | undefined ]
          return state;
        //swap cells
        state.order[idx] = state.order[targetIdx];
        state.order[targetIdx] = action.payload.id;
        //...but TS will typecheck state as [ ... | undefined ]
        return state;
      case ActionType.INSERT_CELL_AFTER: {
        const newCell: Cell = {
          id: randomId(),
          type: action.payload.type,
          content: "",
        };
        state.data[newCell.id] = newCell;
        const idx = state.order.findIndex((id) => id === action.payload.id);

        //insertAfter
        if (idx < 0) state.order.unshift(newCell.id);
        else state.order.splice(idx + 1, 0, newCell.id);

        //insertBefore
        // if (idx < 0) state.order.push(newCell.id);
        // else state.order.splice(idx, 0, newCell.id);
        //...but TS will typecheck state as [ ... | undefined ]
        return state;
      }
      case ActionType.FETCH_CELLS:
        state.loading = true;
        state.error = null;
        return state;
      case ActionType.FETCH_CELLS_COMPLETE:
        state.order = action.payload.map((cell) => cell.id);
        state.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell;
          return acc;
          // tell typescript it should use this interface data
        }, {} as CellsReducerState["data"]);
        return state;
      case ActionType.FETCH_CELLS_ERROR:
        state.loading = false;
        state.error = action.payload;
        return state;

      case ActionType.SAVE_CELLS_ERROR:
        state.error = action.payload;
        return state;
      default:
        return state;
    }
  },
  // - or ts doesn't like annotate type
  initialState
);

//
const randomId = () => Math.random().toString(36).substr(2, 5);

export default cellsReducer;
