import {Link} from "react-router-dom";
import styled from "styled-components";
import {useRecoilState} from "recoil";
import {userState} from "../recoil/atoms.js";

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.color.WHITE};
  padding: 1rem 2rem;
  box-shadow: ${props => props.theme.shadow.sm};
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.color.PRIMARY.DEFAULT};
  font-weight: 700;
  
  &:hover {
    color: ${props => props.theme.color.PRIMARY.DARK};
  }
`;

const Menu = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  
  a, button {
    color: ${props => props.theme.color.GRAY[600]};
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: ${props => props.theme.transition.DEFAULT};
    
    &:hover {
      color: ${props => props.theme.color.PRIMARY.DEFAULT};
      background-color: ${props => props.theme.color.PRIMARY[50]};
      text-decoration: none;
    }
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
  }
`;

const NavBar = () => {
    const [user, setUser] = useRecoilState(userState);

    const handleLogout = () => {
        setUser({isLoggedIn: false});
        localStorage.removeItem("userState");
    };

    return (
        <NavContainer>
            <Link to="/">
                <Logo>WiseShop</Logo>
            </Link>
            <Menu>
                {!user.isLoggedIn ? (
                    <>
                        <Link to="/signin">Sign In</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                ) : (
                    <>
                        <Link to="/campaigns/create">캠페인 생성하기</Link>
                        <Link to="/orders">주문 목록</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </Menu>
        </NavContainer>
    );
}

export default NavBar;