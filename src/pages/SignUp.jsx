import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";

const PageContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const FormContainer = styled.div`
    width: 100%;
    max-width: 520px;
    padding: 3rem 4rem;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
`;

const FormTitle = styled.h1`
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.2rem;
    font-weight: 700;
    color: #1a1a1a;
    
    span {
        display: block;
        font-size: 1.1rem;
        color: #555555;
        margin-top: 0.75rem;
        font-weight: 400;
    }
`;

const FormGroup = styled.div`
    margin-bottom: 2rem;
    
    label {
        display: block;
        margin-bottom: 0.8rem;
        font-weight: 600;
        color: #333333;
        font-size: 1rem;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 1rem 1.2rem;
    font-size: 1.05rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    background-color: #ffffff;
    transition: all 0.2s ease;
    color: #333333;
    
    &:focus {
        outline: none;
        border-color: #002366;
        box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1);
    }
    
    &::placeholder {
        color: #a0aec0;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 1.2rem;
    margin-top: 2rem;
    background-color: #002366;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #001844;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 35, 102, 0.2);
    }
    
    &:active {
        transform: translateY(0);
        box-shadow: none;
    }
`;

const AdditionalLinks = styled.div`
    margin-top: 2rem;
    text-align: center;
    font-size: 1rem;
    color: #555555;
    padding-top: 2rem;
    border-top: 1px solid #e2e8f0;
    
    a {
        color: #002366;
        text-decoration: none;
        margin-left: 0.5rem;
        font-weight: 600;
        
        &:hover {
            text-decoration: underline;
        }
    }
`;

const ErrorMessage = styled.div`
    color: #e53e3e;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: #FEE2E2;
    border-radius: 8px;
    display: flex;
    align-items: center;
    
    &::before {
        content: "!";
        display: inline-block;
        width: 20px;
        height: 20px;
        background-color: #e53e3e;
        color: white;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        margin-right: 8px;
        font-weight: bold;
    }
`;

const PasswordRequirements = styled.ul`
    list-style: none;
    padding: 0.75rem 0;
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: #555555;
    
    li {
        margin-bottom: 0.4rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        &::before {
            content: "✓";
            color: #002366;
            font-weight: bold;
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
