import axios from "axios";
//todo - refactor into many files
import { Dispatch } from "react";
import { CellTypes, Cell } from "../cell";
import { ActionType } from "../action-types";
import {
  DeleteCellAction,
  InsertCellAfterAction,
  MoveCellAction,
  UpdateCellAction,
  Direction,
  // BundleStartAction,
  // BundleCompleteAction,
  //
  Action,
} from "../actions";
import bundle from "../../bundler";
import { RootState } from "../reducers";

export const updateCell = (id: string, content: string): UpdateCellAction => ({
  type: ActionType.UPDATE_CELL,
  payload: {
    id,
    content,
  },
});
export const deleteCell = (id: string): DeleteCellAction => ({
  type: ActionType.DELETE_CELL,
  payload: id,
});
export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes
): InsertCellAfterAction => ({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id,
    type: cellType,
  },
});

export const moveCell = (id: string, direction: Direction): MoveCellAction => ({
  type: ActionType.MOVE_CELL,
  payload: {
    id,
    direction,
  },
});

export const createBundle = (cellId: string, inputRawCode: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId,
      },
    });

    const result = await bundle(inputRawCode);

    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: result,
        //
        // bundle: {
        //   code: result.code,
        //   err: result.err,
        // },
      },
    });
  };
};

export const fetchCells = () => {
  return async (dispatch: Dispatch<Action>) => {
    // flip loading state
    dispatch({ type: ActionType.FETCH_CELLS });

    try {
      const { data }: { data: Cell[] } = await axios.get("/cells");

      dispatch({ type: ActionType.FETCH_CELLS_COMPLETE, payload: data });
    } catch (err) {
      dispatch({ type: ActionType.FETCH_CELLS_ERROR, payload: err.message });
    }
  };
};

export const saveCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    try {
      const {
        cells: { data, order },
      } = getState();

      const cells = order.map((id) => data[id]);
      await axios.post("/cells", { cells });
    } catch (error) {
      dispatch({
        type: ActionType.SAVE_CELLS_ERROR,
        payload: error.message,
      });
    }
  };
};
