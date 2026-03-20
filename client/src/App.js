import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Check from "./Check";

function App() {
  return (
    <BrowserRouter>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/Check">Check</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Check" element={<Check />} />
      </Routes>

    </BrowserRouter>
  );
}


export default App;