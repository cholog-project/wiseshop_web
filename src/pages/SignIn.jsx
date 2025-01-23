import { useState } from "react";
import styled from "styled-components";
import {userState} from "../recoil/atoms.js";
import {useNavigate} from "react-router-dom";
import {useSetRecoilState} from "recoil";

const FormContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: ${(props) => props.theme.color.WHITE};
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const FormTitle = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${(props) => props.theme.color.PRIMARY};
  border: none;
  border-radius: 4px;
  color: ${(props) => props.theme.color.WHITE};
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.color.DEEP_BLUE};
  }
`;

const SignIn = () => {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState)

    const handleSignIn = () => {
        // 추후 axios.post("/signin", { email, password }) 등으로 교체
        const mockResponse = {
            id: 123,
            email: "abc@domain.com",
            name: "홍길동",
            token: "JWT_TOKEN",
        };
        setUser({
            ...mockResponse,
            isLoggedIn: true,
        });

        navigate("/");
    };

    return (
        <FormContainer>
            <FormTitle>로그인</FormTitle>
            <form onSubmit={handleSignIn}>
                <FormGroup>
                    <label>이메일</label>
                    <input
                        type="email"
                        placeholder="example@domain.com"
                        // value={email}
                        // onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        // value={password}
                        // onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </FormGroup>
                <SubmitButton type="submit">로그인</SubmitButton>
            </form>
        </FormContainer>
    );
}

export default SignIn;
