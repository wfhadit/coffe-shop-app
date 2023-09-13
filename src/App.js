import { routes } from "./routes/route";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  return (
    <>
      <Routes>
        {routes.map((route, index) => (
          <Route {...route} key={`route-${index}`} />
        ))}
      </Routes>
    </>
  );
}

export default App;
