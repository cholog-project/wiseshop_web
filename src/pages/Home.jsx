import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance.js'
import noImage from '../assets/no-image.jpg'
import { useRecoilValue } from 'recoil'
import { userState } from '../recoil/atoms.js'

const HomeWrapper = styled.div`
  max-width: 1280px;
  margin: 3rem auto;
  padding: 0 1.5rem;
`

const Title = styled.h1`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`

const TitleSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`

const CampaignList = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const CampaignCard = styled.article`
  background-color: #ffffff;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  }
`

const CampaignContent = styled.div`
  padding: 1.75rem;
`

const CampaignImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f3f4f6;
  background-image: ${(props) => (props.image ? `url(${props.image})` : 'none')};
  background-size: cover;
  background-position: center;
`

const CampaignName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
`

const CampaignDesc = styled.p`
  color: #666666;
  font-size: 0.975rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const CampaignInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #666666;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9ff;
  border-radius: 0.5rem;
`

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Button = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #002366, #001844);
  color: #ffffff;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 35, 102, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 35, 102, 0.3);
    background: linear-gradient(135deg, #001844, #001233);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 35, 102, 0.2);
  }
`

const LoadingWrapper = styled.div`
  text-align: center;
  margin-top: 4rem;
  color: #002366;
  font-size: 1.1rem;
`

const ErrorWrapper = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 2rem;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  color: #dc2626;
`

const NoCampaignWrapper = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: #f8f9fa;
  border-radius: 1rem;
  margin-top: 2rem;
`

const NoCampaignIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #9ca3af;
`

const NoCampaignTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 1rem;
`

const NoCampaignText = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  line-height: 1.6;
`

const DeleteAccountSection = styled.div`
  margin-top: 4rem;
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
`

const DeleteAccountButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #b91c1c;
  }
`

const Modal = styled.div`
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

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #dc2626;
`

const ModalText = styled.p`
  color: #666666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;

  button {
    flex: 1;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;

    &.cancel {
      background-color: #e5e7eb;
      color: #4b5563;
      border: none;

      &:hover {
        background-color: #d1d5db;
      }
    }

    &.delete {
      background-color: #dc2626;
      color: white;
      border: none;

      &:hover {
        background-color: #b91c1c;
      }
    }
  }
`

const ProgressContainer = styled.div`
  margin-top: 0.5rem;
`

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
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
  height: 10px;
  background-color: #f3f4f6;
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`

const CreateCampaignButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  background-color: #002366;
  color: white;
  border: none;
  border-radius: 3rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 35, 102, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;

  &:hover {
    background-color: #001844;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 35, 102, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    bottom: 1.5rem;
    right: 1.5rem;
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
`
const StatusBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1.25rem;
  border-radius: 2.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background-color: ${(props) => {
    switch (props.state) {
      case 'WAITING':
        return '#6366f1' // 인디고
      case 'IN_PROGRESS':
        return '#22c55e' // 초록
      case 'SUCCESS':
        return '#002366' // 네이비
      case 'FAILED':
        return '#dc2626' // 빨강
      default:
        return '#6b7280' // 회색
    }
  }};
  box-shadow: 0 2px 8px
    ${(props) => {
      switch (props.state) {
        case 'WAITING':
          return 'rgba(99, 102, 241, 0.3)'
        case 'IN_PROGRESS':
          return 'rgba(34, 197, 94, 0.3)'
        case 'SUCCESS':
          return 'rgba(0, 35, 102, 0.3)'
        case 'FAILED':
          return 'rgba(220, 38, 38, 0.3)'
        default:
          return 'rgba(107, 114, 128, 0.3)'
      }
    }};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px
      ${(props) => {
        switch (props.state) {
          case 'WAITING':
            return 'rgba(99, 102, 241, 0.4)'
          case 'IN_PROGRESS':
            return 'rgba(34, 197, 94, 0.4)'
          case 'SUCCESS':
            return 'rgba(0, 35, 102, 0.4)'
          case 'FAILED':
            return 'rgba(220, 38, 38, 0.4)'
          default:
            return 'rgba(107, 114, 128, 0.4)'
        }
      }};
  }
`

const ProgressFill = styled.div`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: ${(props) => {
    const progress = props.progress
    if (progress >= 100) return '#22c55e' // SUCCESS 상태와 동일한 초록색
    if (progress >= 75) return '#002366' // IN_PROGRESS 상태와 동일한 네이비
    if (progress >= 50) return '#6366f1' // WAITING 상태와 동일한 인디고
    return '#dc2626' // FAILED 상태와 동일한 빨강
  }};
  border-radius: 4px;
  transition: width 0.3s ease;
`

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${(props) => (props.active ? 'rgba(0, 35, 102, 0.05)' : 'none')};
  font-size: 1rem;
  font-weight: ${(props) => (props.active ? '600' : '400')};
  color: ${(props) => (props.active ? '#002366' : '#666666')};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-radius: 0.5rem;

  &::after {
    content: '';
    bottom: -0.5rem;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${(props) => (props.active ? '#002366' : 'transparent')};
    transition: all 0.3s ease;
  }

  &:hover {
    color: #002366;
    background-color: rgba(0, 35, 102, 0.05);
  }
`

const TabCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.625rem;
  margin-left: 0.625rem;
  background-color: ${(props) => {
    if (!props.active) return '#e5e7eb'
    switch (props.state) {
      case 'WAITING':
        return '#6366f1'
      case 'IN_PROGRESS':
        return '#22c55e'
      case 'SUCCESS':
        return '#002366'
      case 'FAILED':
        return '#dc2626'
      default:
        return '#002366'
    }
  }};
  color: white;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: ${(props) => (props.active ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none')};
  transition: all 0.3s ease;
`

// 상태 텍스트 매핑
const getStatusText = (state) => {
  switch (state) {
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

const TabList = styled.div`
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 0.5rem;
  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`

const TabContainer = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  border-bottom: 2px solid #e5e7eb;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.02));
  padding: 0.5rem;
  border-radius: 0.75rem;
`

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const Home = () => {
  const navigate = useNavigate()
  const user = useRecoilValue(userState)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('ALL')
  const tabs = [
    { id: 'ALL', label: '전체' },
    { id: 'WAITING', label: '대기중' },
    { id: 'IN_PROGRESS', label: '진행중' },
    { id: 'SUCCESS', label: '달성완료' },
    { id: 'FAILED', label: '미달성' },
  ]
  const filteredCampaigns = campaigns.filter(
    (campaign) => activeTab === 'ALL' || campaign.state === activeTab,
  )

  // 각 상태별 캠페인 수 계산
  const getCampaignCount = (state) => {
    if (state === 'ALL') return campaigns.length
    return campaigns.filter((campaign) => campaign.state === state).length
  }

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axiosInstance.get('/campaigns')
        setCampaigns(response.data)
        setError(null)
      } catch (error) {
        console.error('캠페인 데이터 로드 실패:', error)
        setError('캠페인 정보를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete('/members')
      alert('회원 탈퇴가 완료되었습니다.')
      window.location.href = '/' // 페이지 새로고침
    } catch (error) {
      console.error('회원 탈퇴 실패:', error)
      alert(`회원 탈퇴에 실패했습니다: ${error?.data?.message || error.message}`)
    } finally {
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <LoadingWrapper>
        <div>캠페인 정보를 불러오는 중입니다...</div>
      </LoadingWrapper>
    )
  }

  if (error) {
    return (
      <ErrorWrapper>
        <h2>오류 발생</h2>
        <p>{error}</p>
      </ErrorWrapper>
    )
  }

  return (
    <HomeWrapper>
      <TitleSection>
        <Title>현재 진행 중인 캠페인</Title>
      </TitleSection>

      <TabContainer>
        <TabList>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <TabCount active={activeTab === tab.id}>{getCampaignCount(tab.id)}</TabCount>
            </TabButton>
          ))}
        </TabList>
      </TabContainer>
      {filteredCampaigns.length > 0 ? (
        <CampaignList>
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.campaignId}>
              <StatusBadge state={campaign.state}>{getStatusText(campaign.state)}</StatusBadge>
              <CampaignImage image={campaign.product.imageUrl || noImage} />
              <CampaignContent>
                <CampaignName>{campaign.product.name}</CampaignName>
                <CampaignDesc>{campaign.product.description}</CampaignDesc>
                <CampaignInfo>
                  <InfoItem>
                    <span>목표 수량</span>
                    <strong>{campaign.goalQuantity.toLocaleString()}개</strong>
                  </InfoItem>
                  <InfoItem>
                    <span>진행 기간</span>
                    <span>
                      {formatDate(campaign.startDate)} ~ {formatDate(campaign.endDate)}
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <span>재고 수량</span>
                    <strong>{campaign.stockQuantity.toLocaleString()}개</strong>
                  </InfoItem>
                  <ProgressContainer>
                    <ProgressLabel>
                      <span>진행률</span>
                      <strong>
                        {Math.round((campaign.orderedQuantity / campaign.goalQuantity) * 100)}%
                      </strong>
                    </ProgressLabel>
                    <ProgressBar>
                      <ProgressFill
                        progress={Math.min(
                          (campaign.orderedQuantity / campaign.goalQuantity) * 100,
                          100,
                        )}
                      />
                    </ProgressBar>
                  </ProgressContainer>
                </CampaignInfo>
                <Button onClick={() => navigate(`/campaigns/${campaign.campaignId}`)}>
                  자세히 보기
                </Button>
              </CampaignContent>
            </CampaignCard>
          ))}
        </CampaignList>
      ) : (
        <NoCampaignWrapper>
          <NoCampaignIcon>📦</NoCampaignIcon>
          <NoCampaignTitle>
            {activeTab === 'ALL'
              ? '진행 중인 캠페인이 없습니다'
              : `${tabs.find((tab) => tab.id === activeTab).label} 상태의 캠페인이 없습니다`}
          </NoCampaignTitle>
          <NoCampaignText>
            {activeTab === 'ALL'
              ? '새로운 캠페인이 시작되면 이곳에서 확인하실 수 있습니다.'
              : '다른 상태의 캠페인을 확인해보세요.'}
          </NoCampaignText>
        </NoCampaignWrapper>
      )}
      {user.isLoggedIn && (
        <CreateCampaignButton onClick={() => navigate('/campaigns/create')}>
          ✨ 새 캠페인 만들기
        </CreateCampaignButton>
      )}

      {/* 회원 탈퇴 섹션 */}
      {user.isLoggedIn && (
        <DeleteAccountSection>
          <DeleteAccountButton onClick={() => setShowDeleteModal(true)}>
            회원 탈퇴
          </DeleteAccountButton>
        </DeleteAccountSection>
      )}

      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>회원 탈퇴</ModalTitle>
            <ModalText>
              정말로 탈퇴하시겠습니까?
              <br />
              모든 회원 정보가 삭제되며 이 작업은 되돌릴 수 없습니다.
            </ModalText>
            <ModalButtons>
              <button className='cancel' onClick={() => setShowDeleteModal(false)}>
                취소
              </button>
              <button className='delete' onClick={handleDeleteAccount}>
                탈퇴하기
              </button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </HomeWrapper>
  )
}

export default Home
