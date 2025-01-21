import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/*<Route path="/" element={<Home />} />*/}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
