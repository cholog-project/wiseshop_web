import { useState } from "react";
import styled from "styled-components";
import axiosInstance from "../api/axiosInstance.js";
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate();

    const [ newMember, setNewMember] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMember({...newMember, [name]: value});
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/signup", newMember);
            alert("회원가입 성공");

            navigate("/signin");
        } catch (error) {
            console.log(error);
            alert("회원가입 실패");
        }
    };

    return (
        <FormContainer>
            <FormTitle>회원가입</FormTitle>
            <form onSubmit={handleSignUp}>
                <FormGroup>
                    <label>이름</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Kong"
                        value={newMember.name}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <label>이메일</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="example@example.com"
                        value={newMember.email}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        value={newMember.password}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <SubmitButton type="submit">회원가입</SubmitButton>
            </form>
        </FormContainer>
    );
}

export default SignUp;
