import { Link } from "react-router-dom";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms.js";

const NavContainer = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding: 1.2rem 4rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    position: sticky;
    top: 0;
    z-index: 1000;
`;

const Logo = styled.div`
    font-size: 1.8rem;
    color: #002366;
    font-weight: 800;
    letter-spacing: -0.5px;
    transition: all 0.2s ease;
    
    &:hover {
        transform: translateY(-1px);
        color: #001844;
    }
`;

const Menu = styled.div`
    display: flex;
    gap: 2rem;
    align-items: center;
`;

const NavLink = styled(Link)`
    position: relative;
    color: #333333;
    font-weight: 600;
    font-size: 1.05rem;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    
    &:hover {
        color: #002366;
        background-color: rgba(0, 35, 102, 0.05);
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: #002366;
        transition: all 0.2s ease;
        transform: translateX(-50%);
    }
    
    &:hover::after {
        width: 80%;
    }
`;

const LogoutButton = styled.button`
    color: #333333;
    font-weight: 600;
    font-size: 1.05rem;
    padding: 0.6rem 1.2rem;
    border: 2px solid transparent;
    border-radius: 8px;
    background: none;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        color: #e53e3e;
        background-color: #FEE2E2;
        border-color: #FCA5A5;
    }
`;

const CreateCampaignButton = styled(NavLink)`
    background-color: #002366;
    color: #ffffff !important;
    padding: 0.6rem 1.4rem;
    border-radius: 8px;
    
    &:hover {
        background-color: #001844;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 35, 102, 0.2);
    }
    
    &:active {
        transform: translateY(0);
    }
    
    &::after {
        display: none;
    }
`;

const AuthButtons = styled.div`
    display: flex;
    gap: 1rem;
    
    ${NavLink}:last-child {
        background-color: #002366;
        color: #ffffff;
        
        &:hover {
            background-color: #001844;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 35, 102, 0.2);
        }
        
        &::after {
            display: none;
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
                    <AuthButtons>
                        <NavLink to="/signin">로그인</NavLink>
                        <NavLink to="/signup">회원가입</NavLink>
                    </AuthButtons>
                ) : (
                    <>
                        <CreateCampaignButton to="/campaigns/create">
                            캠페인 생성하기
                        </CreateCampaignButton>
                        <NavLink to="/orders">주문 목록</NavLink>
                        <LogoutButton onClick={handleLogout}>
                            로그아웃
                        </LogoutButton>
                    </>
                )}
            </Menu>
        </NavContainer>
    );
};

export default NavBar;
