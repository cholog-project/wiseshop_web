import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1.5rem;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  h2 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  p {
    margin-bottom: 0.3rem;
  }
`;

const OrderWrapper = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fafafa;
`;

const OrderLabel = styled.label`
  display: inline-block;
  margin-right: 0.5rem;
  font-weight: 600;
`;

const OrderInput = styled.input`
  width: 60px;
  padding: 0.25rem;
  margin-right: 1rem;
`;

const OrderButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.color.PRIMARY};
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #001844;
  }
`;

const CampaignDetail = () => {
    const { id } = useParams();

    // 실제로는 여기서 axios.get(`/campaigns/${id}`) 등을 통해 데이터를 가져옵니다.
    // 지금은 Mock 데이터를 useState로 관리
    const [campaign, setCampaign] = useState(null);
    const [orderCount, setOrderCount] = useState(1);

    useEffect(() => {
        // Mock: 실제 API 연동 대신, setCampaign에 하드코딩된 값 대입
        // id에 따라 분기할 수도 있음
        const mockData = {
            id,
            startDate: "2025-01-20",
            endDate: "2025-01-31",
            goalQuantity: 100,
            soldQuantity: 40,
            product: {
                name: "Amazing Gadget",
                description: "스마트 기기로 일상에 편리함을!",
                price: 29900,
            },
            stock: {
                totalQuantity: 80,  // 남은 재고나 총 재고를 표시
            },
        };

        setCampaign(mockData);
    }, [id]);

    // 주문하기 버튼
    const handleOrder = () => {
        // 추후 axios.post("/orders", {...}) 등을 통해 실제 주문 처리
        console.log("주문 요청:", {
            productId: campaign?.id, // 실제론 productId 별도 관리
            quantity: orderCount,
        });
        alert(`(Mock) ${orderCount}개 주문 신청했습니다!`);
    };

    if (!campaign) {
        return <div style={{ textAlign: "center", marginTop: "2rem" }}>로딩중...</div>;
    }

    return (
        <Container>
            <Title>캠페인 상세 (ID: {campaign.id})</Title>

            <Section>
                <h2>캠페인 정보</h2>
                <p>시작일: {campaign.startDate}</p>
                <p>종료일: {campaign.endDate}</p>
                <p>목표 수량: {campaign.goalQuantity}</p>
                <p>판매(펀딩)된 수량: {campaign.soldQuantity}</p>
            </Section>

            <Section>
                <h2>상품 정보</h2>
                <p>상품명: {campaign.product.name}</p>
                <p>상품설명: {campaign.product.description}</p>
                <p>가격: {campaign.product.price}원</p>
            </Section>

            <Section>
                <h2>재고 정보</h2>
                <p>총 재고: {campaign.stock.totalQuantity}</p>
            </Section>

            <OrderWrapper>
                <OrderLabel>주문 수량</OrderLabel>
                <OrderInput
                    type="number"
                    min="1"
                    value={orderCount}
                    onChange={(e) => setOrderCount(e.target.value)}
                />
                <OrderButton onClick={handleOrder}>주문하기</OrderButton>
            </OrderWrapper>
        </Container>
    );
}

export default CampaignDetail;
