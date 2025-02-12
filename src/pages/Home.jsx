import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";

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
  color: ${props => props.theme.color.DARK};
  
  @media (max-width: 768px) {
    font-size: 2rem;
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
  background-color: ${props => props.theme.color.WHITE};
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadow.DEFAULT};
  transition: ${props => props.theme.transition.DEFAULT};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadow.lg};
  }
`;

const CampaignContent = styled.div`
  padding: 1.5rem;
`;

const CampaignImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${props => props.theme.color.GRAY[200]};
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const CampaignName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.color.DARK};
`;

const CampaignDesc = styled.p`
  color: ${props => props.theme.color.GRAY[600]};
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
  color: ${props => props.theme.color.GRAY[500]};
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${props => props.theme.color.PRIMARY[50]};
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
  background-color: ${props => props.theme.color.PRIMARY.DEFAULT};
  color: ${props => props.theme.color.WHITE};
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${props => props.theme.transition.DEFAULT};
  
  &:hover {
    background-color: ${props => props.theme.color.PRIMARY.DARK};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const LoadingWrapper = styled.div`
  text-align: center;
  margin-top: 4rem;
  color: ${props => props.theme.color.PRIMARY.DEFAULT};
  font-size: 1.1rem;
`;

const ErrorWrapper = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 2rem;
  background-color: #FEE2E2;
  border-radius: 0.5rem;
  color: #DC2626;
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
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axiosInstance.get("/campaigns");
                setCampaigns(response.data.responses);
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
            <Title>현재 진행 중인 캠페인</Title>
            <CampaignList>
                {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.campaignId}>
                        <CampaignImage image={campaign.product.imageUrl} />
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
                            </CampaignInfo>
                            <Button onClick={() => navigate(`/campaigns/${campaign.campaignId}`)}>
                                자세히 보기
                            </Button>
                        </CampaignContent>
                    </CampaignCard>
                ))}
            </CampaignList>
        </HomeWrapper>
    );
}

export default Home;
