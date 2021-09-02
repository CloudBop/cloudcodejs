import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./reduxStore";
// import CodeCell from "./components/code-cell";
// import TextEditor from "./components/text-editor";
import CellList from "./components/cell-list";

const App = () => {
  return (
    <Provider store={store}>
      <div
      // className={"app"}
      // style={{ height: "100%", display: "flex", flexDirection: "row" }}
      >
        {/* <CodeCell /> */}
        {/* <CodeCell /> */}
        {/* <TextEditor /> */}
        <CellList />
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
