import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import noImage from "../assets/no-image.jpg";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms.js";

const HomeWrapper = styled.div`
    max-width: 1280px;
    margin: 3rem auto;
    padding: 0 1.5rem;
`;

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
`;

const TitleSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 3rem;
    position: relative;
    
    @media (max-width: 768px) {
        margin-bottom: 2rem;
    }
`;

const CampaignList = styled.div`
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    
    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`;

const CampaignCard = styled.article`
    background-color: #ffffff;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
`;

const CampaignContent = styled.div`
    padding: 1.5rem;
`;

const CampaignImage = styled.div`
    width: 100%;
    height: 200px;
    background-color: #f3f4f6;
    background-image: ${props => props.image ? `url(${props.image})` : 'none'};
    background-size: cover;
    background-position: center;
`;

const CampaignName = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #1a1a1a;
`;

const CampaignDesc = styled.p`
    color: #666666;
    font-size: 0.975rem;
    margin-bottom: 1.5rem;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

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
`;

const InfoItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Button = styled.button`
    width: 100%;
    padding: 0.75rem 1.5rem;
    background-color: #002366;
    color: #ffffff;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #001844;
    }
    
    &:active {
        transform: scale(0.98);
    }
`;

const LoadingWrapper = styled.div`
    text-align: center;
    margin-top: 4rem;
    color: #002366;
    font-size: 1.1rem;
`;

const ErrorWrapper = styled.div`
    text-align: center;
    margin-top: 4rem;
    padding: 2rem;
    background-color: #fee2e2;
    border-radius: 0.5rem;
    color: #dc2626;
`;

const NoCampaignWrapper = styled.div`
    text-align: center;
    padding: 4rem 2rem;
    background-color: #f8f9fa;
    border-radius: 1rem;
    margin-top: 2rem;
`;

const NoCampaignIcon = styled.div`
    font-size: 3rem;
    margin-bottom: 1.5rem;
    color: #9ca3af;
`;

const NoCampaignTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 1rem;
`;

const NoCampaignText = styled.p`
    color: #6b7280;
    font-size: 1.1rem;
    line-height: 1.6;
`;

const DeleteAccountSection = styled.div`
    margin-top: 4rem;
    padding: 2rem;
    border-top: 1px solid #e5e7eb;
    text-align: center;
`;

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
`;

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
`;

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #dc2626;
`;

const ModalText = styled.p`
    color: #666666;
    margin-bottom: 1.5rem;
    line-height: 1.6;
`;

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
`;

const ProgressContainer = styled.div`
    margin-top: 0.5rem;
`;

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
`;

const ProgressBar = styled.div`
    width: 100%;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
`;

const ProgressFill = styled.div`
    width: ${props => props.progress}%;
    height: 100%;
    background-color: ${props => {
        const progress = props.progress;
        if (progress >= 100) return '#22c55e';
        if (progress >= 75) return '#002366';
        if (progress >= 50) return '#eab308';
        return '#dc2626';
    }};
    border-radius: 4px;
    transition: width 0.3s ease;
`;

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
`;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const Home = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchCampaigns = async () => {
          try {
              const response = await axiosInstance.get("/campaigns");
              setCampaigns(response.data);
              setError(null);
          } catch (error) {
              console.error("캠페인 데이터 로드 실패:", error);
              setError("캠페인 정보를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
          } finally {
              setLoading(false);
          }
      };

      fetchCampaigns();
  }, []);

  const handleDeleteAccount = async () => {
    try {
        await axiosInstance.delete('/members');
        alert('회원 탈퇴가 완료되었습니다.');
        window.location.href = '/'; // 페이지 새로고침
    } catch (error) {
        console.error("회원 탈퇴 실패:", error);
        alert(`회원 탈퇴에 실패했습니다: ${error.response?.data?.message || error.message}`);
    } finally {
        setShowDeleteModal(false);
    }
};

  if (loading) {
      return (
          <LoadingWrapper>
              <div>캠페인 정보를 불러오는 중입니다...</div>
          </LoadingWrapper>
      );
  }

  if (error) {
      return (
          <ErrorWrapper>
              <h2>오류 발생</h2>
              <p>{error}</p>
          </ErrorWrapper>
      );
  }

  return (
      <HomeWrapper>
          <TitleSection>
            <Title>현재 진행 중인 캠페인</Title>
        </TitleSection>
          {campaigns.length > 0 ? (
              <CampaignList>
                  {campaigns.map((campaign) => (
                      <CampaignCard key={campaign.campaignId}>
                          <CampaignImage image={campaign.product.imageUrl || noImage } />
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
                                                  100
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
                  <NoCampaignTitle>진행 중인 캠페인이 없습니다</NoCampaignTitle>
                  <NoCampaignText>
                      현재 진행 중인 캠페인이 없습니다.<br />
                      새로운 캠페인이 시작되면 이곳에서 확인하실 수 있습니다.
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
                            정말로 탈퇴하시겠습니까?<br />
                            모든 회원 정보가 삭제되며 이 작업은 되돌릴 수 없습니다.
                        </ModalText>
                        <ModalButtons>
                            <button 
                                className="cancel" 
                                onClick={() => setShowDeleteModal(false)}
                            >
                                취소
                            </button>
                            <button 
                                className="delete" 
                                onClick={handleDeleteAccount}
                            >
                                탈퇴하기
                            </button>
                        </ModalButtons>
                    </ModalContent>
                </Modal>
            )}
      </HomeWrapper>
  );
}

export default Home;