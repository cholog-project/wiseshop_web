import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import CampaignCreate from "./pages/CampaignCreate.jsx";
import CampaignDetail from "./pages/CampaignDetail.jsx";
import Orders from "./pages/Orders.jsx";

function App() {
  return (
    <>
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/campaigns/create" element={<CampaignCreate />} />
                <Route path="/campaigns/:id" element={<CampaignDetail />} />
                <Route path="/orders" element={<Orders />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
