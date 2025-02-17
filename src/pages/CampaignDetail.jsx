import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import axiosInstance from '../api/axiosInstance.js'
import { useRecoilValue } from 'recoil'
import { userState } from '../recoil/atoms.js'
import LoadingSpinner from '../components/LoadingSpinner'
import OrderSection from './OrderSection.jsx'

const Container = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  color: #333333;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`

const Title = styled.h1`
  margin-bottom: 2.5rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
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

const Section = styled.div`
  margin-bottom: 2rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  h2 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1.2rem;
    color: #1a1a1a;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 20px;
      background: #002366;
      margin-right: 0.8rem;
      border-radius: 2px;
    }
  }
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const InfoItem = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;

  .label {
    font-size: 0.9rem;
    color: #666666;
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
  }
`

const ProductCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  cursor: pointer; // 커서 추가
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const ProductInfo = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  p {
    color: #666666;
    line-height: 1.6;
  }
`

const PriceTag = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #002366;
  margin-bottom: 1rem;
`

const ErrorMessage = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 2rem;
  background-color: #fee2e2;
  border-radius: 12px;
  color: #dc2626;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

const ViewDetailButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #002366;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #001844;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 35, 102, 0.2);
  }
`

const ProgressContainer = styled.div`
  margin-top: 0.5rem;
`

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;

  span {
    color: #666666;
  }

  strong {
    color: #002366;
  }
`

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`

const ProgressFill = styled.div`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: ${(props) => {
    const progress = props.progress
    if (progress >= 100) return '#22c55e'
    if (progress >= 75) return '#002366'
    if (progress >= 50) return '#eab308'
    return '#dc2626'
  }};
  border-radius: 4px;
  transition: width 0.3s ease;
`

const CampaignDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const user = useRecoilValue(userState)
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCampaign()
  }, [id])

  const fetchCampaign = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/campaigns/${id}`)
      setCampaign(response.data)
      setError(null)
    } catch (error) {
      console.error('캠페인 조회 실패:', error)
      setError('캠페인 정보를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const handleProductClick = () => {
    navigate(`/products/${campaign.product.id}`)
  }

  if (loading) {
    return <LoadingSpinner>캠페인 정보를 불러오는 중입니다...</LoadingSpinner>
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

  return (
    <Container>
      <Title>캠페인 상세</Title>

      <Section>
        <h2>캠페인 정보</h2>
        <InfoGrid>
          <InfoItem>
            <div className='label'>시작일</div>
            <div className='value'>{formatDateTime(campaign.startDate)}</div>
          </InfoItem>
          <InfoItem>
            <div className='label'>종료일</div>
            <div className='value'>{formatDateTime(campaign.endDate)}</div>
          </InfoItem>
          <InfoItem>
            <div className='label'>목표 수량</div>
            <div className='value'>{campaign.goalQuantity.toLocaleString()}개</div>
          </InfoItem>
          <InfoItem>
            <div className='label'>주문 수량</div>
            <div className='value'>{campaign.orderedQuantity.toLocaleString()}개</div>
          </InfoItem>
          <InfoItem>
            <div className='label'>재고 수량</div>
            <div className='value'>{campaign.stockQuantity.toLocaleString()}개</div>
          </InfoItem>
          <InfoItem style={{ gridColumn: '1 / -1' }}>
            <ProgressContainer>
              <ProgressLabel>
                <span>진행률</span>
                <strong>
                  {Math.round((campaign.orderedQuantity / campaign.goalQuantity) * 100)}%
                </strong>
              </ProgressLabel>
              <ProgressBar>
                <ProgressFill
                  progress={Math.min((campaign.orderedQuantity / campaign.goalQuantity) * 100, 100)}
                />
              </ProgressBar>
            </ProgressContainer>
          </InfoItem>
        </InfoGrid>
      </Section>

      <Section>
        <h2>상품 정보</h2>
        <ProductCard onClick={handleProductClick}>
          <ProductInfo>
            <h3>{campaign.product.name}</h3>
            <p>{campaign.product.description}</p>
          </ProductInfo>
          <PriceTag>{campaign.product.price.toLocaleString()}원</PriceTag>
        </ProductCard>
        <ViewDetailButton onClick={handleProductClick}>상품 상세 보기</ViewDetailButton>
      </Section>

      {user.isLoggedIn && <OrderSection campaign={campaign} />}
    </Container>
  )
}

export default CampaignDetail
