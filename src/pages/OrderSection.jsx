import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../api/axiosInstance';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Section = styled.div`
    margin-bottom: 2rem;
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const OrderControls = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
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

const ErrorMessage = styled.div`
    color: #dc2626;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    padding: 0.75rem;
    background-color: #fee2e2;
    border-radius: 8px;
`;

const AddressSelect = styled.select`
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 1rem;
    
    &:focus {
        outline: none;
        border-color: #002366;
        box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1);
    }
`;

const OrderSection = ({ campaign }) => {
    const navigate = useNavigate();
    const [orderCount, setOrderCount] = useState(1);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await axiosInstance.get('/address');
            setAddresses(response.data);
            if (response.data.length > 0) {
                setSelectedAddressId(response.data[0].id);
            }
        } catch (error) {
            console.error("배송지 목록 조회 실패:", error);
            setError("배송지 정보를 불러오는데 실패했습니다.");
        }
    };

    const handleCountChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setOrderCount(Math.max(1, value));
    };

    const handleOrder = async () => {
        if (!selectedAddressId) {
            setError("배송지를 선택해주세요.");
            return;
        }

        try {
            const orderData = {
                count: orderCount,
                productId: campaign.product.id,
                addressId: selectedAddressId,
                orderQuantity: orderCount
            };

            await axiosInstance.post('/orders', orderData);
            alert("주문이 완료되었습니다!");
            navigate('/orders');
        } catch (error) {
            console.error("주문 실패:", error);
            setError(error.response?.data?.message || "주문에 실패했습니다. 다시 시도해주세요.");
        }
    };

    if (addresses.length === 0) {
        return (
            <Section>
                <ErrorMessage>
                    배송지 정보가 없습니다. 배송지를 먼저 등록해주세요.
                </ErrorMessage>
                <OrderButton onClick={() => navigate('/address/create')}>
                    배송지 등록하기
                </OrderButton>
            </Section>
        );
    }

    return (
        <Section>
            <AddressSelect
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
            >
                {addresses.map(address => (
                    <option key={address.id} value={address.id}>
                        {address.roadAddress} {address.detailAddress}
                    </option>
                ))}
            </AddressSelect>

            <OrderControls>
                <OrderInput
                    type="number"
                    min="1"
                    value={orderCount}
                    onChange={handleCountChange}
                />
                <OrderButton onClick={handleOrder}>
                    주문하기
                </OrderButton>
            </OrderControls>

            <TotalPrice>
                총 금액: {(orderCount * campaign.product.price).toLocaleString()}원
            </TotalPrice>

            {error && <ErrorMessage>{error}</ErrorMessage>}
        </Section>
    );
};

OrderSection.propTypes = {
    campaign: PropTypes.shape({
        product: PropTypes.shape({
            id: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default OrderSection;