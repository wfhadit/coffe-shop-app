import { Route, Routes } from "react-router-dom";
import "./App.css";
import { routes } from "./routes/route";

function App() {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route {...route} key={`route-${index}`} />
      ))}
    </Routes>
  );
}

export default App;
