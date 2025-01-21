import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";

function App() {
  return (
    <>
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
