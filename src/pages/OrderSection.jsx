import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import axiosInstance from '../api/axiosInstance'
import PropTypes from 'prop-types'
import { clearTossPayments, loadTossPayments } from '@tosspayments/tosspayments-sdk'
import { useRecoilValue } from 'recoil'
import { userState } from '../recoil/atoms'

const Section = styled.div`
  margin-bottom: 2rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const OrderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`

const OrderInput = styled.input`
  width: 100px;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #002366;
    box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const OrderButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background-color: #002366;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #001844;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 35, 102, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`

const TotalPrice = styled.div`
  text-align: right;
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #002366;
`

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border-radius: 8px;
`

const AddressSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #002366;
    box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1);
  }
`

const PaymentButton = styled.button`
  width: 100%;
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #002366;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #001844;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 35, 102, 0.2);
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`
const PaymentModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const PaymentModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`

const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'

const OrderSection = ({ campaign }) => {
  const navigate = useNavigate()
  const user = useRecoilValue(userState)
  const [orderCount, setOrderCount] = useState(1)
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [addresses, setAddresses] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const tossPaymentsRef = useRef(null)
  const widgetsRef = useRef(null)

  useEffect(() => {
    fetchAddresses()
  }, [])
  const initTossPayments = async () => {
    try {
      clearTossPayments()
      const tossPayments = await loadTossPayments(clientKey)
      tossPaymentsRef.current = tossPayments
      const customerKey = `wise-user-${user.id}`
      console.log(`customerKey : ${customerKey}`)
      const widgets = tossPayments.widgets({
        customerKey,
      })
      await widgets.setAmount({
        currency: 'KRW',
        value: 50000,
      })
      widgetsRef.current = widgets
    } catch (error) {
      console.error('토스페이먼츠 초기화 실패:', error)
      setError('결제 시스템을 불러오는데 실패했습니다.')
    }
  }

  useEffect(() => {
    initTossPayments()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get('/address')
      setAddresses(response.data)
      if (response.data.length > 0) {
        setSelectedAddressId(response.data[0].id)
      }
    } catch (error) {
      console.error('배송지 목록 조회 실패:', error)
      setError('배송지 정보를 불러오는데 실패했습니다.')
    }
  }

  const handleCountChange = (e) => {
    const value = parseInt(e.target.value) || 1
    setOrderCount(Math.max(1, value))
  }

  // handleOrder 함수 수정
  const handleOrder = async () => {
    if (!selectedAddressId) {
      setError('배송지를 선택해주세요.')
      return
    }

    if (!tossPaymentsRef.current) {
      setError('결제 시스템이 초기화되지 않았습니다.')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      // 모달 표시
      setShowPaymentModal(true)

      const widgets = widgetsRef.current
      await widgets.setAmount({
        currency: 'KRW',
        value: orderCount * campaign.product.price,
      })

      await Promise.all([
        widgets.renderPaymentMethods({
          selector: '#payment-method-modal',
          variantKey: 'DEFAULT',
        }),
        widgets.renderAgreement({
          selector: '#agreement-modal',
          variantKey: 'AGREEMENT',
        }),
      ])
    } catch (error) {
      console.error('주문/결제 초기화 실패:', error)
      setError(error.response?.data?.message || '주문 초기화에 실패했습니다.')
      setShowPaymentModal(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    let orderId
    try {
      const orderData = {
        count: orderCount,
        productId: campaign.product.id,
        addressId: selectedAddressId,
        orderQuantity: orderCount,
      }
      const response = await axiosInstance.post('/orders', orderData)
      orderId = response.data
      const paymentOrderId = `wise-${orderId}-${nanoid()}`
      console.log(paymentOrderId)

      await widgetsRef.current.requestPayment({
        orderId: paymentOrderId,
        orderName: `${campaign.product.name} ${orderCount}개`,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        customerEmail: `${user.email}`,
        customerName: `${user.name}`,
      })
    } catch (error) {
      await axiosInstance.delete(`/orders/${orderId}`)
      console.error('결제 요청 실패:', error)
      setError('결제 요청에 실패했습니다.')
    }
  }

  const handleCloseModal = () => {
    setShowPaymentModal(false)
    initTossPayments()
  }

  if (addresses.length === 0) {
    return (
      <Section>
        <ErrorMessage>배송지 정보가 없습니다. 배송지를 먼저 등록해주세요.</ErrorMessage>
        <OrderButton onClick={() => navigate('/address/create')}>배송지 등록하기</OrderButton>
      </Section>
    )
  }
  return (
    <Section>
      <AddressSelect
        value={selectedAddressId}
        onChange={(e) => setSelectedAddressId(e.target.value)}
      >
        {addresses.map((address) => (
          <option key={address.id} value={address.id}>
            {address.roadAddress} {address.detailAddress}
          </option>
        ))}
      </AddressSelect>

      <OrderControls>
        <OrderInput
          type='number'
          min='1'
          value={orderCount}
          onChange={handleCountChange}
          disabled={isLoading}
        />
        <OrderButton onClick={handleOrder} disabled={isLoading}>
          {isLoading ? '처리중...' : '주문하기'}
        </OrderButton>
      </OrderControls>

      <TotalPrice>총 금액: {(orderCount * campaign.product.price).toLocaleString()}원</TotalPrice>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {showPaymentModal && (
        <PaymentModal>
          <PaymentModalContent>
            <h2>결제하기</h2>
            <div id='payment-method-modal'></div>
            <div id='agreement-modal'></div>
            <PaymentButton onClick={handlePayment} disabled={isLoading}>
              결제 진행하기
            </PaymentButton>
            <OrderButton onClick={handleCloseModal} style={{ marginTop: '1rem' }}>
              취소
            </OrderButton>
          </PaymentModalContent>
        </PaymentModal>
      )}
    </Section>
  )
}

OrderSection.propTypes = {
  campaign: PropTypes.shape({
    product: PropTypes.shape({
      id: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default OrderSection
