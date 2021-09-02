import { useEffect } from "react";
// import bundle from "../bundler";
import { useBoundActions } from "../hooks/use-bound-action";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { Cell } from "../reduxStore";
import CodeEditor from "./code-editor";
import Preview from "./code-preview";
import Resizable from "./resizable";
import "./code-cell.css";
import { useCumulativeCode } from "../hooks/use-cumulative-code";
interface ICodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<ICodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useBoundActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    // including [bundle] will cause infinite loop... ignore exhastive deps
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      // on inital load ignore first setTimeout.
      return;
    }

    let timer = setTimeout(async () => {
      // thunk fires async actions
      await createBundle(cell.id, cumulativeCode);
    }, 1000);

    return () => {
      // offMount|rerender
      clearTimeout(timer);
    };
    // if in render phase or as props - ensure createBundle is memoed or will cause useEffect to fire every pass
    // eslint-disable-next-line
  }, [cell.id, cell.content, createBundle, cumulativeCode]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          // minus .add-cell ui margin
          height: "calc(100% - 10px)",
          // width: "100%",
          display: "flex",
          flexDirection: "row",
          minWidth: "300px",
        }}
      >
        <Resizable direction={"horizontal"}>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} bundlingError={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
