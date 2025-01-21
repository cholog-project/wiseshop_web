import { useState } from "react";
import styled from "styled-components";

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
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.color.DEEP_BLUE};
  }
`;

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = (e) => {
        e.preventDefault();
        // 추후 axios.post("/signup", { email, name, password }) 등으로 교체
        console.log("SignUp:", { email, name, password });
        alert("회원가입 기능은 추후 구현 예정!");
    };

    return (
        <FormContainer>
            <FormTitle>회원가입</FormTitle>
            <form onSubmit={handleSignUp}>
                <FormGroup>
                    <label>이메일</label>
                    <input
                        type="email"
                        placeholder="example@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <label>이름</label>
                    <input
                        type="text"
                        placeholder="홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </FormGroup>
                <SubmitButton type="submit">회원가입</SubmitButton>
            </form>
        </FormContainer>
    );
}

export default SignUp;
