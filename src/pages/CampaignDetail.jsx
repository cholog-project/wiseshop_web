import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../api/axiosInstance.js";
import TossPaymentWidget from "../components/TossPaymentWidget.jsx";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, orderDataState } from "../recoil/atoms.js";

const Container = styled.div`
    max-width: 800px;
    margin: 3rem auto;
    background-color: #ffffff;
    border-radius: 16px;
    padding: 2.5rem;
    color: #333333;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

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
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
`;

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
`;

const ProductCard = styled.div`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.5rem;
    margin-top: 1rem;
`;

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
`;

const PriceTag = styled.div`
    font-size: 1.5rem;
    font-weight: 700;
    color: #002366;
    margin-bottom: 1rem;
`;

const OrderControls = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
`;

const OrderInput = styled.input`
    width: 100px;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    text-align: center;
    
    &:focus {
        outline: none;
        border-color: #002366;
        box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1);
    }
    
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const OrderButton = styled.button`
    flex: 1;
    padding: 0.75rem 1.5rem;
    background-color: #002366;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #001844;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 35, 102, 0.2);
    }
    
    &:active {
        transform: translateY(0);
    }
    
    &:disabled {
        background-color: #a0aec0;
        cursor: not-allowed;
    }
`;

const TotalPrice = styled.div`
    text-align: right;
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: #002366;
`;

const LoadingSpinner = styled.div`
    text-align: center;
    margin-top: 4rem;
    color: #002366;
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
        let mounted = true;

        const fetchCampaign = async () => {
            try {
                const response = await axiosInstance.get(`/campaigns/${id}`);
                if (mounted) {
                    setCampaign(response.data);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    console.error(err);
                    setError("캠페인 정보를 불러오지 못했습니다.");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchCampaign();

        return () => {
            mounted = false;
        };
    }, [id]);

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
            const orderData = {
                orderId: `ORDER_${Date.now()}`,
                amount: orderCount * campaign.product.price,
                orderName: `${campaign.product.name} ${orderCount}개`,
                customerKey: user.uuid,
                customerEmail: "",
                customerName: "",
                customerMobilePhone: "01012345678",
                productId: campaign.product.id,
                orderQuantity: orderCount
            };
            setOrderData(orderData);
            setRecoilOrderData(orderData);
            setShowPayment(true);
        } catch (error) {
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
            <Title>캠페인 상세</Title>

            <Section>
                <h2>캠페인 정보</h2>
                <InfoGrid>
                    <InfoItem>
                        <div className="label">시작일</div>
                        <div className="value">
                            {new Date(campaign.startDate).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false // 24시간 형식
                            })}
                        </div>
                    </InfoItem>
                    <InfoItem>
                        <div className="label">종료일</div>
                        <div className="value">
                            {new Date(campaign.endDate).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false // 24시간 형식
                            })}
                        </div>
                    </InfoItem>
                    <InfoItem>
                        <div className="label">목표 수량</div>
                        <div className="value">
                            {campaign.goalQuantity.toLocaleString()}개
                        </div>
                    </InfoItem>
                </InfoGrid>
            </Section>

            <Section>
                <h2>상품 정보</h2>
                <ProductCard>
                    <ProductInfo>
                        <h3>{campaign.product.name}</h3>
                        <p>{campaign.product.description}</p>
                    </ProductInfo>
                    <PriceTag>{campaign.product.price.toLocaleString()}원</PriceTag>
                    <OrderControls>
                        <OrderInput
                            type="number"
                            min="1"
                            value={orderCount}
                            onChange={(e) => setOrderCount(parseInt(e.target.value) || 1)}
                        />
                        <OrderButton 
                            onClick={handleOrder}
                            disabled={!user.isLoggedIn}
                        >
                            {user.isLoggedIn ? '주문하기' : '로그인 필요'}
                        </OrderButton>
                    </OrderControls>
                    <TotalPrice>
                        총 금액: {(orderCount * campaign.product.price).toLocaleString()}원
                    </TotalPrice>
                </ProductCard>
            </Section>

            {showPayment && orderData && (
                <Section>
                    <h2>결제</h2>
                    <TossPaymentWidget orderData={orderData} />
                </Section>
            )}
        </Container>
    );
};

export default CampaignDetail;
