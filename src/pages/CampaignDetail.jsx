import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../api/axiosInstance.js";

const Container = styled.div`
    max-width: 800px;
    margin: 2rem auto;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 1.5rem;
    color: ${(props) => props.theme.color.DEEP_DARKGRAY};
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
    const navigate = useNavigate();
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [orderCount, setOrderCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await axiosInstance.get(`/campaigns/${id}`);
                setCampaign(response.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("캠페인 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchCampaign();
    }, [id]);

    // 주문하기 버튼
    const handleOrder = async () => {
        if (orderCount < 1) {
            alert("1개 이상의 수량을 입력해주세요.");
            return;
        }

        try {
            await axiosInstance.post(`/orders`, {
                productId: campaign.product.productId,
                orderQuantity: orderCount,
            });
            alert("주문이 성공적으로 완료되었습니다.");
            navigate("/orders");
        } catch (error) {
            console.error("주문 생성 실패");
            alert("주문이 실패했습니다. 다시 시도해주세요.");
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "2rem" }}>로딩중...</div>;
    }

    if (error) {
        return <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>{error}</div>;
    }

    return (
        <Container>
            <Title>캠페인 상세 (ID: {campaign.campaignId})</Title>

            <Section>
                <h2>캠페인 정보</h2>
                <p>시작일: {campaign.startDate}</p>
                <p>종료일: {campaign.endDate}</p>
                <p>목표 수량: {campaign.goalQuantity}</p>
                {/*<p>판매(펀딩)된 수량: {campaign.soldQuantity}</p>*/}
            </Section>

            <Section>
                <h2>상품 정보</h2>
                <p>상품명: {campaign.product.name}</p>
                <p>상품설명: {campaign.product.description}</p>
                <p>가격: {campaign.product.price.toLocaleString()}원</p>
            </Section>

            <Section>
                <h2>재고 정보</h2>
                <p>총 재고: {campaign.product.totalQuantity}</p>
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
