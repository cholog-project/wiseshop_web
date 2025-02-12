import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";

const Container = styled.div`
    max-width: 800px;
    margin: 3rem auto;
    padding: 2.5rem;
    background-color: ${props => props.theme.color.WHITE};
    box-shadow: ${props => props.theme.shadow.DEFAULT};
    border-radius: 1rem;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 2.5rem;
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.theme.color.DARK};
`;

const FormSection = styled.div`
    margin-bottom: 2.5rem;
    
    h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: ${props => props.theme.color.DARK};
        padding-bottom: 0.5rem;
        border-bottom: 2px solid ${props => props.theme.color.PRIMARY[50]};
    }
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: ${props => props.theme.color.GRAY[700]};
    }
    
    input, textarea {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border: 1px solid ${props => props.theme.color.GRAY[300]};
        border-radius: 0.5rem;
        transition: ${props => props.theme.transition.DEFAULT};
        
        &:focus {
            outline: none;
            border-color: ${props => props.theme.color.PRIMARY.DEFAULT};
            box-shadow: 0 0 0 3px ${props => props.theme.color.PRIMARY[50]};
        }
        
        &::placeholder {
            color: ${props => props.theme.color.GRAY[400]};
        }
    }

    textarea {
        min-height: 120px;
        resize: vertical;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 1rem;
    background-color: ${props => props.theme.color.PRIMARY.DEFAULT};
    color: ${props => props.theme.color.WHITE};
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: ${props => props.theme.transition.DEFAULT};
    
    &:hover {
        background-color: ${props => props.theme.color.PRIMARY.DARK};
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const ErrorMessage = styled.span`
    display: block;
    color: #EF4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
`;

const CampaignCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        goalQuantity: "",
        productName: "",
        productDesc: "",
        productPrice: "",
        totalStock: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // 에러 메시지 초기화
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (parseInt(formData.goalQuantity) <= 0) {
            newErrors.goalQuantity = "목표 수량은 0보다 커야 합니다.";
        }
        if (parseInt(formData.productPrice) <= 0) {
            newErrors.productPrice = "상품 가격은 0보다 커야 합니다.";
        }
        if (parseInt(formData.totalStock) <= 0) {
            newErrors.totalStock = "재고 수량은 0보다 커야 합니다.";
        }
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            newErrors.endDate = "종료일은 시작일 이후여야 합니다.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const campaignData = {
            startDate: formData.startDate,
            endDate: formData.endDate,
            goalQuantity: parseInt(formData.goalQuantity),
            productRequest: {
                name: formData.productName,
                description: formData.productDesc,
                price: parseInt(formData.productPrice),
                totalQuantity: parseInt(formData.totalStock),
            },
        };

        try {
            const response = await axiosInstance.post("/campaigns", campaignData);
            alert("캠페인이 성공적으로 등록되었습니다!");
            navigate(`/campaigns/${response.data.campaignId}`);
        } catch (error) {
            alert("캠페인 등록에 실패했습니다. 다시 시도해주세요.");
            console.error("캠페인 생성 실패:", error);
        }
    };

    return (
        <Container>
            <Title>새로운 캠페인 등록</Title>
            <form onSubmit={handleSubmit}>
                <FormSection>
                    <h2>캠페인 기본 정보</h2>
                    <FormGrid>
                        <FormGroup>
                            <label>펀딩 시작 일시</label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>펀딩 종료 일시</label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                            {errors.endDate && <ErrorMessage>{errors.endDate}</ErrorMessage>}
                        </FormGroup>
                    </FormGrid>
                    <FormGroup>
                        <label>목표 수량</label>
                        <input
                            type="number"
                            name="goalQuantity"
                            placeholder="달성하고자 하는 목표 수량을 입력해주세요"
                            value={formData.goalQuantity}
                            onChange={handleChange}
                            required
                        />
                        {errors.goalQuantity && <ErrorMessage>{errors.goalQuantity}</ErrorMessage>}
                    </FormGroup>
                </FormSection>

                <FormSection>
                    <h2>상품 정보</h2>
                    <FormGroup>
                        <label>상품명</label>
                        <input
                            type="text"
                            name="productName"
                            placeholder="상품의 이름을 입력해주세요"
                            value={formData.productName}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>상품 설명</label>
                        <textarea
                            name="productDesc"
                            placeholder="상품에 대한 상세한 설명을 입력해주세요"
                            value={formData.productDesc}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGrid>
                        <FormGroup>
                            <label>상품 가격</label>
                            <input
                                type="number"
                                name="productPrice"
                                placeholder="상품의 판매 가격을 입력해주세요"
                                value={formData.productPrice}
                                onChange={handleChange}
                                required
                            />
                            {errors.productPrice && <ErrorMessage>{errors.productPrice}</ErrorMessage>}
                        </FormGroup>
                        <FormGroup>
                            <label>총 재고 수량</label>
                            <input
                                type="number"
                                name="totalStock"
                                placeholder="준비된 총 재고 수량을 입력해주세요"
                                value={formData.totalStock}
                                onChange={handleChange}
                                required
                            />
                            {errors.totalStock && <ErrorMessage>{errors.totalStock}</ErrorMessage>}
                        </FormGroup>
                    </FormGrid>
                </FormSection>

                <SubmitButton type="submit">캠페인 등록하기</SubmitButton>
            </form>
        </Container>
    );
}

export default CampaignCreate;
