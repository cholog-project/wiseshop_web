// pages/PaymentSuccess.jsx
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import styled from 'styled-components'

const SuccessContainer = styled.div`
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  text-align: center;
`

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey')
      const orderId = searchParams.get('orderId')
      const amount = searchParams.get('amount')

      try {
        await axiosInstance.post('/payments/confirm', {
          paymentKey: paymentKey,
          orderId: orderId,
          amount: parseInt(amount),
        })

        alert('결제가 완료되었습니다.')
        navigate('/orders')
      } catch (error) {
        console.error('결제 승인 실패:', error)
        alert('결제 승인에 실패했습니다.')
        navigate('/')
      }
    }

    confirmPayment()
  }, [navigate, searchParams])

  return (
    <SuccessContainer>
      <h2>결제를 처리중입니다...</h2>
    </SuccessContainer>
  )
}

export default PaymentSuccess
