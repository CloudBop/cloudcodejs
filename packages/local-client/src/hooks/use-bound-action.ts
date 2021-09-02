import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../reduxStore";
export const useBoundActions = () => {
  const dispatch = useDispatch();
  return useMemo(() => bindActionCreators(actionCreators, dispatch), [
    dispatch,
  ]);
  // return bindActionCreators(actionCreators, dispatch);
};
