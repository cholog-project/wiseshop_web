import { useEffect, useState } from 'react'
import styled from 'styled-components'
import axiosInstance from '../api/axiosInstance.js'
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
`

const Title = styled.h1`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.2rem;
  font-weight: 700;
  color: #1a1a1a;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: #002366;
    border-radius: 2px;
  }
`

const OrderList = styled.div`
  display: grid;
  gap: 1.5rem;
`

const OrderCard = styled.div`
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 35, 102, 0.1);
`

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
`

const OrderDate = styled.span`
  font-size: 0.9rem;
  color: #666666;
`

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.span`
  font-size: 0.85rem;
  color: ${(props) => props.theme.color.DARKGRAY};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Value = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${(props) => props.theme.color.DARK};
`

const ErrorWrapper = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 2rem;
  background-color: #fee2e2;
  border-radius: 12px;
  color: #dc2626;
`

const LoadingWrapper = styled.div`
  text-align: center;
  margin-top: 4rem;
  color: #002366;
  font-size: 1.1rem;
`

const EmptyState = styled.div`
  text-align: center;
  margin-top: 4rem;
  color: #666666;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
  }
`

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString.replace(' ', 'T'))
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get('/orders')
        setOrders(response.data)
        setError(null)
      } catch (err) {
        console.error('주문 목록 로드 실패:', err)
        setError('주문 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`)
  }

  if (loading) {
    return <LoadingWrapper>주문 내역을 불러오는 중입니다...</LoadingWrapper>
  }

  if (error) {
    return (
      <ErrorWrapper>
        <h3>오류 발생</h3>
        <p>{error}</p>
      </ErrorWrapper>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <Container>
        <Title>나의 주문 목록</Title>
        <EmptyState>
          <h3>주문 내역이 없습니다</h3>
          <p>첫 주문을 시작해보세요!</p>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      <Title>나의 주문 목록</Title>
      <OrderList>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            onClick={() => handleOrderClick(order.id)} // 클릭 핸들러 추가
          >
            <OrderHeader>
              <ProductName>{order.productName}</ProductName>
              <OrderDate>{formatDate(order.createdDate)}</OrderDate>
            </OrderHeader>
            <OrderDetails>
              <DetailItem>
                <Label>주문번호</Label>
                <Value>{order.id}</Value>
              </DetailItem>
              <DetailItem>
                <Label>상품번호</Label>
                <Value>{order.productId}</Value>
              </DetailItem>
              <DetailItem>
                <Label>주문 수량</Label>
                <Value>{order.count.toLocaleString()}개</Value>
              </DetailItem>
              <DetailItem>
                <Label>주문일시</Label>
                <Value>{formatDate(order.createdDate)}</Value>
              </DetailItem>
            </OrderDetails>
          </OrderCard>
        ))}
      </OrderList>
    </Container>
  )
}

export default Orders
