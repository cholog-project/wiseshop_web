import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";

const Container = styled.div`
    max-width: 800px;
    margin: 3rem auto;
    padding: 2.5rem;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 2.5rem;
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
`;

const FormSection = styled.div`
    margin-bottom: 2.5rem;
    
    h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: #1a1a1a;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid rgba(0, 35, 102, 0.1);
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
        color: #4a5568;
        font-size: 0.95rem;
    }
    
    input, textarea {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
        color: #1a1a1a;
        background-color: #ffffff;
        
        &:focus {
            outline: none;
            border-color: #002366;
            box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1);
        }
        
        &::placeholder {
            color: #a0aec0;
        }
    }

    textarea {
        min-height: 120px;
        resize: vertical;
        line-height: 1.5;
    }
`;

const InputWrapper = styled.div`
    position: relative;
    
    input[type="datetime-local"] {
        color: #1a1a1a;
        
        &::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.6;
            
            &:hover {
                opacity: 1;
            }
        }
    }
    
    input[type="number"] {
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 1rem;
    background-color: #002366;
    color: #ffffff;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #001844;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 35, 102, 0.2);
    }
    
    &:active {
        transform: translateY(0);
        box-shadow: none;
    }
`;

const ErrorMessage = styled.span`
    display: block;
    color: #EF4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #FEF2F2;
    border-radius: 0.375rem;
    border: 1px solid #FCA5A5;
`;

const RequiredMark = styled.span`
    color: #EF4444;
    margin-left: 4px;
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
            if (error.response) {
                // 서버에서 응답한 에러 메시지가 있는 경우
                alert(error.response.data.message || "캠페인 등록에 실패했습니다. 다시 시도해주세요.");
            } else {
                alert("캠페인 등록에 실패했습니다. 다시 시도해주세요.");
            }
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
                            <label>
                                펀딩 시작 일시
                                <RequiredMark>*</RequiredMark>
                            </label>
                            <InputWrapper>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </InputWrapper>
                        </FormGroup>
                        <FormGroup>
                            <label>
                                펀딩 종료 일시
                                <RequiredMark>*</RequiredMark>
                            </label>
                            <InputWrapper>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                />
                            </InputWrapper>
                            {errors.endDate && <ErrorMessage>{errors.endDate}</ErrorMessage>}
                        </FormGroup>
                    </FormGrid>
                    <FormGroup>
                        <label>
                            목표 수량
                            <RequiredMark>*</RequiredMark>
                        </label>
                        <InputWrapper>
                            <input
                                type="number"
                                name="goalQuantity"
                                placeholder="달성하고자 하는 목표 수량을 입력해주세요"
                                value={formData.goalQuantity}
                                onChange={handleChange}
                                required
                            />
                        </InputWrapper>
                        {errors.goalQuantity && <ErrorMessage>{errors.goalQuantity}</ErrorMessage>}
                    </FormGroup>
                </FormSection>

                <FormSection>
                    <h2>상품 정보</h2>
                    <FormGroup>
                        <label>
                            상품명
                            <RequiredMark>*</RequiredMark>
                        </label>
                        <InputWrapper>
                            <input
                                type="text"
                                name="productName"
                                placeholder="상품의 이름을 입력해주세요"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                            />
                        </InputWrapper>
                    </FormGroup>
                    <FormGroup>
                        <label>
                            상품 설명
                            <RequiredMark>*</RequiredMark>
                        </label>
                        <InputWrapper>
                            <textarea
                                name="productDesc"
                                placeholder="상품에 대한 상세한 설명을 입력해주세요"
                                value={formData.productDesc}
                                onChange={handleChange}
                                required
                            />
                        </InputWrapper>
                    </FormGroup>
                    <FormGrid>
                        <FormGroup>
                            <label>
                                상품 가격
                                <RequiredMark>*</RequiredMark>
                            </label>
                            <InputWrapper>
                                <input
                                    type="number"
                                    name="productPrice"
                                    placeholder="상품의 판매 가격을 입력해주세요"
                                    value={formData.productPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </InputWrapper>
                            {errors.productPrice && <ErrorMessage>{errors.productPrice}</ErrorMessage>}
                        </FormGroup>
                        <FormGroup>
                            <label>
                                총 재고 수량
                                <RequiredMark>*</RequiredMark>
                            </label>
                            <InputWrapper>
                                <input
                                    type="number"
                                    name="totalStock"
                                    placeholder="준비된 총 재고 수량을 입력해주세요"
                                    value={formData.totalStock}
                                    onChange={handleChange}
                                    required
                                />
                            </InputWrapper>
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
