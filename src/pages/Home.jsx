import { useState } from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

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

    const [campaigns] = useState([
        {
            id: 1,
            name: "Amazing Gadget",
            description: "스마트 기기로 일상에 편리함을!",
            goal: 100,
            startDate: "2025-01-20",
            endDate: "2025-01-31",
        },
        {
            id: 2,
            name: "Eco-Friendly Bottle",
            description: "환경을 생각한 텀블러 프로젝트입니다.",
            goal: 200,
            startDate: "2025-02-01",
            endDate: "2025-02-15",
        },
        {
            id: 3,
            name: "Stylish Backpack",
            description: "여행/출근 모두 OK! 멋진 백팩!",
            goal: 150,
            startDate: "2025-03-01",
            endDate: "2025-03-20",
        },
    ]);

    return (
        <HomeWrapper>
            <Title>현재 진행 중인 캠페인</Title>
            <CampaignList>
                {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id}>
                        <CampaignName>{campaign.name}</CampaignName>
                        <CampaignDesc>{campaign.description}</CampaignDesc>
                        <CampaignInfo>
                            <div>목표 수량: {campaign.goal}</div>
                            <div>
                                진행 기간: {campaign.startDate} ~ {campaign.endDate}
                            </div>
                        </CampaignInfo>
                        <Button onClick={() => navigate(`/campaigns/${campaign.id}`)}>자세히 보기</Button>
                    </CampaignCard>
                ))}
            </CampaignList>
        </HomeWrapper>
    );
}

export default Home;
