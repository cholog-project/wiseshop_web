import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { RecoilRoot } from "recoil";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import CampaignCreate from "./pages/CampaignCreate.jsx";
import CampaignDetail from "./pages/CampaignDetail.jsx";
import Orders from "./pages/Orders.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";

function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/campaigns/create" element={<CampaignCreate />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/success" element={<PaymentSuccess />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  )
}

export default App;
