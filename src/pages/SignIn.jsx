import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import {useState} from "react";
import {useSetRecoilState} from "recoil";
import {userState} from "../recoil/atoms.js";

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
    const [ member, setMember ] = useState({email: "", password: "" });
    const setUser = useSetRecoilState(userState);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMember({...member, [name]: value});
    }

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
            console.log(error);
            alert(error.message);
        }
    };

    return (
        <FormContainer>
            <FormTitle>로그인</FormTitle>
            <form onSubmit={handleSignIn}>
                <FormGroup>
                    <label>이메일</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="example@domain.com"
                        value={member.email}
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
                        value={member.password}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <SubmitButton type="submit">로그인</SubmitButton>
            </form>
        </FormContainer>
    );
}

export default SignIn;
