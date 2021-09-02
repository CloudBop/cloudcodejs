import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../reduxStore";
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
