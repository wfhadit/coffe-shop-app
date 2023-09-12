import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/landingPage";
import { Navbar } from "./components/navbar";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  return (
    <>
      <Navbar search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/landingpage" element={<LandingPage search={search} />} />
        <Route path="*" element={<Navigate to={"/landingpage"} />} />
      </Routes>
    </>
  );
}

export default App;
