import "./App.css";
import Home from "./Pages/Home";
import Singlesheet from "./Pages/Singlesheet";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Singlesheet />} path="/spreadsheet/:docname/:id" />
        <Route element={"Sorry this route does not exist"} path="*" />
      </Routes>
    </>
  );
}

export default App;
