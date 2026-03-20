import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Check from "./Check";
import PostRequest from './PostRequest'; 
import Reviews from './Reviews'; 
import Login from "./login";
import Signup from "./signup";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Check" element={<Check />} />
        <Route path="/post-request" component={PostRequest} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;