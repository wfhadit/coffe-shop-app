import { routes } from "./routes/route";
import "./App.css";
import { Route, Routes } from "react-router-dom";

function App() {
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
