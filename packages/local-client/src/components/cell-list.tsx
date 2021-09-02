import { Fragment, useEffect } from "react";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { useBoundActions } from "../hooks/use-bound-action";
import AddCell from "./add-cell";
import CellListItem from "./cell-list-item";
import "./cell-list.css";
const CellList: React.FC = () => {
  // const cells= useTypedSelector((state) => state);
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );

  const { fetchCells } = useBoundActions();
  useEffect(() => {
    fetchCells();
    // return () => {
    //   cleanup
    // }
  }, [fetchCells]);

  const renderCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell prevCellId={cell.id} />
    </Fragment>
  ));

  // fun hack for fooling react to rerender last element as new
  // renderCells.push(
  //   <AddCell
  //     key={Math.random()}
  //     forceVisible={cells.length === 0}
  //     nextCellId={null}
  //   />
  // );

  return (
    <div className={"cell-list"}>
      <AddCell forceVisible={cells.length === 0} prevCellId={null} />
      {renderCells}
    </div>
  );
};

export default CellList;
