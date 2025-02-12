import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";

const PageContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const FormContainer = styled.div`
    width: 100%;
    max-width: 450px;
    padding: 2.5rem;
    background-color: ${props => props.theme.color.WHITE};
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
`;

const FormTitle = styled.h1`
    text-align: center;
    margin-bottom: 2.5rem;
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.theme.color.DARK};
    
    span {
        display: block;
        font-size: 1rem;
        color: ${props => props.theme.color.DARKGRAY};
        margin-top: 0.5rem;
        font-weight: 400;
    }
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;
    
    label {
        display: block;
        margin-bottom: 0.75rem;
        font-weight: 500;
        color: ${props => props.theme.color.DEEP_DARKGRAY};
        font-size: 0.95rem;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 1rem;
    border: 2px solid ${props => props.theme.color.WHITE};
    border-radius: 12px;
    background-color: #f8f9fa;
    transition: all 0.2s ease;
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.color.PRIMARY};
        background-color: ${props => props.theme.color.WHITE};
    }
    
    &::placeholder {
        color: #adb5bd;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    background-color: ${props => props.theme.color.PRIMARY};
    color: ${props => props.theme.color.WHITE};
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: ${props => props.theme.color.DEEP_BLUE};
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const AdditionalLinks = styled.div`
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.95rem;
    color: ${props => props.theme.color.DARKGRAY};
    
    a {
        color: ${props => props.theme.color.PRIMARY};
        text-decoration: none;
        margin-left: 0.5rem;
        font-weight: 500;
        
        &:hover {
            text-decoration: underline;
        }
    }
`;

const ErrorMessage = styled.div`
    color: #e53e3e;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    padding-left: 0.5rem;
`;

const PasswordRequirements = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
    font-size: 0.85rem;
    color: ${props => props.theme.color.DARKGRAY};
    
    li {
        margin-bottom: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        &::before {
            content: "•";
            color: ${props => props.theme.color.PRIMARY};
        }
    }
`;

const SignUp = () => {
    const navigate = useNavigate();
    const [newMember, setNewMember] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMember({ ...newMember, [name]: value });
        setError(""); // 입력 시 에러 메시지 초기화
    };

    const validateForm = () => {
        if (newMember.password.length < 8) {
            setError("비밀번호는 최소 8자 이상이어야 합니다.");
            return false;
        }
        return true;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await axiosInstance.post("/signup", newMember);
            alert("회원가입이 완료되었습니다!");
            navigate("/signin");
        } catch (error) {
            console.error("회원가입 실패:", error);
            setError(error.response?.data?.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <PageContainer>
            <FormContainer>
                <FormTitle>
                    회원가입
                    <span>WiseShop의 새로운 멤버가 되어주세요</span>
                </FormTitle>
                <form onSubmit={handleSignUp}>
                    <FormGroup>
                        <label>이름</label>
                        <Input
                            type="text"
                            name="name"
                            placeholder="이름을 입력해주세요"
                            value={newMember.name}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>이메일</label>
                        <Input
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            value={newMember.email}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>비밀번호</label>
                        <Input
                            type="password"
                            name="password"
                            placeholder="안전한 비밀번호를 입력해주세요"
                            value={newMember.password}
                            onChange={handleChange}
                            required
                        />
                        <PasswordRequirements>
                            <li>최소 8자 이상</li>
                        </PasswordRequirements>
                    </FormGroup>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <SubmitButton type="submit">가입하기</SubmitButton>
                </form>
                <AdditionalLinks>
                    이미 계정이 있으신가요?
                    <a href="/signin">로그인</a>
                </AdditionalLinks>
            </FormContainer>
        </PageContainer>
    );
};

export default SignUp;
