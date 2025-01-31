import {Link} from "react-router-dom";
import styled from "styled-components";
import {useRecoilState} from "recoil";
import {userState} from "../recoil/atoms.js";

const NavContainer = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${(props) => props.theme.color.PRIMARY};
    padding: 1rem 2rem;
`;

const Logo = styled.div`
    font-size: 1.5rem;
    color: ${(props) => props.theme.color.WHITE};
    font-weight: bold;
`;

const Menu = styled.div` 
    a, button {
        margin-left: 1rem;
        color: ${(props) => props.theme.color.WHITE};
        font-weight: 500;
        background: none;
        border: none;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
        &:hover {
            text-decoration: underline;
        } 
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