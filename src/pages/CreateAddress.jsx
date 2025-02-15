import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../api/axiosInstance";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms";

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

const FormSection = styled.div`
    margin-bottom: 2rem;
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;
    
    label {
        display: block;
        font-size: 0.95rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #1a1a1a;
    }
`;

const Input = styled.input`
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

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

const Button = styled.button`
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
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

const SubmitButton = styled(Button)`
    background-color: #002366;
    color: #ffffff;
    
    &:hover {
        background-color: #001844;
    }
`;

const DeleteButton = styled(Button)`
    background-color: #ffffff;
    color: #dc2626;
    border: 2px solid #dc2626;
    
    &:hover {
        background-color: #dc2626;
        color: #ffffff;
    }
`;

const ErrorText = styled.p`
    color: #dc2626;
    font-size: 0.9rem;
    margin-top: 0.5rem;
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top: 1rem;
`;

const Checkbox = styled.input`
    width: 20px;
    height: 20px;
    margin-right: 0.75rem;
    cursor: pointer;
    accent-color: #002366;
`;

const CheckboxLabel = styled.label`
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
    cursor: pointer;
`;

const ShippingAddressForm = () => {
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    const [existingAddress, setExistingAddress] = useState(null);
    const [formData, setFormData] = useState({
        postalCode: '',
        roadAddress: '',
        detailAddress: '',
        isDefault: false
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!user.isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/signin");
            return;
        }
        
        const fetchAddress = async () => {
            try {
                const response = await axiosInstance.get(`/members/address`);
                if (response.data) {
                    setExistingAddress(response.data);
                    setFormData({
                        postalCode: response.data.postalCode || '',
                        roadAddress: response.data.roadAddress || '',
                        detailAddress: response.data.detailAddress || '',
                        isDefault: response.data.isDefault || false
                    });
                }
            } catch (error) {
                console.error("배송지 정보 조회 실패:", error);
            }
        };

        fetchAddress();
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.postalCode) {
            newErrors.postalCode = "우편번호를 입력해주세요.";
        }
        
        if (!formData.roadAddress) {
            newErrors.roadAddress = "도로명 주소를 입력해주세요.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            if (existingAddress) {
                await axiosInstance.put(`/members/address/${existingAddress.id}`, formData);
                alert("배송지가 수정되었습니다.");
            } else {
                await axiosInstance.post(`/members/address`, formData);
                alert("배송지가 등록되었습니다.");
            }
            navigate(-1);
        } catch (error) {
            console.error("배송지 저장 실패:", error);
            alert("배송지 저장에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleDelete = async () => {
        if (!existingAddress) {
            alert("삭제할 배송지 정보가 없습니다.");
            return;
        }

        if (!window.confirm("배송지를 삭제하시겠습니까?")) {
            return;
        }

        try {
            await axiosInstance.delete(`/member/address/${existingAddress.id}`);
            alert("배송지가 삭제되었습니다.");
            navigate(-1);
        } catch (error) {
            console.error("배송지 삭제 실패:", error);
            alert("배송지 삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <Container>
            <Title>{existingAddress ? '배송지 수정' : '배송지 등록'}</Title>
            
            <form onSubmit={handleSubmit}>
                <FormSection>
                    <FormGroup>
                        <label>우편번호</label>
                        <Input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="우편번호를 입력해주세요"
                        />
                        {errors.postalCode && <ErrorText>{errors.postalCode}</ErrorText>}
                    </FormGroup>

                    <FormGroup>
                        <label>도로명 주소</label>
                        <Input
                            type="text"
                            name="roadAddress"
                            value={formData.roadAddress}
                            onChange={handleInputChange}
                            placeholder="도로명 주소를 입력해주세요"
                        />
                        {errors.roadAddress && <ErrorText>{errors.roadAddress}</ErrorText>}
                    </FormGroup>

                    <FormGroup>
                        <label>상세 주소</label>
                        <Input
                            type="text"
                            name="detailAddress"
                            value={formData.detailAddress}
                            onChange={handleInputChange}
                            placeholder="상세주소를 입력해주세요"
                        />
                    </FormGroup>

                    <CheckboxWrapper>
                        <Checkbox
                            type="checkbox"
                            id="isDefault"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleInputChange}
                        />
                        <CheckboxLabel htmlFor="isDefault">
                            기본 배송지로 설정
                        </CheckboxLabel>
                    </CheckboxWrapper>
                </FormSection>

                <ButtonGroup>
                    <SubmitButton type="submit">
                        {existingAddress ? '배송지 수정하기' : '배송지 등록하기'}
                    </SubmitButton>
                    {existingAddress && (
                        <DeleteButton type="button" onClick={handleDelete}>
                            배송지 삭제하기
                        </DeleteButton>
                    )}
                </ButtonGroup>
            </form>
        </Container>
    );
};

export default ShippingAddressForm;
