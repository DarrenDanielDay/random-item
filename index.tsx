import Button from "@material-ui/core/Button";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { LinkedStack } from "taio/build/data-structure/stack/linked-stack";

const App: React.FC = () => {
  useEffect(() => {
    const stack = new LinkedStack<number>();
    stack.push(1);
    stack.push(2);
    console.log([...stack]);
  });
  return (
    <div>
      Hello, React!
      <Button
        onClick={() => {
          alert("clicked!!!");
        }}
      >
        material UI
      </Button>
    </div>
  );
};

ReactDOM.render(<App></App>, document.getElementById("app"));
