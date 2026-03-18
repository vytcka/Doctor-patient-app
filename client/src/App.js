import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Check from "./Check";
import Signup from "./signup";
import Login from "./login";

function App() {
  return (
    <BrowserRouter>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/Check">Check</Link>
        <Link to="/Signup">Sign Up</Link>
        <Link to="/Login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Check" element={<Check />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;