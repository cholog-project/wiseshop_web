import {useEffect, useState} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";

const HomeWrapper = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const CampaignList = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;

const CampaignCard = styled.div`
  background-color: ${(props) => props.theme.color.WHITE};
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CampaignName = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const CampaignDesc = styled.p`
  margin-bottom: 1rem;
  color: ${(props) => props.theme.color.DARKGRAY};
  font-size: 0.95rem;
`;

const CampaignInfo = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.color.DEEP_DARKGRAY};
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.color.PRIMARY};
  color: ${(props) => props.theme.color.WHITE};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
      ${(props) => props.theme.color.DEEP_BLUE};
  }
`;

const Home = () => {
    const navigate = useNavigate();

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axiosInstance.get("/campaigns");
                setCampaigns(response.data);
                setError(null);
            }  catch (error) {
                console.log("캠페인 데이터 로드 실패:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "2rem" }}>로딩 중...</div>;
    }

    if (error) {
        return <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>에러 발생</div>;
    }

    return (
        <HomeWrapper>
            <Title>현재 진행 중인 캠페인</Title>
            <CampaignList>
                {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.campaignId}>
                        <CampaignName>{campaign.productName}</CampaignName>
                        <CampaignDesc>{campaign.productDescription}</CampaignDesc>
                        <CampaignInfo>
                            <div>목표 수량: {campaign.goalQuantity}</div>
                            <div>
                                진행 기간: {campaign.startDate} ~ {campaign.endDate}
                            </div>
                        </CampaignInfo>
                        <Button onClick={() => navigate(`/campaigns/${campaign.campaignId}`)}>자세히 보기</Button>
                    </CampaignCard>
                ))}
            </CampaignList>
        </HomeWrapper>
    );
}

export default Home;
