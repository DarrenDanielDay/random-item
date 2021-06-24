import React, { useState } from "react";
import { colors } from "@material-ui/core";
import ReactDOM from "react-dom";
import { RandomItem } from "./random-item";
const App: React.FC = () => {
  let [setting, setSetting] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <header
        style={{
          position: "fixed",
          top: 0,
          backgroundColor: colors.indigo[600],
          color: "white",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "3em",
        }}
        onClick={() => {
            setSetting(s => !s)
        }}
      >
        随机抽取小工具
      </header>
      <RandomItem settings={setting} />
    </div>
  );
};

ReactDOM.render(<App></App>, document.getElementById("app"));
