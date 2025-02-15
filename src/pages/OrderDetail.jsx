import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../api/axiosInstance";

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
`;

const DeleteButton = styled.button`
    margin-top: 2rem;
    width: 100%;
    padding: 1rem;
    background-color: #DC2626;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #B91C1C;
    }
    
    &:disabled {
        background-color: #999;
        cursor: not-allowed;
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
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    
    h3 {
        margin-bottom: 1rem;
        font-size: 1.3rem;
        color: #1a1a1a;
    }
    
    p {
        margin-bottom: 1.5rem;
        color: #666;
        line-height: 1.5;
    }
`;

const ModalButtons = styled.div`
    display: flex;
    gap: 1rem;
    
    button {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &.cancel {
            background-color: #e5e7eb;
            color: #4b5563;
            
            &:hover {
                background-color: #d1d5db;
            }
        }
        
        &.confirm {
            background-color: #DC2626;
            color: white;
            
            &:hover {
                background-color: #B91C1C;
            }
        }
        
        &:disabled {
            background-color: #999;
            cursor: not-allowed;
        }
    }
`;

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await axiosInstance.get(`/orders/${id}`);
                setOrder(response.data);
                setError(null);
            } catch (err) {
                console.error('주문 정보 조회 실패:', err);
                setError('주문 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id]);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteConfirm = async () => {
        try {
            setDeleting(true);
            await axiosInstance.delete(`/orders/${id}`);
            navigate('/orders', { replace: true });
        } catch (err) {
            console.error('주문 삭제 실패:', err);
            setError('주문 삭제에 실패했습니다.');
            setShowDeleteModal(false);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner>주문 정보를 불러오는 중입니다...</LoadingSpinner>;
    }

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return (
        <>
            <Container>
                <Title>주문 상세 정보</Title>

                <Section>
                    <h2>주문 정보</h2>
                    <InfoGrid>
                        <InfoItem>
                            <div className="label">주문 번호</div>
                            <div className="value">{order.id}</div>
                        </InfoItem>
                        <InfoItem>
                            <div className="label">주문일시</div>
                            <div className="value">
                                {new Date(order.createdDate).toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}
                            </div>
                        </InfoItem>
                    </InfoGrid>
                </Section>

                <Section>
                    <h2>상품 정보</h2>
                    <InfoGrid>
                        <InfoItem>
                            <div className="label">상품 ID</div>
                            <div className="value">{order.productId}</div>
                        </InfoItem>
                        <InfoItem>
                            <div className="label">상품명</div>
                            <div className="value">{order.productName}</div>
                        </InfoItem>
                        <InfoItem>
                            <div className="label">주문 수량</div>
                            <div className="value">{order.count.toLocaleString()}개</div>
                        </InfoItem>
                    </InfoGrid>
                </Section>

                <Section>
                    <h2>배송 정보</h2>
                    <InfoGrid>
                        <InfoItem>
                            <div className="label">배송지</div>
                            <div className="value">{order.address}</div>
                        </InfoItem>
                    </InfoGrid>
                </Section>

                <Section>
                    <h2>주문 처리 이력</h2>
                    <InfoGrid>
                        <InfoItem>
                            <div className="label">주문 생성</div>
                            <div className="value">
                                {new Date(order.createdDate).toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}
                            </div>
                        </InfoItem>
                        <InfoItem>
                            <div className="label">최종 수정</div>
                            <div className="value">
                                {new Date(order.modifiedDate).toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}
                            </div>
                        </InfoItem>
                    </InfoGrid>
                </Section>

                <DeleteButton 
                    onClick={handleDeleteClick}
                    disabled={deleting}
                >
                    {deleting ? '삭제 중...' : '주문 삭제'}
                </DeleteButton>
            </Container>

            {showDeleteModal && (
                <Modal>
                    <ModalContent>
                        <h3>주문 삭제</h3>
                        <p>
                            정말로 이 주문을 삭제하시겠습니까?<br />
                            이 작업은 되돌릴 수 없습니다.
                        </p>
                        <ModalButtons>
                            <button 
                                className="cancel" 
                                onClick={handleDeleteCancel}
                                disabled={deleting}
                            >
                                취소
                            </button>
                            <button 
                                className="confirm" 
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                            >
                                {deleting ? '삭제 중...' : '삭제'}
                            </button>
                        </ModalButtons>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default OrderDetail;
