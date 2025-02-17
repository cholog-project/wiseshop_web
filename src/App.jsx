import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import CampaignCreate from './pages/CampaignCreate.jsx'
import CampaignDetail from './pages/CampaignDetail.jsx'
import Orders from './pages/Orders.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'
import ShippingAddressForm from './pages/CreateAddress.jsx'
import ShippingAddressList from './pages/ShippingAdressList.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import AuthWrapper from './components/AuthWrapper.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import OrderDetail from './pages/OrderDetail.jsx'
import MyPage from './pages/MyPage.jsx'

function App() {
  return (
    <RecoilRoot>
      <AuthWrapper>
        <BrowserRouter>
          <NavBar />
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/campaigns/:id' element={<CampaignDetail />} />
            <Route path='/products/:id' element={<ProductDetail />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path='/campaigns/create' element={<CampaignCreate />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/success' element={<PaymentSuccess />} />
              <Route path='/address' element={<ShippingAddressList />} />
              <Route path='/address/create' element={<ShippingAddressForm />} />
              <Route path='/orders/:id' element={<OrderDetail />} />
              <Route path='/mypage' element={<MyPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthWrapper>
    </RecoilRoot>
  )
}

export default App
