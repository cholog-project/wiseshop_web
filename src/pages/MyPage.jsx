import { useRecoilValue } from 'recoil'
import { userState } from '../recoil/atoms'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'

const Container = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 16px;
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
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const SectionTitle = styled.h2`
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
`

const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
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

const LinkButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #002366;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #001844;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 35, 102, 0.2);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`

const CampaignList = styled.div`
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
`

const LoadingCard = styled.div`
  height: 120px;
  background: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 1rem;

  @keyframes shimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }

  background: linear-gradient(to right, #f0f0f0 8%, #f8f8f8 18%, #f0f0f0 33%);
  background-size: 800px 104px;
  animation: shimmer 1.5s infinite linear;
`

const CampaignCard = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const CampaignHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const CampaignStatus = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  background-color: ${(props) => {
    switch (props.status) {
      case 'WAITING':
        return '#6366f1'
      case 'IN_PROGRESS':
        return '#22c55e'
      case 'SUCCESS':
        return '#002366'
      case 'FAILED':
        return '#dc2626'
      default:
        return '#6b7280'
    }
  }};
`

const CampaignInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666666;

  .label {
    margin-bottom: 0.25rem;
  }

  .value {
    font-weight: 600;
    color: #1a1a1a;
  }
`

const ProductInfo = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  .name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
  }

  .description {
    color: #666666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .price {
    color: #002366;
    font-weight: 600;
  }
`

const MyPage = () => {
  const user = useRecoilValue(userState)
  const navigate = useNavigate()
  const [myCampaigns, setMyCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      try {
        const response = await axiosInstance.get('/campaigns/members')
        setMyCampaigns(response.data)
      } catch (error) {
        console.error('캠페인 목록 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyCampaigns()
  }, [])

  const getStatusText = (status) => {
    switch (status) {
      case 'WAITING':
        return '대기중'
      case 'IN_PROGRESS':
        return '진행중'
      case 'SUCCESS':
        return '달성완료'
      case 'FAILED':
        return '미달성'
      default:
        return '알 수 없음'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Container>
      <Title>내 정보</Title>

      <Section>
        <SectionTitle>기본 정보</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <div className='label'>이름</div>
            <div className='value'>{user.name}</div>
          </InfoItem>
          <InfoItem>
            <div className='label'>이메일</div>
            <div className='value'>{user.email}</div>
          </InfoItem>
        </InfoGrid>
      </Section>

      <Section>
        <SectionTitle>주문 관리</SectionTitle>
        <ButtonGroup>
          <LinkButton to='/orders'>주문 내역 보기</LinkButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>배송지 관리</SectionTitle>
        <ButtonGroup>
          <LinkButton to='/address'>배송지 목록</LinkButton>
          <LinkButton to='/address/create'>새 배송지 추가</LinkButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>내가 만든 캠페인</SectionTitle>
        <CampaignList>
          {loading ? (
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
          ) : myCampaigns.length > 0 ? (
            myCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.campaignId}
                onClick={() => navigate(`/campaigns/${campaign.campaignId}`)}
              >
                <CampaignHeader>
                  <CampaignStatus status={campaign.state}>
                    {getStatusText(campaign.state)}
                  </CampaignStatus>
                </CampaignHeader>

                <ProductInfo>
                  <div className='name'>{campaign.product.name}</div>
                  <div className='description'>{campaign.product.description}</div>
                  <div className='price'>{campaign.product.price.toLocaleString()}원</div>
                </ProductInfo>

                <CampaignInfo>
                  <div>
                    <div className='label'>목표 수량</div>
                    <div className='value'>{campaign.goalQuantity.toLocaleString()}개</div>
                  </div>
                  <div>
                    <div className='label'>주문 수량</div>
                    <div className='value'>{campaign.orderedQuantity.toLocaleString()}개</div>
                  </div>
                  <div>
                    <div className='label'>재고 수량</div>
                    <div className='value'>{campaign.product.totalQuantity.toLocaleString()}개</div>
                  </div>
                </CampaignInfo>

                <CampaignInfo>
                  <div>
                    <div className='label'>시작일</div>
                    <div className='value'>{formatDate(campaign.startDate)}</div>
                  </div>
                  <div>
                    <div className='label'>종료일</div>
                    <div className='value'>{formatDate(campaign.endDate)}</div>
                  </div>
                </CampaignInfo>
              </CampaignCard>
            ))
          ) : (
            <InfoItem>
              <div className='label'>등록된 캠페인이 없습니다</div>
              <div className='value'>새로운 캠페인을 만들어보세요!</div>
            </InfoItem>
          )}
        </CampaignList>
        <ButtonGroup>
          <LinkButton to='/campaigns/create'>새 캠페인 만들기</LinkButton>
        </ButtonGroup>
      </Section>
    </Container>
  )
}

export default MyPage
