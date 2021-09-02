import { Cell } from "../reduxStore";
import CellActionBar from "./cell-action-bar";
import CodeCell from "./code-cell";
import TextEditor from "./text-editor";
import "./cell-list-item.css";
interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;
  if (cell.type === "code")
    child = (
      <>
        <div className="action-bar-wrapper">
          <CellActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  else
    child = (
      <>
        <TextEditor cell={cell} />
        <CellActionBar id={cell.id} />
      </>
    );

  return <div className="cell-list-item">{child}</div>;
};

export default CellListItem;
