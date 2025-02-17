// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userState } from '../recoil/atoms'
import LoadingSpinner from './LoadingSpinner'

const PrivateRoute = () => {
  const user = useRecoilValue(userState)

  if (user.isLoading) {
    return <LoadingSpinner />
  }

  if (!user.isLoggedIn) {
    return <Navigate to='/signin' />
  }

  return <Outlet />
}

export default PrivateRoute
