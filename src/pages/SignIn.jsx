import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { userState } from "../recoil/atoms.js";

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

const SignIn = () => {
    const [member, setMember] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const setUser = useSetRecoilState(userState);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMember({ ...member, [name]: value });
        setError(""); // 입력 시 에러 메시지 초기화
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/signin", member);
            const userData = {
                isLoggedIn: true,
                uuid: response.data.uuid,
            };
            setUser(userData);
            localStorage.setItem("userState", JSON.stringify(userData));
            navigate("/");
        } catch (error) {
            console.error("로그인 실패:", error);
            setError(error.response?.data?.message || "로그인에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <PageContainer>
            <FormContainer>
                <FormTitle>
                    Welcome Back
                    <span>서비스를 이용하려면 로그인해주세요</span>
                </FormTitle>
                <form onSubmit={handleSignIn}>
                    <FormGroup>
                        <label>이메일</label>
                        <Input
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            value={member.email}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>비밀번호</label>
                        <Input
                            type="password"
                            name="password"
                            placeholder="비밀번호를 입력하세요"
                            value={member.password}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <SubmitButton type="submit">로그인</SubmitButton>
                </form>
                <AdditionalLinks>
                    계정이 없으신가요?
                    <a href="/signup">회원가입</a>
                </AdditionalLinks>
            </FormContainer>
        </PageContainer>
    );
};

export default SignIn;
