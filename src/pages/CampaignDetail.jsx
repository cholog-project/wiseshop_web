import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../api/axiosInstance.js";
import TossPaymentWidget from "../components/TossPaymentWidget.jsx";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, orderDataState } from "../recoil/atoms.js";

const Container = styled.div`
    max-width: 800px;
    margin: 3rem auto;
    background-color: #fff;
    border-radius: 16px;
    padding: 2.5rem;
    color: ${(props) => props.theme.color.DEEP_DARKGRAY};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
    margin-bottom: 2.5rem;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    color: ${props => props.theme.color.DARK};
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 4px;
        background: ${props => props.theme.color.PRIMARY};
        border-radius: 2px;
    }
`;

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
        color: ${props => props.theme.color.DARK};
        display: flex;
        align-items: center;
        
        &::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 20px;
            background: ${props => props.theme.color.PRIMARY};
            margin-right: 0.8rem;
            border-radius: 2px;
        }
    }
    
    p {
        margin-bottom: 0.8rem;
        font-size: 1.1rem;
        color: ${props => props.theme.color.DEEP_DARKGRAY};
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        
        &:not(:last-child) {
            border-bottom: 1px solid #eee;
        }
    }
`;

const OrderWrapper = styled.div`
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const OrderLabel = styled.label`
    font-weight: 600;
    color: ${props => props.theme.color.DARK};
`;

const OrderInput = styled.input`
    width: 80px;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    text-align: center;
    transition: all 0.2s ease;
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.color.PRIMARY};
    }
`;

const OrderButton = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: ${props => props.theme.color.PRIMARY};
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: auto;
    
    &:hover {
        background-color: ${props => props.theme.color.DEEP_BLUE};
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const LoadingSpinner = styled.div`
    text-align: center;
    margin-top: 4rem;
    color: ${props => props.theme.color.PRIMARY};
    font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
    text-align: center;
    margin-top: 4rem;
    padding: 2rem;
    background-color: #FEE2E2;
    border-radius: 12px;
    color: #DC2626;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
`;

const CampaignDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const user = useRecoilValue(userState);
    const [campaign, setCampaign] = useState(null);
    const [orderCount, setOrderCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const setRecoilOrderData = useSetRecoilState(orderDataState);

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

        if (!user.isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/signin");
            return;
        }

        try {
            // TODO : 결제 위젯에 필요한 데이터 설정
            const orderData = {
                orderId: `ORDER_${Date.now()}`,  // 주문번호
                amount: orderCount * campaign.product.price,  // 결제 금액
                orderName: `${campaign.product.name} ${orderCount}개`,  // 주문명
                customerKey: user.uuid,
                customerEmail: "",  // 이메일 (선택)
                customerName: "",   // 이름 (선택)
                customerMobilePhone: "01012345678",  // 전화번호 (선택)
                productId: campaign.product.id,  // 상품 ID
                orderQuantity: orderCount  // 주문 수량
            };
            setOrderData(orderData);
            setRecoilOrderData(orderData);
            
            // 결제 위젯 표시
            setShowPayment(true);
        } catch (error) {
            // 에러 발생 시 결제 위젯 숨기기
            setShowPayment(false);
            setOrderData(null);
            console.error("주문 생성 실패", error);
            alert("주문이 실패했습니다. 다시 시도해주세요.");        
        }
    };

    if (loading) {
        return <LoadingSpinner>캠페인 정보를 불러오는 중입니다...</LoadingSpinner>;
    }

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return (
        <Container>
            <Title>캠페인 상세 (ID: {campaign.campaignId})</Title>

            <Section>
                <h2>캠페인 정보</h2>
                <p>시작일: {campaign.startDate}</p>
                <p>종료일: {campaign.endDate}</p>
                <p>목표 수량: {campaign.goalQuantity}</p>
            </Section>

            <Section>
                <h2>상품 정보</h2>
                <p>상품명: {campaign.product.name}</p>
                <p>가격: {campaign.product.price}원</p>
                <OrderWrapper>
                    <OrderLabel>수량:</OrderLabel>
                    <OrderInput
                        type="number"
                        min="1"
                        value={orderCount}
                        onChange={(e) => setOrderCount(parseInt(e.target.value))}
                    />
                    <OrderButton onClick={handleOrder}>주문하기</OrderButton>
                </OrderWrapper>
            </Section>

            {showPayment && orderData && (
                <Section>
                    <h2>결제</h2>
                    <TossPaymentWidget orderData={orderData} />
                </Section>
            )}
        </Container>
    );
}

export default CampaignDetail;
