import { routes } from "./routes/route";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";

function App() {
  const [search, setSearch] = useState("");
  return (
    <>
      <Navbar />
      <Routes>
        {routes.map((route, index) => (
          <Route {...route} key={`route-${index}`} />
        ))}
      </Routes>
    </>
  );
}

export default App;
