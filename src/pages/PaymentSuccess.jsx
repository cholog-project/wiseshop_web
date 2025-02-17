import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { orderDataState } from '../recoil/atoms'
import axiosInstance from '../api/axiosInstance.js'

export function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderData = useRecoilValue(orderDataState)
  const setOrderData = useSetRecoilState(orderDataState)
  const isProcessing = useRef(false)

  useEffect(() => {
    const processPayment = async () => {
      if (!orderData || isProcessing.current) {
        return
      }

      try {
        isProcessing.current = true
        const requestData = {
          paymentOrderId: searchParams.get('orderId'),
          amount: searchParams.get('amount'),
          paymentKey: searchParams.get('paymentKey'),
          productId: orderData.productId,
          orderQuantity: orderData.orderQuantity,
        }

        await axiosInstance.post('/orders', requestData)
        setOrderData(null)
        navigate('/orders')
      } catch (error) {
        navigate(
          `/fail?message=${error.response?.data?.message || '결제 실패'}&code=${error.response?.data?.code || 'unknown'}`,
        )
      } finally {
        isProcessing.current = false
      }
    }

    processPayment()
  }, [navigate, searchParams, setOrderData]) // orderData 제거

  if (!orderData) {
    return (
      <div className='result wrapper'>
        <div className='box_section'>
          <h2>주문 정보를 불러오는 중...</h2>
          <p>잠시만 기다려주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='result wrapper'>
      <div className='box_section'>
        <h2>결제 확인 중...</h2>
        <p>결제 정보를 확인하고 있습니다. 잠시만 기다려주세요.</p>
      </div>
    </div>
  )
}

export default PaymentSuccess
