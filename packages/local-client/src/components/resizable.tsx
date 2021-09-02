import { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import "./resizable.css";
interface ResizableProps {
  //
  direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  // initialiser state, needed for re-renders || width/height values won't be updated on change
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: any;
    const listen = () => {
      //
      if (timer) {
        clearTimeout(timer);
      }
      //debounce
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        // required to overrule max/min constrains, broken due to explicit 'width'={ N(px) }
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    //
    window.addEventListener("resize", listen);
    return () => {
      // onUnmount | rerendered & useEffect invoked
      window.removeEventListener("resize", listen);
    };
  }, [width]);

  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.9, Infinity],
      // cheat the 100% problem
      height: Infinity,
      // will overrule max.min constraints, see listen()
      width: width,
      resizeHandles: ["e"],
      onResizeStop: (evt, data) => {
        //onDragEnd
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      className: "resize-vertical",
      minConstraints: [Infinity, 24],
      maxConstraints: [Infinity, innerHeight * 0.9],
      // cheat the 100% problem
      height: 300,
      width: Infinity,
      resizeHandles: ["s"],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
