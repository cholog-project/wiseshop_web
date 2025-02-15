import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms";

const NavContainer = styled.nav`
    background-color: #ffffff;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
`;

const NavContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled(Link)`
    font-size: 1.5rem;
    font-weight: 700;
    color: #002366;
    text-decoration: none;
    
    &:hover {
        color: #001844;
    }
`;

const MenuList = styled.ul`
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
`;

const MenuItem = styled.li`
    position: relative;
`;

const MenuLink = styled(Link)`
    text-decoration: none;
    color: #333333;
    font-weight: 500;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
        color: #002366;
    }
    
    &.active {
        color: #002366;
        font-weight: 600;
        
        &::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #002366;
            border-radius: 1px;
        }
    }
`;

const AuthButton = styled.button`
    background: none;
    border: none;
    color: #333333;
    font-weight: 500;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
        color: #002366;
    }
`;

const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userState);

    const menuItems = [
        {
            label: "홈",
            path: "/",
            icon: "🏠"
        },
        {
            label: "상품목록",
            path: "/products",
            icon: "📦"
        },
        {
            label: "주문내역",
            path: "/orders",
            icon: "📋",
            requireAuth: true
        },
        {
            label: "배송지 관리",
            path: "/address",
            icon: "📍",
            requireAuth: true
        }
    ];

    const handleLogout = () => {
        setUser({
            isLoggedIn: false,
            uuid: null,
            email: null,
            nickname: null,
            role: null
        });
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <NavContainer>
            <NavContent>
                <Logo to="/">WISESHOP</Logo>
                <MenuList>
                    {menuItems.map((item) => (
                        (!item.requireAuth || (item.requireAuth && user.isLoggedIn)) && (
                            <MenuItem key={item.path}>
                                <MenuLink 
                                    to={item.path}
                                    className={location.pathname === item.path ? "active" : ""}
                                >
                                    {item.icon} {item.label}
                                </MenuLink>
                            </MenuItem>
                        )
                    ))}
                    {user.isLoggedIn ? (
                        <MenuItem>
                            <AuthButton onClick={handleLogout}>
                                👋 로그아웃
                            </AuthButton>
                        </MenuItem>
                    ) : (
                        <MenuItem>
                            <MenuLink 
                                to="/signin"
                                className={location.pathname === "/signin" ? "active" : ""}
                            >
                                🔑 로그인
                            </MenuLink>
                        </MenuItem>
                    )}
                </MenuList>
            </NavContent>
        </NavContainer>
    );
};

export default NavBar;
