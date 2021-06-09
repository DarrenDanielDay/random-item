import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import ReactDOM from "react-dom";
import { LinkedStack } from "taio/build/data-structure/stack/linked-stack";
import { debounce } from 'lodash-es'
const App: React.FC = () => {
  useEffect(() => {
    const stack = new LinkedStack<number>();
    stack.push(1);
    stack.push(2);
    console.log([...stack]);
  });
  let [count, setCount] = useState(0);
  setCount = debounce(setCount, 1000);
  return (
    <div>
      Hello, React count = {count}
      <Button
        onClick={() => {
          setCount(count => count + 1)
        }}
      >
        material UI
      </Button>
      <div>{count}</div>
    </div>
  );
};

ReactDOM.render(<App></App>, document.getElementById("app"));
