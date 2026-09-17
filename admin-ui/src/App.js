import React, { Suspense } from "react";

// ** Router Import
import Router from "./router/Router";
import { initWebSocket } from "./socket";

const App = () => {
  if (localStorage.getItem("access")) {
    console.log("app socket")
    initWebSocket(true);
  }
  return (
        <Suspense fallback={null}>
          <Router />
        </Suspense>
  );
};

export default App;