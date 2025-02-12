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

const RememberMeSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -1rem;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
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
                    로그인
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
